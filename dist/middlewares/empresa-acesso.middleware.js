"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.verificarAcessoEmpresa = verificarAcessoEmpresa;
const pool_1 = require("../db/pool");
async function verificarAcessoEmpresa(req, res, next) {
    const empresaId = Number(req.params.id);
    const userId = req.user.id;
    const role = req.user.role;
    // SUPER_ADMIN vê tudo, sem precisar de estar ligado à empresa
    if (role === "SUPER_ADMIN")
        return next();
    try {
        const result = await pool_1.pool.query(`SELECT 1 FROM utilizador_empresa WHERE utilizador_id = $1 AND empresa_id = $2 AND ativo = TRUE`, [userId, empresaId]);
        if (result.rows.length === 0) {
            return res.status(403).json({ error: "Não tens acesso a esta empresa." });
        }
        next();
    }
    catch (err) {
        console.error("Erro ao verificar acesso à empresa:", err);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
}
//# sourceMappingURL=empresa-acesso.middleware.js.map