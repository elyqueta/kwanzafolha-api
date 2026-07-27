-- ============================================================
-- Módulo: Core — Empresas
-- ============================================================
-- provincia_id e municipio_id ficam SEM "REFERENCES" por agora,
-- de propósito: as tabelas provincias/municipios só existem no
-- módulo 02_referencia. A FK real é adicionada nesse módulo,
-- via ALTER TABLE, para manter a ordem de execução sem erros.
-- ============================================================

CREATE TABLE IF NOT EXISTS empresas (
    id                 BIGSERIAL PRIMARY KEY,
    uuid               UUID NOT NULL DEFAULT gen_random_uuid(),

    nome               VARCHAR(200) NOT NULL,
    nome_comercial     VARCHAR(200),
    nif                VARCHAR(20),
    tipo_empresa       VARCHAR(10) NOT NULL DEFAULT 'LDA',
    -- valores esperados pela app: LDA, SA, ENI, ONG, EP, OUTRO

    data_constituicao  DATE,
    telefone           VARCHAR(30),
    email              VARCHAR(150),
    website            VARCHAR(200),

    morada             VARCHAR(250),
    bairro             VARCHAR(150),
    cidade             VARCHAR(100),
    provincia_id       INTEGER,
    municipio_id       INTEGER,

    ativa              BOOLEAN NOT NULL DEFAULT TRUE,

    created_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at         TIMESTAMPTZ NOT NULL DEFAULT NOW(),

    CONSTRAINT uq_empresas_nif  UNIQUE (nif),
    CONSTRAINT uq_empresas_uuid UNIQUE (uuid),
    CONSTRAINT chk_empresas_tipo CHECK (
        tipo_empresa IN ('LDA', 'SA', 'ENI', 'ONG', 'EP', 'OUTRO')
    )
);

CREATE INDEX IF NOT EXISTS idx_empresas_ativa ON empresas (ativa);
