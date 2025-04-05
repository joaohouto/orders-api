import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Telefone inválido")
    .optional(),
});
