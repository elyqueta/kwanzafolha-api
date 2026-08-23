"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = void 0;
const zod_1 = require("zod");
exports.loginSchema = zod_1.z.object({
    email: zod_1.z
        .string({ message: 'O email é obrigatório.' })
        .trim()
        .toLowerCase()
        .email('Formato de email inválido.'),
    password: zod_1.z
        .string({ message: 'A password é obrigatória.' })
        .min(1, 'A password é obrigatória.'),
});
//# sourceMappingURL=auth.validators.js.map