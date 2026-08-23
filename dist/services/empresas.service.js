"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.empresasService = void 0;
const pool_1 = require("../db/pool");
const AppError_1 = require("../errors/AppError");
// Helper reutilizável — vamos usar isto em TODOS os métodos que recebem um empresa_id
async function garantirEmpresaExiste(id) {
    const result = await pool_1.pool.query("SELECT * FROM empresas WHERE id = $1", [id]);
    if (result.rows.length === 0) {
        throw new AppError_1.NotFoundError("Empresa não encontrada.");
    }
    return result.rows[0];
}
exports.empresasService = {
    async listarTodas() {
        const result = await pool_1.pool.query("SELECT id, nome, nome_comercial, nif, tipo_empresa, cidade, ativa FROM empresas ORDER BY nome");
        return result.rows;
    },
    async obterPorId(id) {
        return garantirEmpresaExiste(id); // já lança NotFoundError se não existir
    },
    async criar(b) {
        if (!b.nome)
            throw new AppError_1.BadRequestError("O nome da empresa é obrigatório.");
        const result = await pool_1.pool.query(`INSERT INTO empresas
        (nome, nome_comercial, nif, tipo_empresa, data_constituicao, telefone, email, website, morada, bairro, cidade, provincia_id, municipio_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`, [
            b.nome,
            b.nome_comercial,
            b.nif,
            b.tipo_empresa,
            b.data_constituicao,
            b.telefone,
            b.email,
            b.website,
            b.morada,
            b.bairro,
            b.cidade,
            b.provincia_id,
            b.municipio_id,
        ]);
        return result.rows[0];
    },
    async editar(id, b) {
        await garantirEmpresaExiste(id);
        const result = await pool_1.pool.query(`UPDATE empresas SET
        nome = COALESCE($1, nome),
        nome_comercial = COALESCE($2, nome_comercial),
        nif = COALESCE($3, nif),
        tipo_empresa = COALESCE($4, tipo_empresa),
        telefone = COALESCE($5, telefone),
        email = COALESCE($6, email),
        website = COALESCE($7, website),
        morada = COALESCE($8, morada),
        cidade = COALESCE($9, cidade),
        updated_at = NOW()
       WHERE id = $10
       RETURNING *`, [
            b.nome,
            b.nome_comercial,
            b.nif,
            b.tipo_empresa,
            b.telefone,
            b.email,
            b.website,
            b.morada,
            b.cidade,
            id,
        ]);
        return result.rows[0];
    },
    async obterConfigFiscal(id) {
        await garantirEmpresaExiste(id); // resolve o bug das "empresas fantasmas"
        const result = await pool_1.pool.query("SELECT * FROM empresa_config_fiscal WHERE empresa_id = $1", [id]);
        return (result.rows[0] || {
            empresa_id: Number(id),
            taxa_inss_funcionario: 3.0,
            taxa_inss_entidade: 8.0,
            subsidio_alimentacao: 15000.0,
            subsidio_transporte: 10000.0,
        });
    },
    async atualizarConfigFiscal(id, b) {
        await garantirEmpresaExiste(id); // resolve o bug do erro 500
        const result = await pool_1.pool.query(`INSERT INTO empresa_config_fiscal
        (empresa_id, taxa_inss_funcionario, taxa_inss_entidade, subsidio_alimentacao, subsidio_transporte, moeda_id, regime_fiscal)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (empresa_id) DO UPDATE SET
         taxa_inss_funcionario = COALESCE(EXCLUDED.taxa_inss_funcionario, empresa_config_fiscal.taxa_inss_funcionario),
         taxa_inss_entidade = COALESCE(EXCLUDED.taxa_inss_entidade, empresa_config_fiscal.taxa_inss_entidade),
         subsidio_alimentacao = COALESCE(EXCLUDED.subsidio_alimentacao, empresa_config_fiscal.subsidio_alimentacao),
         subsidio_transporte = COALESCE(EXCLUDED.subsidio_transporte, empresa_config_fiscal.subsidio_transporte),
         moeda_id = COALESCE(EXCLUDED.moeda_id, empresa_config_fiscal.moeda_id),
         regime_fiscal = COALESCE(EXCLUDED.regime_fiscal, empresa_config_fiscal.regime_fiscal),
         updated_at = NOW()
       RETURNING *`, [
            id,
            b.taxa_inss_funcionario,
            b.taxa_inss_entidade,
            b.subsidio_alimentacao,
            b.subsidio_transporte,
            b.moeda_id,
            b.regime_fiscal,
        ]);
        return result.rows[0];
    },
    async listarContasBancarias(id) {
        await garantirEmpresaExiste(id);
        const result = await pool_1.pool.query("SELECT * FROM empresa_contas_bancarias WHERE empresa_id = $1 ORDER BY principal DESC, id", [id]);
        return result.rows;
    },
    async criarContaBancaria(id, b) {
        await garantirEmpresaExiste(id);
        if (!b.numero_conta)
            throw new AppError_1.BadRequestError("O número de conta é obrigatório.");
        const result = await pool_1.pool.query(`INSERT INTO empresa_contas_bancarias
        (empresa_id, banco_id, banco_nome, numero_conta, iban, moeda_id, principal)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`, [
            id,
            b.banco_id,
            b.banco_nome,
            b.numero_conta,
            b.iban,
            b.moeda_id,
            b.principal ?? false,
        ]);
        return result.rows[0];
    },
};
//# sourceMappingURL=empresas.service.js.map