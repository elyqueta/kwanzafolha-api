-- ============================================================
-- Módulo: Core — Utilizadores
-- ============================================================
-- Arquitetura híbrida de IDs:
--   id   -> BIGSERIAL, chave primária interna (joins, índices)
--   uuid -> identificador público, usado nas rotas da API.
--           Nunca expor "id" diretamente numa URL.
-- ============================================================

CREATE TABLE IF NOT EXISTS utilizadores (
    id             BIGSERIAL PRIMARY KEY,
    uuid           UUID NOT NULL DEFAULT gen_random_uuid(),

    nome           VARCHAR(150) NOT NULL,
    email          VARCHAR(150) NOT NULL,
    password_hash  TEXT NOT NULL,
    role           VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
    -- roles esperados pela app: SUPER_ADMIN, ADMIN, RH, GESTOR, FUNCIONARIO
    ativo          BOOLEAN NOT NULL DEFAULT TRUE,
    ultimo_login   TIMESTAMPTZ,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_utilizadores_email UNIQUE (email),
    CONSTRAINT uq_utilizadores_uuid  UNIQUE (uuid)
);

-- Índice extra em role: útil assim que houver listagens/filtros
-- de utilizadores por papel (ex: "listar todos os RH").
CREATE INDEX IF NOT EXISTS idx_utilizadores_role ON utilizadores (role);
