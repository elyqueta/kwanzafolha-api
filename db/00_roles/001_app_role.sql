-- ============================================================
-- KwanzaFolha Cloud — Utilizador dedicado da aplicação
-- ============================================================
-- Princípio do menor privilégio: a API nunca deve ligar-se
-- à base de dados como "postgres" (superuser). Este utilizador
-- só pode ler e escrever dados nas tabelas do schema "public"
-- da base "hr_system" — nada de criar/apagar bases de dados,
-- criar outros utilizadores, ou aceder a outros schemas.
--
-- IMPORTANTE: troca 'TROCA_ESTA_PASSWORD_AQUI' por uma password
-- forte antes de rodar este script (e usa a mesma no .env da API).
-- ============================================================

DO $$
BEGIN
    IF NOT EXISTS (
        SELECT FROM pg_catalog.pg_roles WHERE rolname = 'kwanzafolha_app'
    ) THEN
        CREATE ROLE kwanzafolha_app WITH LOGIN PASSWORD 'TROCA_ESTA_PASSWORD_AQUI';
    END IF;
END
$$;

-- Permissão para ligar-se à base de dados hr_system
GRANT CONNECT ON DATABASE hr_system TO kwanzafolha_app;

-- Permissão para "ver" e criar objetos dentro do schema public
-- (necessário para que INSERT/UPDATE/SELECT funcionem)
GRANT USAGE ON SCHEMA public TO kwanzafolha_app;

-- Permissões de dados nas tabelas que JÁ existem
GRANT SELECT, INSERT, UPDATE, DELETE
    ON ALL TABLES IN SCHEMA public
    TO kwanzafolha_app;

-- Permissão para usar sequências (necessário para BIGSERIAL / SERIAL
-- gerar novos IDs em INSERTs — sem isto, o INSERT falha)
GRANT USAGE, SELECT
    ON ALL SEQUENCES IN SCHEMA public
    TO kwanzafolha_app;

-- ============================================================
-- IMPORTANTE: as regras acima só cobrem tabelas que já existem
-- no momento em que este script corre. As linhas abaixo garantem
-- que TABELAS E SEQUÊNCIAS FUTURAS (criadas pelo utilizador
-- "postgres" ao rodar novas migrações) também fiquem
-- automaticamente acessíveis ao kwanzafolha_app, sem precisar
-- rodar este GRANT de novo a cada módulo novo (02_referencia,
-- 03_rh, 04_payroll, etc.)
-- ============================================================

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO kwanzafolha_app;

ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
    GRANT USAGE, SELECT ON SEQUENCES TO kwanzafolha_app;
