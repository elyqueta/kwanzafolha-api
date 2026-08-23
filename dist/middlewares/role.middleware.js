"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.permitirRoles = permitirRoles;
// Fábrica de middlewares: recebe os papéis permitidos e devolve o middleware
function permitirRoles(...rolesPermitidos) {
    return (req, res, next) => {
        const role = req.user?.role;
        if (!role || !rolesPermitidos.includes(role)) {
            return res.status(403).json({ error: "Sem permissão para esta ação." });
        }
        return next();
    };
}
//# sourceMappingURL=role.middleware.js.map