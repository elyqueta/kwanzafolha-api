import { Request, Response, NextFunction } from 'express';

// Fábrica de middlewares: recebe os papéis permitidos e devolve o middleware
export function permitirRoles(...rolesPermitidos: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    const role = req.user?.role;

    if (!role || !rolesPermitidos.includes(role)) {
      return res.status(403).json({ error: 'Sem permissão para esta ação.' });
    }

    next();
  };
}