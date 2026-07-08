import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { pool } from "./db/pool";
import authRoutes from "./routes/auth.routes";
import empresasRoutes from "./routes/empresas.routes";
import { tratarErros } from './middlewares/error.middleware';
import { apiReference } from '@scalar/express-api-reference';
import { swaggerSpec } from './config/swagger';



dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Configuração do Swagger e Escalar API Reference
app.use('/docs', apiReference({
  spec: { content: swaggerSpec },
}));

// Middlewares globais
app.use(cors());
app.use(express.json()); // permite ler JSON no corpo dos pedidos (req.body)

//rotas
app.use("/api/auth", authRoutes);
app.use("/api/empresas", empresasRoutes);
app.use(tratarErros);

// Rota de health-check — confirma que a API e a BD estão vivas
app.get("/health", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW() as agora");
    res.json({
      status: "ok",
      api: "KwanzaFolha API (TypeScript)",
      db_time: result.rows[0].agora,
    });
  } catch (err) {
    res
      .status(500)
      .json({ status: "erro", message: "Falha na ligação à base de dados" });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Servidor a correr em http://localhost:${PORT}`);
});
