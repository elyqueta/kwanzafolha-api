import { z } from "zod";

// Mesmos valores aceites pelo CHECK constraint da tabela empresas
// (db/01_core/002_empresas.sql) — manter isto sincronizado com o banco
// sempre que o schema SQL mudar.
const tipoEmpresaEnum = z.enum(["LDA", "SA", "ENI", "ONG", "EP", "OUTRO"]);

export const criarEmpresaSchema = z.object({
  nome: z
    .string({ message: "O nome da empresa é obrigatório." })
    .trim()
    .min(2, "O nome da empresa deve ter pelo menos 2 caracteres.")
    .max(200, "O nome da empresa não pode exceder 200 caracteres."),

  nome_comercial: z.string().trim().max(200).optional(),

  nif: z.string().trim().max(20).optional(),

  tipo_empresa: tipoEmpresaEnum.optional(),

  data_constituicao: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "data_constituicao deve estar no formato AAAA-MM-DD.")
    .optional(),

  telefone: z.string().trim().max(30).optional(),

  email: z.string().trim().toLowerCase().email("Formato de email inválido.").optional(),

  website: z.string().trim().url("Formato de website inválido.").optional(),

  morada: z.string().trim().max(250).optional(),
  bairro: z.string().trim().max(150).optional(),
  cidade: z.string().trim().max(100).optional(),

  provincia_id: z.coerce.number().int().positive().optional(),
  municipio_id: z.coerce.number().int().positive().optional(),
});

export type CriarEmpresaInput = z.infer<typeof criarEmpresaSchema>;

export const editarEmpresaSchema = criarEmpresaSchema.partial();

export type EditarEmpresaInput = z.infer<typeof editarEmpresaSchema>;

export const configFiscalSchema = z.object({
  taxa_inss_funcionario: z.coerce
    .number()
    .min(0, "A taxa de INSS do funcionário não pode ser negativa.")
    .max(100, "A taxa de INSS do funcionário não pode exceder 100%.")
    .optional(),

  taxa_inss_entidade: z.coerce
    .number()
    .min(0, "A taxa de INSS da entidade não pode ser negativa.")
    .max(100, "A taxa de INSS da entidade não pode exceder 100%.")
    .optional(),

  subsidio_alimentacao: z.coerce
    .number()
    .min(0, "O subsídio de alimentação não pode ser negativo.")
    .max(9999999999.99, "O subsídio de alimentação excede o limite permitido.")
    .optional(),

  subsidio_transporte: z.coerce
    .number()
    .min(0, "O subsídio de transporte não pode ser negativo.")
    .max(9999999999.99, "O subsídio de transporte excede o limite permitido.")
    .optional(),

  moeda_id: z.coerce
    .number()
    .int("A moeda deve ser um número inteiro.")
    .positive("A moeda deve ser válida.")
    .optional(),

  regime_fiscal: z
    .string()
    .trim()
    .max(50, "O regime fiscal não pode exceder 50 caracteres.")
    .optional(),
});

export type ConfigFiscalInput = z.infer<typeof configFiscalSchema>;

export const contaBancariaSchema = z.object({
  banco_id: z.coerce
    .number()
    .int("O banco deve ser um número inteiro.")
    .positive("O banco deve ser válido.")
    .optional(),

  banco_nome: z
    .string()
    .trim()
    .max(150, "O nome do banco não pode exceder 150 caracteres.")
    .optional(),

  numero_conta: z
    .string({ message: "O número de conta é obrigatório." })
    .trim()
    .min(1, "O número de conta é obrigatório.")
    .max(50, "O número de conta não pode exceder 50 caracteres."),

  iban: z.string().trim().max(34, "O IBAN não pode exceder 34 caracteres.").optional(),

  moeda_id: z.coerce
    .number()
    .int("A moeda deve ser um número inteiro.")
    .positive("A moeda deve ser válida.")
    .optional(),

  principal: z.boolean().optional(),
});

export type ContaBancariaInput = z.infer<typeof contaBancariaSchema>;
