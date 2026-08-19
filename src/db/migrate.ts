import dotenv from 'dotenv';
dotenv.config();

// @ts-ignore - node-pg-migrate v9 has broken type definitions
import { runner } from 'node-pg-migrate';
import { join } from 'path';

const direction = process.argv[2] || 'up';

const databaseUrl =
  process.env.MIGRATION_DATABASE_URL ||
  `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;

// @ts-ignore - node-pg-migrate v9 has broken type definitions
runner({
  direction: direction as 'up' | 'down',
  schema: 'public',
  migrationsTable: 'pgmigrations',
  dir: join(__dirname, 'migrations'),
  databaseUrl,
}).catch((err) => {
  console.error(err);
  process.exit(1);
});

