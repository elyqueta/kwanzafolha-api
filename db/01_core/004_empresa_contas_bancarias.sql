-- ============================================================
-- Módulo: Core — Contas Bancárias da Empresa
-- ============================================================

CREATE TABLE IF NOT EXISTS empresa_contas_bancarias (
    id             BIGSERIAL PRIMARY KEY,
    uuid           UUID NOT NULL DEFAULT gen_random_uuid(),

    empresa_id     BIGINT NOT NULL
                   REFERENCES empresas (id) ON DELETE CASCADE,

    banco_id       INTEGER,  -- FK real chega no módulo 02_referencia (11 bancos angolanos)
    banco_nome     VARCHAR(150),
    numero_conta   VARCHAR(50) NOT NULL,
    iban           VARCHAR(34),
    moeda_id       INTEGER,  -- FK real chega no módulo 02_referencia
    principal      BOOLEAN NOT NULL DEFAULT FALSE,

    created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_empresa_contas_uuid UNIQUE (uuid)
);

CREATE INDEX IF NOT EXISTS idx_contas_empresa_id ON empresa_contas_bancarias (empresa_id);

-- Garante que só existe UMA conta "principal" por empresa
-- (regra de negócio garantida a nível de banco, não só na app)
CREATE UNIQUE INDEX IF NOT EXISTS idx_contas_uma_principal_por_empresa
    ON empresa_contas_bancarias (empresa_id)
    WHERE principal = TRUE;
