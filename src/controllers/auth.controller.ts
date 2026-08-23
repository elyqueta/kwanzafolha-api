import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import { pool } from "../db/pool";
import { gerarToken } from "../utils/jwt.util";
import { LoginRequestBody } from "../types/auth.types";

export async function login(
  req: Request<{}, {}, LoginRequestBody>,
  res: Response,
) {
  const { email, password } = req.body;

  if (!email || !password) {
    return res
      .status(400)
      .json({ error: "Email e password são obrigatórios." });
  }

  try {
    const result = await pool.query(
      "SELECT id, nome, email, password_hash, role, ativo FROM utilizadores WHERE email = $1",
      [email],
    );

    const utilizador = result.rows[0];

    // Mensagem genérica de propósito — nunca dizemos "email não existe" vs "password errada"
    // separadamente. Isso ajuda um atacante a descobrir emails válidos por tentativa e erro.
    if (!utilizador || !utilizador.ativo) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const passwordCorreta = await bcrypt.compare(
      password,
      utilizador.password_hash,
    );
    if (!passwordCorreta) {
      return res.status(401).json({ error: "Credenciais inválidas." });
    }

    const token = gerarToken({
      id: utilizador.id,
      email: utilizador.email,
      role: utilizador.role,
    });

    await pool.query(
      "UPDATE utilizadores SET ultimo_login = NOW() WHERE id = $1",
      [utilizador.id],
    );

    return res.json({
      token,
      user: {
        id: utilizador.id,
        nome: utilizador.nome,
        email: utilizador.email,
        role: utilizador.role,
      },
    });
  } catch (err) {
    console.error("Erro no login:", err);
    return res.status(500).json({ error: "Erro interno no servidor." });
  }
}

export async function listarEmpresas(req: Request, res: Response) {
  const userId = req.user?.id; // vem do middleware de autenticação (próximo passo)

  try {
    const result = await pool.query(
      `SELECT e.id, e.nome, e.nif, e.ativa
       FROM empresas e
       JOIN utilizador_empresa ue ON ue.empresa_id = e.id
       WHERE ue.utilizador_id = $1 AND ue.ativo = TRUE AND e.ativa = TRUE
       ORDER BY e.nome`,
      [userId],
    );

    res.json({ empresas: result.rows });
  } catch (err) {
    console.error("Erro ao listar empresas:", err);
    res.status(500).json({ error: "Erro interno no servidor." });
  }
}
