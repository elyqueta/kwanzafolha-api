"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.pool = void 0;
const pg_1 = require("pg");
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
exports.pool = new pg_1.Pool({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
});
// Testa a ligação assim que o servidor arranca
exports.pool.connect()
    .then((client) => {
    console.log('Ligado ao PostgreSQL com sucesso');
    client.release(); // devolve a ligação ao "pool" — nunca esquecer isto
})
    .catch((err) => {
    console.error('Erro ao ligar ao PostgreSQL:', err.message);
});
//# sourceMappingURL=pool.js.map