import { Pool } from 'pg';
import dotenv from 'dotenv';

dotenv.config();

export const pool = new Pool({
  host: process.env.DB_HOST,
  port: Number(process.env.DB_PORT),
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
});

// Testa a ligação assim que o servidor arranca
pool.connect()
  .then((client) => {
    console.log('Ligado ao PostgreSQL com sucesso');
    client.release(); // devolve a ligação ao "pool" — nunca esquecer isto
  })
  .catch((err) => {
    console.error('Erro ao ligar ao PostgreSQL:', err.message);
  });