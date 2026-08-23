import bcrypt from "bcryptjs";
import { UnauthorizedError } from "../errors/AppError";
import { authRepository } from "../repositories/auth.repository";
import { LoginRequestBody } from "../types/auth.types";
import { gerarToken } from "../utils/jwt.util";

export const authService = {
  async login({ email, password }: LoginRequestBody) {
    const utilizador = await authRepository.buscarUtilizadorPorEmail(email);

    // Mensagem genérica de propósito — nunca dizemos "email não existe" vs "password errada"
    // separadamente. Isso ajuda um atacante a descobrir emails válidos por tentativa e erro.
    if (!utilizador || !utilizador.ativo) {
      throw new UnauthorizedError();
    }

    const passwordCorreta = await bcrypt.compare(
      password,
      utilizador.password_hash,
    );
    if (!passwordCorreta) {
      throw new UnauthorizedError();
    }

    const token = gerarToken({
      id: utilizador.id,
      email: utilizador.email,
      role: utilizador.role,
    });

    await authRepository.actualizarUltimoLogin(utilizador.id);

    return {
      token,
      user: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        role: utilizador.role,
      },
    };
  },

  async listarEmpresas(utilizadorId: string) {
    return authRepository.listarEmpresasDoUtilizador(utilizadorId);
  },
};
