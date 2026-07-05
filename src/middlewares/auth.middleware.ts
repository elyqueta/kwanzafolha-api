import { Request, Response, NextFunction } from 'express';
import { verificarToken } from '../utils/jwt.util';
import { JwtPayload } from '../types/auth.types';

// Estende o tipo Request do Express para poder guardar o utilizador autenticado
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

export function autenticar(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization; // formato: "Bearer <token>"

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: 'Token não fornecido.' });
  }

  const token = authHeader.split(' ')[1];

  try {
    const payload = verificarToken(token);
    req.user = payload; // agora qualquer rota a seguir sabe quem está autenticado
    next(); // deixa o pedido continuar para o controller
  } catch (err) {
    return res.status(401).json({ error: 'Token inválido ou expirado.' });
  }
}