"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.down = exports.up = void 0;
const up = async (queryRunner) => {
    await queryRunner.sql(`
    CREATE EXTENSION IF NOT EXISTS pgcrypto;
  `);
    await queryRunner.sql(`
    DO $$
    BEGIN
        IF NOT EXISTS (
            SELECT FROM pg_catalog.pg_roles WHERE rolname = 'kwanzafolha_app'
        ) THEN
            CREATE ROLE kwanzafolha_app WITH LOGIN PASSWORD 'classapa1914';
        END IF;
    END
    $$;
  `);
    await queryRunner.sql(`
    GRANT CONNECT ON DATABASE hr_system TO kwanzafolha_app;
    GRANT USAGE ON SCHEMA public TO kwanzafolha_app;
    GRANT SELECT, INSERT, UPDATE, DELETE
        ON ALL TABLES IN SCHEMA public
        TO kwanzafolha_app;
    GRANT USAGE, SELECT
        ON ALL SEQUENCES IN SCHEMA public
        TO kwanzafolha_app;
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
        GRANT SELECT, INSERT, UPDATE, DELETE ON TABLES TO kwanzafolha_app;
    ALTER DEFAULT PRIVILEGES FOR ROLE postgres IN SCHEMA public
        GRANT USAGE, SELECT ON SEQUENCES TO kwanzafolha_app;
  `);
    await queryRunner.sql(`
    CREATE TABLE IF NOT EXISTS utilizadores (
        id             BIGSERIAL PRIMARY KEY,
        uuid           UUID NOT NULL DEFAULT gen_random_uuid(),

        nome           VARCHAR(150) NOT NULL,
        email          VARCHAR(150) NOT NULL,
        password_hash  TEXT NOT NULL,
        role           VARCHAR(30) NOT NULL DEFAULT 'ADMIN',
        ativo          BOOLEAN NOT NULL DEFAULT TRUE,
        ultimo_login   TIMESTAMPTZ,

        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),
        updated_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT uq_utilizadores_email UNIQUE (email),
        CONSTRAINT uq_utilizadores_uuid  UNIQUE (uuid)
    );

    CREATE INDEX IF NOT EXISTS idx_utilizadores_role ON utilizadores (role);
  `);
    await queryRunner.sql(`
    CREATE TABLE IF NOT EXISTS empresas (
        id                 BIGSERIAL PRIMARY KEY,
        uuid               UUID NOT NULL DEFAULT gen_random_uuid(),

        nome               VARCHAR(200) NOT NULL,
        nome_comercial     VARCHAR(200),
        nif                VARCHAR(20),
        tipo_empresa       VARCHAR(10) NOT NULL DEFAULT 'LDA',

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
  `);
    await queryRunner.sql(`
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
  `);
    await queryRunner.sql(`
    CREATE TABLE IF NOT EXISTS empresa_contas_bancarias (
        id             BIGSERIAL PRIMARY KEY,
        uuid           UUID NOT NULL DEFAULT gen_random_uuid(),

        empresa_id     BIGINT NOT NULL
                       REFERENCES empresas (id) ON DELETE CASCADE,

        banco_id       INTEGER,
        banco_nome     VARCHAR(150),
        numero_conta   VARCHAR(50) NOT NULL,
        iban           VARCHAR(34),
        moeda_id       INTEGER,
        principal      BOOLEAN NOT NULL DEFAULT FALSE,

        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        CONSTRAINT uq_empresa_contas_uuid UNIQUE (uuid)
    );

    CREATE INDEX IF NOT EXISTS idx_contas_empresa_id ON empresa_contas_bancarias (empresa_id);

    CREATE UNIQUE INDEX IF NOT EXISTS idx_contas_uma_principal_por_empresa
        ON empresa_contas_bancarias (empresa_id)
        WHERE principal = TRUE;
  `);
    await queryRunner.sql(`
    CREATE TABLE IF NOT EXISTS utilizador_empresa (
        utilizador_id  BIGINT NOT NULL REFERENCES utilizadores (id) ON DELETE CASCADE,
        empresa_id     BIGINT NOT NULL REFERENCES empresas (id) ON DELETE CASCADE,
        ativo          BOOLEAN NOT NULL DEFAULT TRUE,
        created_at     TIMESTAMPTZ NOT NULL DEFAULT NOW(),

        PRIMARY KEY (utilizador_id, empresa_id)
    );
  `);
};
exports.up = up;
const down = async (queryRunner) => {
    await queryRunner.sql(`DROP TABLE IF EXISTS utilizador_empresa CASCADE;`);
    await queryRunner.sql(`DROP TABLE IF EXISTS empresa_contas_bancarias CASCADE;`);
    await queryRunner.sql(`DROP TABLE IF EXISTS empresa_config_fiscal CASCADE;`);
    await queryRunner.sql(`DROP TABLE IF EXISTS empresas CASCADE;`);
    await queryRunner.sql(`DROP TABLE IF EXISTS utilizadores CASCADE;`);
    await queryRunner.sql(`DROP ROLE IF EXISTS kwanzafolha_app;`);
};
exports.down = down;
//# sourceMappingURL=001-initial-schema.js.map