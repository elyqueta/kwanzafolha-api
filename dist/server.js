"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const pool_1 = require("./db/pool");
const auth_routes_1 = __importDefault(require("./routes/auth.routes"));
const empresas_routes_1 = __importDefault(require("./routes/empresas.routes"));
const error_middleware_1 = require("./middlewares/error.middleware");
const express_api_reference_1 = require("@scalar/express-api-reference");
const swagger_1 = require("./config/swagger");
const env_1 = require("./config/env");
const app = (0, express_1.default)();
const PORT = env_1.env.PORT;
const helmetPadrao = (0, helmet_1.default)();
const helmetScalar = (0, helmet_1.default)({ contentSecurityPolicy: false });
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
app.use((0, cors_1.default)({
    // A função permite aceitar pedidos sem Origin, como os feitos por curl ou Postman.
    origin: (origin, callback) => {
        if (origin === undefined || env_1.env.CORS_ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
            return;
        }
        callback(null, false);
    },
}));
app.use(express_1.default.json()); // permite ler JSON no corpo dos pedidos (req.body)
// Configuração do Swagger e Scalar API Reference
app.use("/docs", (0, express_api_reference_1.apiReference)({
    spec: { content: swagger_1.swaggerSpec },
}));
//rotas
app.use("/api/auth", auth_routes_1.default);
app.use("/api/empresas", empresas_routes_1.default);
app.use(error_middleware_1.tratarErros);
// Rota de health-check — confirma que a API e a BD estão vivas
app.get("/health", async (_req, res) => {
    try {
        const result = await pool_1.pool.query("SELECT NOW() as agora");
        res.json({
            status: "ok",
            api: "KwanzaFolha API (TypeScript)",
            db_time: result.rows[0].agora,
        });
    }
    catch (err) {
        res
            .status(500)
            .json({ status: "erro", message: "Falha na ligação à base de dados" });
    }
});
app.listen(PORT, () => {
    console.log(`Servidor a correr em http://localhost:${PORT}`);
});
//# sourceMappingURL=server.js.map