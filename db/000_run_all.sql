-- ============================================================
-- KwanzaFolha Cloud -- Execucao completa do schema (modulo CORE)
-- Rodar com: psql -U postgres -d hr_system -f db/000_run_all.sql
-- ============================================================
-- IMPORTANTE: usa-se \ir (include relative) e nao \i.
-- \i resolve o caminho relativo a pasta onde o psql foi iniciado.
-- \ir resolve o caminho relativo a pasta ONDE ESTE FICHEIRO ESTA,
-- que e o comportamento correto para scripts modulares como este.
-- ============================================================

\echo '>> A criar extensoes...'
\ir 00_extensoes/001_extensoes.sql

\echo '>> A criar utilizador dedicado da aplicacao...'
\ir 00_roles/001_app_role.sql

\echo '>> A criar modulo CORE...'
\ir 01_core/001_utilizadores.sql
\ir 01_core/002_empresas.sql
\ir 01_core/003_empresa_config_fiscal.sql
\ir 01_core/004_empresa_contas_bancarias.sql
\ir 01_core/005_utilizador_empresa.sql

\echo '>> A inserir seeds...'
\ir 05_seeds/001_seed_admin.sql

\echo '>> Schema CORE criado com sucesso.'
