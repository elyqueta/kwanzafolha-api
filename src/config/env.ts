import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "production", "test"]).default("development"),

  PORT: z.coerce
    .number({ message: "PORT deve ser um número." })
    .int()
    .positive()
    .default(3001),

  CORS_ALLOWED_ORIGINS: z
    .string()
    .transform((valor) =>
      valor
        .split(",")
        .map((origem) => origem.trim())
        .filter((origem) => origem.length > 0),
    )
    .optional(),

  DB_HOST: z.string().min(1, "DB_HOST é obrigatório."),
  DB_PORT: z.coerce.number({ message: "DB_PORT deve ser um número." }).int().positive(),
  DB_NAME: z.string().min(1, "DB_NAME é obrigatório."),
  DB_USER: z.string().min(1, "DB_USER é obrigatório."),
  DB_PASSWORD: z.string().min(1, "DB_PASSWORD é obrigatório."),

  JWT_SECRET: z
    .string()
    .min(
      32,
      "JWT_SECRET deve ter pelo menos 32 caracteres (usa algo gerado aleatoriamente, nunca um texto previsível).",
    ),
});

type EnvRaw = z.infer<typeof envSchema>;

export type Env = Omit<EnvRaw, "CORS_ALLOWED_ORIGINS"> & {
  CORS_ALLOWED_ORIGINS: string[];
};

function carregarEnv(): Env {
  const resultado = envSchema.safeParse(process.env);

  if (!resultado.success) {
    console.error("Configuração inválida — o servidor não pode arrancar.");
    console.error("Corrige o(s) seguinte(s) problema(s) no teu ficheiro .env:");
    for (const issue of resultado.error.issues) {
      console.error(`  - ${issue.path.join(".")}: ${issue.message}`);
    }
    process.exit(1);
  }

  return {
    ...resultado.data,
    CORS_ALLOWED_ORIGINS: obrigatorioEmProducao(
      resultado.data.CORS_ALLOWED_ORIGINS,
      ["http://localhost:5173"],
      "CORS_ALLOWED_ORIGINS",
    ),
  };
}

export const env = carregarEnv();

// As flags centralizam as decisões de ambiente e evitam comparações repetidas no projeto.
export const isProduction = env.NODE_ENV === "production";
export const isDevelopment = env.NODE_ENV === "development";
export const isTest = env.NODE_ENV === "test";

// Use este helper para configurações que só podem faltar durante o desenvolvimento.
export function obrigatorioEmProducao<T>(
  valor: T | undefined,
  fallbackDesenvolvimento: T,
  nomeVariavel: string,
): T {
  if (valor !== undefined) return valor;

  if (isProduction) {
    console.error("Configuração inválida — o servidor não pode arrancar.");
    console.error(`${nomeVariavel} é obrigatório quando NODE_ENV=production.`);
    process.exit(1);
  }

  return fallbackDesenvolvimento;
}
