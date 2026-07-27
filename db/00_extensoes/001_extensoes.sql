-- ============================================================
-- KwanzaFolha Cloud — Extensões do PostgreSQL
-- ============================================================
-- pgcrypto: garante gen_random_uuid() mesmo em versões mais
-- antigas do Postgres (no PG13+ já vem nativo, mas manter a
-- extensão não faz mal nenhum e protege contra downgrades
-- futuros de versão da imagem Docker).
-- ============================================================

CREATE EXTENSION IF NOT EXISTS pgcrypto;
