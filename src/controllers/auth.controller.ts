import { Request, Response } from "express";
import { asyncHandler } from "../utils/asyncHandler";
import { authService } from "../services/auth.service";
import { LoginRequestBody } from "../types/auth.types";

export const login = asyncHandler(
  async (req: Request<{}, {}, LoginRequestBody>, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: "Email e password são obrigatórios." });
    }

    const resultado = await authService.login({ email, password });
    return res.json(resultado);
  },
);

export const listarEmpresas = asyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id; // vem do middleware de autenticação (próximo passo)

  if (!userId) {
    return res.status(401).json({ error: "Token inválido ou expirado." });
  }

  const empresas = await authService.listarEmpresas(userId);
  return res.json({ empresas });
});
