"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.validarBody = validarBody;
const AppError_1 = require("../errors/AppError");
// Middleware genérico: recebe um schema Zod e devolve um middleware Express
// que valida req.body contra esse schema antes de deixar o pedido continuar.
//
// Porque isto fica ANTES do controller: se os dados estiverem errados,
// nem vale a pena instanciar controller/service/query à base de dados —
// falha o mais cedo possível (fail fast), com uma mensagem clara.
function validarBody(schema) {
    return (req, _res, next) => {
        const resultado = schema.safeParse(req.body);
        if (!resultado.success) {
            const mensagens = resultado.error.issues.map((issue) => {
                const campo = issue.path.join(".") || "(corpo do pedido)";
                return `${campo}: ${issue.message}`;
            });
            // Lança um AppError já existente — reaproveita o middleware
            // tratarErros que vocês já têm, sem criar um novo formato de erro.
            throw new AppError_1.BadRequestError(mensagens.join(" | "));
        }
        // Substitui req.body pelos dados JÁ VALIDADOS E JÁ TIPADOS pelo Zod.
        // Isto também aplica valores por omissão definidos no schema (ex: .default()),
        // e remove campos extra não previstos no schema (comportamento padrão do Zod).
        req.body = resultado.data;
        next();
    };
}
//# sourceMappingURL=validate.middleware.js.map