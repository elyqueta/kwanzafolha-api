-- ============================================================
-- Seed: utilizador SUPER_ADMIN inicial + empresa de teste
-- ============================================================
-- Antes de rodar, gera o hash da tua password localmente:
--
--   node -e "console.log(require('bcryptjs').hashSync('TUA_PASSWORD_AQUI', 10))"
--
-- Copia o valor gerado (algo como $2a$10$abcdef...) e substitui
-- 'SUBSTITUI_PELO_HASH_GERADO' abaixo antes de executar este script.
-- ============================================================

INSERT INTO utilizadores (nome, email, password_hash, role, ativo)
VALUES (
    'Ely (Admin)',
    'admin@kwanzafolha.ao',
    'SUBSTITUI_PELO_HASH_GERADO',
    'SUPER_ADMIN',
    TRUE
)
ON CONFLICT (email) DO NOTHING;

INSERT INTO empresas (nome, nif, tipo_empresa, email, cidade, ativa)
VALUES (
    'Kwanza Tech Lda',
    '5417896321',
    'LDA',
    'geral@kwanzatech.ao',
    'Luanda',
    TRUE
)
ON CONFLICT (nif) DO NOTHING;

-- Liga o admin à empresa de teste
INSERT INTO utilizador_empresa (utilizador_id, empresa_id, ativo)
SELECT u.id, e.id, TRUE
FROM utilizadores u, empresas e
WHERE u.email = 'admin@kwanzafolha.ao'
  AND e.nif = '5417896321'
ON CONFLICT DO NOTHING;
