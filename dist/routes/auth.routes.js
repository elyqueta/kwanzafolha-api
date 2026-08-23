"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_controller_1 = require("../controllers/auth.controller");
const auth_middleware_1 = require("../middlewares/auth.middleware");
const rateLimit_middleware_1 = require("../middlewares/rateLimit.middleware");
const validate_middleware_1 = require("../middlewares/validate.middleware");
const auth_validators_1 = require("../validators/auth.validators");
const router = (0, express_1.Router)();
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
router.post('/login', rateLimit_middleware_1.loginRateLimiter, (0, validate_middleware_1.validarBody)(auth_validators_1.loginSchema), auth_controller_1.login);
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
router.get('/empresas', auth_middleware_1.autenticar, auth_controller_1.listarEmpresas); // rota protegida
exports.default = router;
//# sourceMappingURL=auth.routes.js.map