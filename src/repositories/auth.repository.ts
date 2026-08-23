import { pool } from "../db/pool";

export interface UtilizadorAuthRow {
  id: string;
  nome: string;
  email: string;
  password_hash: string;
  role: string;
  ativo: boolean;
}

export const authRepository = {
  async buscarUtilizadorPorEmail(
    email: string,
  ): Promise<UtilizadorAuthRow | null> {
    const result = await pool.query<UtilizadorAuthRow>(
      "SELECT id, nome, email, password_hash, role, ativo FROM utilizadores WHERE email = $1",
      [email],
    );
    return result.rows[0] ?? null;
  },

  async actualizarUltimoLogin(id: string): Promise<void> {
    await pool.query(
      "UPDATE utilizadores SET ultimo_login = NOW() WHERE id = $1",
      [id],
    );
  },

  async listarEmpresasDoUtilizador(utilizadorId: string) {
    const result = await pool.query(
      `SELECT e.id, e.nome, e.nif, e.ativa
       FROM empresas e
       JOIN utilizador_empresa ue ON ue.empresa_id = e.id
       WHERE ue.utilizador_id = $1 AND ue.ativo = TRUE AND e.ativa = TRUE
       ORDER BY e.nome`,
      [utilizadorId],
    );
    return result.rows;
  },
};
