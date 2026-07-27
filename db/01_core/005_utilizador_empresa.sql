-- ============================================================
-- Módulo: Core — Relação Utilizador ↔ Empresa (multi-tenant)
-- ============================================================
-- Tabela de associação pura (many-to-many): não precisa de id
-- próprio nem de uuid. Chave primária composta é o correto.
-- ============================================================

CREATE TABLE IF NOT EXISTS utilizador_empresa (
    utilizador_id  BIGINT NOT NULL REFERENCES utilizadores (id) ON DELETE CASCADE,
    empresa_id     BIGINT NOT NULL REFERENCES empresas (id) ON DELETE CASCADE,
    ativo          BOOLEAN NOT NULL DEFAULT TRUE,
    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    PRIMARY KEY (utilizador_id, empresa_id)
);
