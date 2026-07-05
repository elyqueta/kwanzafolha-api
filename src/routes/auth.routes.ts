import { Router } from 'express';
import { login, listarEmpresas } from '../controllers/auth.controller';
import { autenticar } from '../middlewares/auth.middleware';

const router = Router();

router.post('/login', login);
router.get('/empresas', autenticar, listarEmpresas); // rota protegida

export default router;