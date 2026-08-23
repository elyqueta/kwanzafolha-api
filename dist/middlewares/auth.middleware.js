"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.autenticar = autenticar;
const jwt_util_1 = require("../utils/jwt.util");
function autenticar(req, res, next) {
    const authHeader = req.headers.authorization; // formato: "Bearer <token>"
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
        return res.status(401).json({ error: "Token não fornecido." });
    }
    const token = authHeader.split(" ")[1];
    try {
        const payload = (0, jwt_util_1.verificarToken)(token);
        req.user = payload; // agora qualquer rota a seguir sabe quem está autenticado
        return next(); // deixa o pedido continuar para o controller
    }
    catch (err) {
        return res.status(401).json({ error: "Token inválido ou expirado." });
    }
}
//# sourceMappingURL=auth.middleware.js.map