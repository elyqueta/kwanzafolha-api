"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.contaBancariaSchema = exports.configFiscalSchema = exports.editarEmpresaSchema = exports.criarEmpresaSchema = void 0;
const zod_1 = require("zod");
// Mesmos valores aceites pelo CHECK constraint da tabela empresas
// (db/01_core/002_empresas.sql) — manter isto sincronizado com o banco
// sempre que o schema SQL mudar.
const tipoEmpresaEnum = zod_1.z.enum(["LDA", "SA", "ENI", "ONG", "EP", "OUTRO"]);
exports.criarEmpresaSchema = zod_1.z.object({
    nome: zod_1.z
        .string({ message: "O nome da empresa é obrigatório." })
        .trim()
        .min(2, "O nome da empresa deve ter pelo menos 2 caracteres.")
        .max(200, "O nome da empresa não pode exceder 200 caracteres."),
    nome_comercial: zod_1.z.string().trim().max(200).optional(),
    nif: zod_1.z.string().trim().max(20).optional(),
    tipo_empresa: tipoEmpresaEnum.optional(),
    data_constituicao: zod_1.z
        .string()
        .regex(/^\d{4}-\d{2}-\d{2}$/, "data_constituicao deve estar no formato AAAA-MM-DD.")
        .optional(),
    telefone: zod_1.z.string().trim().max(30).optional(),
    email: zod_1.z
        .string()
        .trim()
        .toLowerCase()
        .email("Formato de email inválido.")
        .optional(),
    website: zod_1.z.string().trim().url("Formato de website inválido.").optional(),
    morada: zod_1.z.string().trim().max(250).optional(),
    bairro: zod_1.z.string().trim().max(150).optional(),
    cidade: zod_1.z.string().trim().max(100).optional(),
    provincia_id: zod_1.z.coerce.number().int().positive().optional(),
    municipio_id: zod_1.z.coerce.number().int().positive().optional(),
});
exports.editarEmpresaSchema = exports.criarEmpresaSchema.partial();
exports.configFiscalSchema = zod_1.z.object({
    taxa_inss_funcionario: zod_1.z.coerce
        .number()
        .min(0, "A taxa de INSS do funcionário não pode ser negativa.")
        .max(100, "A taxa de INSS do funcionário não pode exceder 100%.")
        .optional(),
    taxa_inss_entidade: zod_1.z.coerce
        .number()
        .min(0, "A taxa de INSS da entidade não pode ser negativa.")
        .max(100, "A taxa de INSS da entidade não pode exceder 100%.")
        .optional(),
    subsidio_alimentacao: zod_1.z.coerce
        .number()
        .min(0, "O subsídio de alimentação não pode ser negativo.")
        .max(9999999999.99, "O subsídio de alimentação excede o limite permitido.")
        .optional(),
    subsidio_transporte: zod_1.z.coerce
        .number()
        .min(0, "O subsídio de transporte não pode ser negativo.")
        .max(9999999999.99, "O subsídio de transporte excede o limite permitido.")
        .optional(),
    moeda_id: zod_1.z.coerce
        .number()
        .int("A moeda deve ser um número inteiro.")
        .positive("A moeda deve ser válida.")
        .optional(),
    regime_fiscal: zod_1.z
        .string()
        .trim()
        .max(50, "O regime fiscal não pode exceder 50 caracteres.")
        .optional(),
});
exports.contaBancariaSchema = zod_1.z.object({
    banco_id: zod_1.z.coerce
        .number()
        .int("O banco deve ser um número inteiro.")
        .positive("O banco deve ser válido.")
        .optional(),
    banco_nome: zod_1.z
        .string()
        .trim()
        .max(150, "O nome do banco não pode exceder 150 caracteres.")
        .optional(),
    numero_conta: zod_1.z
        .string({ message: "O número de conta é obrigatório." })
        .trim()
        .min(1, "O número de conta é obrigatório.")
        .max(50, "O número de conta não pode exceder 50 caracteres."),
    iban: zod_1.z
        .string()
        .trim()
        .max(34, "O IBAN não pode exceder 34 caracteres.")
        .optional(),
    moeda_id: zod_1.z.coerce
        .number()
        .int("A moeda deve ser um número inteiro.")
        .positive("A moeda deve ser válida.")
        .optional(),
    principal: zod_1.z.boolean().optional(),
});
//# sourceMappingURL=empresa.validators.js.map