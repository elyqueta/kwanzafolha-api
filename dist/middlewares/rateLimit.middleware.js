"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginRateLimiter = void 0;
const express_rate_limit_1 = __importDefault(require("express-rate-limit"));
// Protege o endpoint de login contra tentativas de força bruta.
// Janela de 15 minutos, máximo de 10 tentativas por IP nesse intervalo.
//
// Porque 10 e não menos: um utilizador legítimo pode errar a password
// duas ou três vezes sem que isso seja suspeito. Um valor muito baixo
// (ex: 3) geraria falsos positivos incómodos. 10 tentativas em 15 minutos
// já é impraticável para um ataque de força bruta real, mas ainda é
// tolerante a erros humanos genuínos.
exports.loginRateLimiter = (0, express_rate_limit_1.default)({
    windowMs: 15 * 60 * 1000, // 15 minutos
    limit: 10,
    message: {
        error: 'Demasiadas tentativas de login. Tenta novamente dentro de 15 minutos.',
    },
    standardHeaders: true, // devolve headers RateLimit-* (padrão IETF)
    legacyHeaders: false, // desativa os headers X-RateLimit-* antigos (redundantes)
});
//# sourceMappingURL=rateLimit.middleware.js.map