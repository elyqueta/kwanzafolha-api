import express from "express";
import cors from "cors";
import helmet from "helmet";
import { pool } from "./db/pool";
import authRoutes from "./routes/auth.routes";
import empresasRoutes from "./routes/empresas.routes";
import { tratarErros } from "./middlewares/error.middleware";
import { apiReference } from "@scalar/express-api-reference";
import { swaggerSpec } from "./config/swagger";
import { env } from "./config/env";

const app = express();
const PORT = env.PORT;

const helmetPadrao = helmet();
const helmetScalar = helmet({ contentSecurityPolicy: false });

// Middlewares globais
// O Helmet define headers HTTP de segurança e deve ser o primeiro middleware global.
// No Scalar, apenas a CSP é desativada porque a UI usa recursos inline; os restantes headers continuam ativos.
app.use((req, res, next) => {
  if (req.path === "/docs" || req.path.startsWith("/docs/")) {
    helmetScalar(req, res, next);
    return;
  }

  helmetPadrao(req, res, next);
});
app.use(
  cors({
    // A função permite aceitar pedidos sem Origin, como os feitos por curl ou Postman.
    origin: (origin, callback) => {
      if (origin === undefined || env.CORS_ALLOWED_ORIGINS.includes(origin)) {
        callback(null, true);
        return;
      }

      callback(null, false);
    },
  }),
);
app.use(express.json()); // permite ler JSON no corpo dos pedidos (req.body)

// Configuração do Swagger e Scalar API Reference
app.use(
  "/docs",
  apiReference({
    spec: { content: swaggerSpec },
  }),
);

//rotas
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresasRoutes);
app.use(tratarErros);

// Rota de health-check — confirma que a API e a BD estão vivas
app.get("/health", async (_req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as agora");
    res.json({
      status: "ok",
      api: "KwanzaFolha API (TypeScript)",
      db_time: result.rows[0].agora,
    });
  } catch (err) {
    res.status(500).json({ status: "erro", message: "Falha na ligação à base de dados" });
  }
});

app.listen(PORT, () => {
  console.log(`Servidor a correr em http://localhost:${PORT}`);
});
