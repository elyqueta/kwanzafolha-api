import { z } from 'zod';

export const loginSchema = z.object({
  email: z
    .string({ message: 'O email é obrigatório.' })
    .trim()
    .toLowerCase()
    .email('Formato de email inválido.'),

  password: z
    .string({ message: 'A password é obrigatória.' })
    .min(1, 'A password é obrigatória.'),
});

// Tipo TypeScript derivado automaticamente do schema — assim o controller
// usa o mesmo contrato que o Zod valida, sem duplicar a definição.
export type LoginInput = z.infer<typeof loginSchema>;