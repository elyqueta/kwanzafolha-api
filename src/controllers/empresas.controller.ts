import { Request, Response } from 'express';
import { pool } from '../db/poo';
import { EmpresaBody, ConfigFiscalBody, ContaBancariaBody } from '../types/empresa.types';

// ── CRUD Empresas ──────────────────────────────────────

export async function listarEmpresas(req: Request, res: Response) {
  try {
    const result = await pool.query(
      'SELECT id, nome, nome_comercial, nif, tipo_empresa, cidade, ativa FROM empresas ORDER BY nome'
    );
    res.json({ empresas: result.rows });
  } catch (err) {
    console.error('Erro ao listar empresas:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

export async function obterEmpresa(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM empresas WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao obter empresa:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

export async function criarEmpresa(req: Request<{}, {}, EmpresaBody>, res: Response) {
  const b = req.body;

  if (!b.nome) {
    return res.status(400).json({ error: 'O nome da empresa é obrigatório.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO empresas
        (nome, nome_comercial, nif, tipo_empresa, data_constituicao, telefone, email, website, morada, bairro, cidade, provincia_id, municipio_id)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13)
       RETURNING *`,
      [b.nome, b.nome_comercial, b.nif, b.tipo_empresa, b.data_constituicao, b.telefone,
       b.email, b.website, b.morada, b.bairro, b.cidade, b.provincia_id, b.municipio_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err: any) {
    // Código 23505 do PostgreSQL = violação de UNIQUE (ex: NIF duplicado)
    if (err.code === '23505') {
      return res.status(409).json({ error: 'Já existe uma empresa com este NIF.' });
    }
    console.error('Erro ao criar empresa:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

export async function editarEmpresa(req: Request<{ id: string }, {}, EmpresaBody>, res: Response) {
  const { id } = req.params;
  const b = req.body;

  try {
    const result = await pool.query(
      `UPDATE empresas SET
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
       RETURNING *`,
      [b.nome, b.nome_comercial, b.nif, b.tipo_empresa, b.telefone, b.email, b.website, b.morada, b.cidade, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Empresa não encontrada.' });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao editar empresa:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

// ── Configuração Fiscal ─────────────────────────────────

export async function obterConfigFiscal(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM empresa_config_fiscal WHERE empresa_id = $1', [id]);
    // Se ainda não existir configuração, devolvemos valores por omissão (não é erro)
    res.json(result.rows[0] || {
      empresa_id: Number(id),
      taxa_inss_funcionario: 3.00,
      taxa_inss_entidade: 8.00,
      subsidio_alimentacao: 15000.00,
      subsidio_transporte: 10000.00,
    });
  } catch (err) {
    console.error('Erro ao obter config fiscal:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

export async function atualizarConfigFiscal(req: Request<{ id: string }, {}, ConfigFiscalBody>, res: Response) {
  const { id } = req.params;
  const b = req.body;

  try {
    // "Upsert": tenta atualizar; se não existir linha para esta empresa, cria uma nova.
    const result = await pool.query(
      `INSERT INTO empresa_config_fiscal
        (empresa_id, taxa_inss_funcionario, taxa_inss_entidade, subsidio_alimentacao, subsidio_transporte, moeda_id, regime_fiscal)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       ON CONFLICT (empresa_id) DO UPDATE SET
         taxa_inss_funcionario = EXCLUDED.taxa_inss_funcionario,
         taxa_inss_entidade = EXCLUDED.taxa_inss_entidade,
         subsidio_alimentacao = EXCLUDED.subsidio_alimentacao,
         subsidio_transporte = EXCLUDED.subsidio_transporte,
         moeda_id = EXCLUDED.moeda_id,
         regime_fiscal = EXCLUDED.regime_fiscal,
         updated_at = NOW()
       RETURNING *`,
      [id, b.taxa_inss_funcionario, b.taxa_inss_entidade, b.subsidio_alimentacao, b.subsidio_transporte, b.moeda_id, b.regime_fiscal]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao atualizar config fiscal:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

// ── Contas Bancárias ────────────────────────────────────

export async function listarContasBancarias(req: Request, res: Response) {
  const { id } = req.params;
  try {
    const result = await pool.query(
      'SELECT * FROM empresa_contas_bancarias WHERE empresa_id = $1 ORDER BY principal DESC, id',
      [id]
    );
    res.json({ contas: result.rows });
  } catch (err) {
    console.error('Erro ao listar contas bancárias:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}

export async function criarContaBancaria(req: Request<{ id: string }, {}, ContaBancariaBody>, res: Response) {
  const { id } = req.params;
  const b = req.body;

  if (!b.numero_conta) {
    return res.status(400).json({ error: 'O número de conta é obrigatório.' });
  }

  try {
    const result = await pool.query(
      `INSERT INTO empresa_contas_bancarias
        (empresa_id, banco_id, banco_nome, numero_conta, iban, moeda_id, principal)
       VALUES ($1,$2,$3,$4,$5,$6,$7)
       RETURNING *`,
      [id, b.banco_id, b.banco_nome, b.numero_conta, b.iban, b.moeda_id, b.principal ?? false]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erro ao criar conta bancária:', err);
    res.status(500).json({ error: 'Erro interno no servidor.' });
  }
}