import { Router } from "express";
import { login, listarEmpresas } from "../controllers/auth.controller";
import { autenticar } from "../middlewares/auth.middleware";
import { loginRateLimiter } from "../middlewares/rateLimit.middleware";
import { validarBody } from "../middlewares/validate.middleware";
import { loginSchema } from "../validators/auth.validators";

const router = Router();

/**
 * @openapi
 * /api/auth/login:
 *   post:
 *     summary: Autentica um utilizador e devolve um token JWT
 *     tags: [Auth]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *                 format: email
 *               password:
 *                 type: string
 *                 format: password
 *           example:
 *             email: admin@kwanzafolha.ao
 *             password: "SenhaSegura123"
 *     responses:
 *       200:
 *         description: Login efetuado com sucesso
 *         content:
 *           application/json:
 *             example:
 *               token: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
 *               user:
 *                 id: 1
 *                 nome: Admin Principal
 *                 email: admin@kwanzafolha.ao
 *                 role: SUPER_ADMIN
 *       400:
 *         description: Dados inválidos (email malformado ou password em falta)
 *         content:
 *           application/json:
 *             example:
 *               error: "email: Formato de email inválido."
 *       401:
 *         description: Credenciais inválidas
 *         content:
 *           application/json:
 *             example:
 *               error: Credenciais inválidas.
 *       429:
 *         description: Demasiadas tentativas de login
 *         content:
 *           application/json:
 *             example:
 *               error: Demasiadas tentativas de login. Tenta novamente dentro de 15 minutos.
 */
router.post("/login", loginRateLimiter, validarBody(loginSchema), login);

/**
 * @openapi
 * /api/auth/empresas:
 *   get:
 *     summary: Lista as empresas associadas ao utilizador autenticado
 *     tags: [Auth]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Lista de empresas do utilizador
 *         content:
 *           application/json:
 *             example:
 *               empresas:
 *                 - id: 1
 *                   nome: Kwanza Tech Lda
 *                   nif: "5417896321"
 *                   ativa: true
 *       401:
 *         description: Não autenticado
 */
router.get("/empresas", autenticar, listarEmpresas); // rota protegida

export default router;
