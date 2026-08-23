import { Pool } from "pg";
import { env } from "../config/env";

export const pool = new Pool({
  host: env.DB_HOST,
  port: env.DB_PORT,
  database: env.DB_NAME,
  user: env.DB_USER,
  password: env.DB_PASSWORD,
});

// Testa a ligação assim que o servidor arranca
pool
  .connect()
  .then((client) => {
    console.log("Ligado ao PostgreSQL com sucesso");
    client.release(); // devolve a ligação ao "pool" — nunca esquecer isto
  })
  .catch((err) => {
    console.error("Erro ao ligar ao PostgreSQL:", err.message);
  });
