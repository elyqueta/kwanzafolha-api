"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
// @ts-ignore - node-pg-migrate v9 has broken type definitions
const node_pg_migrate_1 = require("node-pg-migrate");
const path_1 = require("path");
const direction = process.argv[2] || 'up';
const databaseUrl = process.env.MIGRATION_DATABASE_URL ||
    `postgresql://${process.env.DB_USER}:${encodeURIComponent(process.env.DB_PASSWORD || '')}@${process.env.DB_HOST}:${process.env.DB_PORT}/${process.env.DB_NAME}`;
// @ts-ignore - node-pg-migrate v9 has broken type definitions
(0, node_pg_migrate_1.runner)({
    direction: direction,
    schema: 'public',
    migrationsTable: 'pgmigrations',
    dir: (0, path_1.join)(__dirname, 'migrations'),
    databaseUrl,
}).catch((err) => {
    console.error(err);
    process.exit(1);
});
//# sourceMappingURL=migrate.js.map