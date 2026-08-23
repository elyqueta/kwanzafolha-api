"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = login;
exports.listarEmpresas = listarEmpresas;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const pool_1 = require("../db/pool");
const jwt_util_1 = require("../utils/jwt.util");
async function login(req, res) {
    const { email, password } = req.body;
    if (!email || !password) {
        return res
            .status(400)
            .json({ error: "Email e password são obrigatórios." });
    }
    try {
        const result = await pool_1.pool.query("SELECT id, nome, email, password_hash, role, ativo FROM utilizadores WHERE email = $1", [email]);
        const utilizador = result.rows[0];
        // Mensagem genérica de propósito — nunca dizemos "email não existe" vs "password errada"
        // separadamente. Isso ajuda um atacante a descobrir emails válidos por tentativa e erro.
        if (!utilizador || !utilizador.ativo) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        const passwordCorreta = await bcryptjs_1.default.compare(password, utilizador.password_hash);
        if (!passwordCorreta) {
            return res.status(401).json({ error: "Credenciais inválidas." });
        }
        const token = (0, jwt_util_1.gerarToken)({
            id: utilizador.id,
            email: utilizador.email,
            role: utilizador.role,
        });
        await pool_1.pool.query("UPDATE utilizadores SET ultimo_login = NOW() WHERE id = $1", [utilizador.id]);
        return res.json({
            token,
            user: {
                id: utilizador.id,
                nome: utilizador.nome,
                email: utilizador.email,
                role: utilizador.role,
            },
        });
    }
    catch (err) {
        console.error("Erro no login:", err);
        return res.status(500).json({ error: "Erro interno no servidor." });
    }
}
async function listarEmpresas(req, res) {
    const userId = req.user?.id; // vem do middleware de autenticação (próximo passo)
    try {
        const result = await pool_1.pool.query(`SELECT e.id, e.nome, e.nif, e.ativa
       FROM empresas e
       JOIN utilizador_empresa ue ON ue.empresa_id = e.id
       WHERE ue.utilizador_id = $1 AND ue.ativo = TRUE AND e.ativa = TRUE
       ORDER BY e.nome`, [userId]);
        res.json({ empresas: result.rows });
    }
    catch (err) {
        console.error("Erro ao listar empresas:", err);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
}
//# sourceMappingURL=auth.controller.js.map