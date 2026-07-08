import { Router } from 'express';
import { autenticar } from '../middlewares/auth.middleware';
import { permitirRoles } from '../middlewares/role.middleware';
import { verificarAcessoEmpresa } from '../middlewares/empresa-acesso.middleware';
import {
  listarEmpresas, obterEmpresa, criarEmpresa, editarEmpresa,
  obterConfigFiscal, atualizarConfigFiscal,
  listarContasBancarias, criarContaBancaria,
} from '../controllers/empresas.controller';

const router = Router();

router.use(autenticar); // todas as rotas abaixo exigem login

/**
 * @openapi
 * /api/empresas:
 *   get:
 *     summary: Lista todas as empresas
 *     description: Retorna todas as empresas cadastradas no sistema. Requer role SUPER_ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas
 *         content:
 *           application/json:
 *             example:
 *               empresas:
 *                 - id: 1
 *                   nome: Kwanza Tech Lda
 *                   nif: "5417896321"
 *                   ativa: true
 *                 - id: 2
 *                   nome: Angola Soluções SA
 *                   nif: "5417896322"
 *                   ativa: true
 *       401:
 *         description: Não autenticado
 *       403:
 *         description: Sem permissão (requer SUPER_ADMIN)
 */
router.get('/', permitirRoles('SUPER_ADMIN'), listarEmpresas);

/**
 * @openapi
 * /api/empresas:
 *   post:
 *     summary: Cria uma nova empresa
 *     description: Cadastra uma nova empresa no sistema. Requer role SUPER_ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - nome
 *             properties:
 *               nome:
 *                 type: string
 *               nome_comercial:
 *                 type: string
 *               nif:
 *                 type: string
 *               tipo_empresa:
 *                 type: string
 *                 enum: [LDA, SA, ENI, ONG, EP, OUTRO]
 *               data_constituicao:
 *                 type: string
 *                 format: date
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *               website:
 *                 type: string
 *               morada:
 *                 type: string
 *               bairro:
 *                 type: string
 *               cidade:
 *                 type: string
 *               provincia_id:
 *                 type: integer
 *               municipio_id:
 *                 type: integer
 *           example:
 *             nome: Kwanza Tech Lda
 *             nif: "5417896321"
 *             tipo_empresa: LDA
 *             email: geral@kwanzatech.ao
 *             cidade: Luanda
 *     responses:
 *       201:
 *         description: Empresa criada
 *         content:
 *           application/json:
 *             example:
 *               id: 3
 *               nome: Kwanza Tech Lda
 *               nif: "5417896321"
 *               ativa: true
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão (requer SUPER_ADMIN)
 */
router.post('/', permitirRoles('SUPER_ADMIN'), criarEmpresa);

/**
 * @openapi
 * /api/empresas/{id}:
 *   get:
 *     summary: Obtém uma empresa pelo ID
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Empresa encontrada
 *         content:
 *           application/json:
 *             example:
 *               id: 1
 *               nome: Kwanza Tech Lda
 *               nif: "5417896321"
 *               email: geral@kwanzatech.ao
 *               cidade: Luanda
 *               ativa: true
 *       404:
 *         description: Empresa não encontrada
 */
router.get('/:id', verificarAcessoEmpresa, obterEmpresa);

/**
 * @openapi
 * /api/empresas/{id}:
 *   put:
 *     summary: Edita uma empresa existente
 *     description: Atualiza os dados de uma empresa. Requer role SUPER_ADMIN ou ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               nome:
 *                 type: string
 *               nome_comercial:
 *                 type: string
 *               nif:
 *                 type: string
 *               telefone:
 *                 type: string
 *               email:
 *                 type: string
 *           example:
 *             nome: Kwanza Tech Lda (Atualizado)
 *             telefone: "+244923456790"
 *     responses:
 *       200:
 *         description: Empresa atualizada
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão (requer SUPER_ADMIN ou ADMIN)
 *       404:
 *         description: Empresa não encontrada
 */
router.put('/:id', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), editarEmpresa);

/**
 * @openapi
 * /api/empresas/{id}/fiscal:
 *   get:
 *     summary: Obtém a configuração fiscal de uma empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Configuração fiscal
 *         content:
 *           application/json:
 *             example:
 *               taxa_inss_funcionario: 3
 *               taxa_inss_entidade: 8
 *               subsidio_alimentacao: 15000
 *               subsidio_transporte: 10000
 *               moeda_id: 1
 *               regime_fiscal: Geral
 *       404:
 *         description: Configuração fiscal não encontrada
 */
router.get('/:id/fiscal', verificarAcessoEmpresa, obterConfigFiscal);

/**
 * @openapi
 * /api/empresas/{id}/fiscal:
 *   put:
 *     summary: Atualiza a configuração fiscal de uma empresa
 *     description: Requer role SUPER_ADMIN ou ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taxa_inss_funcionario:
 *                 type: number
 *               taxa_inss_entidade:
 *                 type: number
 *               subsidio_alimentacao:
 *                 type: number
 *               subsidio_transporte:
 *                 type: number
 *               moeda_id:
 *                 type: integer
 *               regime_fiscal:
 *                 type: string
 *           example:
 *             taxa_inss_funcionario: 3
 *             taxa_inss_entidade: 8
 *             subsidio_alimentacao: 15000
 *             subsidio_transporte: 10000
 *             regime_fiscal: Geral
 *     responses:
 *       200:
 *         description: Configuração fiscal atualizada
 *       403:
 *         description: Sem permissão (requer SUPER_ADMIN ou ADMIN)
 */
router.put('/:id/fiscal', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), atualizarConfigFiscal);

/**
 * @openapi
 * /api/empresas/{id}/contas-bancarias:
 *   get:
 *     summary: Lista as contas bancárias de uma empresa
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     responses:
 *       200:
 *         description: Lista de contas bancárias
 *         content:
 *           application/json:
 *             example:
 *               contas:
 *                 - id: 1
 *                   banco_nome: Banco BIC
 *                   numero_conta: "123456789"
 *                   iban: "AO06000600009999999990192"
 *                   principal: true
 */
router.get('/:id/contas-bancarias', verificarAcessoEmpresa, listarContasBancarias);

/**
 * @openapi
 * /api/empresas/{id}/contas-bancarias:
 *   post:
 *     summary: Cria uma nova conta bancária para a empresa
 *     description: Requer role SUPER_ADMIN ou ADMIN.
 *     tags: [Empresas]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         example: "1"
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - numero_conta
 *             properties:
 *               banco_id:
 *                 type: integer
 *               banco_nome:
 *                 type: string
 *               numero_conta:
 *                 type: string
 *               iban:
 *                 type: string
 *               moeda_id:
 *                 type: integer
 *               principal:
 *                 type: boolean
 *           example:
 *             banco_nome: Banco BIC
 *             numero_conta: "123456789"
 *             iban: "AO06000600009999999990192"
 *             principal: true
 *     responses:
 *       201:
 *         description: Conta bancária criada
 *       400:
 *         description: Dados inválidos
 *       403:
 *         description: Sem permissão (requer SUPER_ADMIN ou ADMIN)
 */
router.post('/:id/contas-bancarias', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), criarContaBancaria);

export default router;