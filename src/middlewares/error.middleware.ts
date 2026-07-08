import { Request, Response, NextFunction } from 'express';
import { AppError } from '../errors/AppError';

export function tratarErros(err: any, req: Request, res: Response, next: NextFunction) {
  // Erros que nós próprios lançámos (AppError e subclasses)
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({ error: err.message });
  }

  // Erros crus do PostgreSQL que escaparam ao service (rede de segurança)
  if (err.code === '23505') {
    return res.status(409).json({ error: 'Já existe um registo com esses dados (valor duplicado).' });
  }
  if (err.code === '23503') {
    return res.status(404).json({ error: 'Registo relacionado não encontrado.' });
  }

  // Qualquer outra coisa — erro verdadeiramente inesperado
  console.error('Erro não tratado:', err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
}