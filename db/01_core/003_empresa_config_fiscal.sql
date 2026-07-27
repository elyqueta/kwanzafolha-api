-- ============================================================
-- Módulo: Core — Configuração Fiscal por Empresa
-- ============================================================
-- Não tem uuid próprio: nunca é acedida diretamente por um ID
-- na URL, é sempre via /empresas/:uuid/fiscal. Chave primária
-- composta (empresa_id) faz mais sentido aqui e já garante a
-- unicidade que o service espera no ON CONFLICT (empresa_id).
-- ============================================================

CREATE TABLE IF NOT EXISTS empresa_config_fiscal (
    empresa_id             BIGINT PRIMARY KEY
                            REFERENCES empresas (id) ON DELETE CASCADE,

    taxa_inss_funcionario  NUMERIC(5,2) NOT NULL DEFAULT 3.00,
    taxa_inss_entidade     NUMERIC(5,2) NOT NULL DEFAULT 8.00,
    subsidio_alimentacao   NUMERIC(12,2) NOT NULL DEFAULT 15000.00,
    subsidio_transporte    NUMERIC(12,2) NOT NULL DEFAULT 10000.00,
    moeda_id               INTEGER,
    regime_fiscal          VARCHAR(50) NOT NULL DEFAULT 'Geral',

    updated_at             TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
