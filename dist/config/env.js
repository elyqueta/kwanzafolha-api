"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isTest = exports.isDevelopment = exports.isProduction = exports.env = void 0;
exports.obrigatorioEmProducao = obrigatorioEmProducao;
const dotenv_1 = __importDefault(require("dotenv"));
const zod_1 = require("zod");
dotenv_1.default.config();
const envSchema = zod_1.z.object({
    NODE_ENV: zod_1.z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: zod_1.z.coerce
        .number({ message: "PORT deve ser um número." })
        .int()
        .positive()
        .default(3001),
    CORS_ALLOWED_ORIGINS: zod_1.z
        .string()
        .transform((valor) => valor
        .split(",")
        .map((origem) => origem.trim())
        .filter((origem) => origem.length > 0))
        .optional(),
    DB_HOST: zod_1.z.string().min(1, "DB_HOST é obrigatório."),
    DB_PORT: zod_1.z.coerce
        .number({ message: "DB_PORT deve ser um número." })
        .int()
        .positive(),
    DB_NAME: zod_1.z.string().min(1, "DB_NAME é obrigatório."),
    DB_USER: zod_1.z.string().min(1, "DB_USER é obrigatório."),
    DB_PASSWORD: zod_1.z.string().min(1, "DB_PASSWORD é obrigatório."),
    JWT_SECRET: zod_1.z
        .string()
        .min(32, "JWT_SECRET deve ter pelo menos 32 caracteres (usa algo gerado aleatoriamente, nunca um texto previsível)."),
});
function carregarEnv() {
    const resultado = envSchema.safeParse(process.env);
    if (!resultado.success) {
        console.error("Configuração inválida — o servidor não pode arrancar.");
        console.error("Corrige o(s) seguinte(s) problema(s) no teu ficheiro .env:");
        for (const issue of resultado.error.issues) {
            console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
        }
        process.exit(1);
    }
    return {
        ...resultado.data,
        CORS_ALLOWED_ORIGINS: obrigatorioEmProducao(resultado.data.CORS_ALLOWED_ORIGINS, ["http://localhost:5173"], "CORS_ALLOWED_ORIGINS"),
    };
}
exports.env = carregarEnv();
// As flags centralizam as decisões de ambiente e evitam comparações repetidas no projeto.
exports.isProduction = exports.env.NODE_ENV === "production";
exports.isDevelopment = exports.env.NODE_ENV === "development";
exports.isTest = exports.env.NODE_ENV === "test";
// Use este helper para configurações que só podem faltar durante o desenvolvimento.
function obrigatorioEmProducao(valor, fallbackDesenvolvimento, nomeVariavel) {
    if (valor !== undefined)
        return valor;
    if (exports.isProduction) {
        console.error("Configuração inválida — o servidor não pode arrancar.");
        console.error(`${nomeVariavel} é obrigatório quando NODE_ENV=production.`);
        process.exit(1);
    }
    return fallbackDesenvolvimento;
}
//# sourceMappingURL=env.js.map