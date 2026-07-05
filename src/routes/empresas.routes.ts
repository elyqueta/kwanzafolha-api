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

router.get('/', permitirRoles('SUPER_ADMIN'), listarEmpresas);
router.post('/', permitirRoles('SUPER_ADMIN'), criarEmpresa);

router.get('/:id', verificarAcessoEmpresa, obterEmpresa);
router.put('/:id', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), editarEmpresa);

router.get('/:id/fiscal', verificarAcessoEmpresa, obterConfigFiscal);
router.put('/:id/fiscal', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), atualizarConfigFiscal);

router.get('/:id/contas-bancarias', verificarAcessoEmpresa, listarContasBancarias);
router.post('/:id/contas-bancarias', verificarAcessoEmpresa, permitirRoles('SUPER_ADMIN', 'ADMIN'), criarContaBancaria);

export default router;