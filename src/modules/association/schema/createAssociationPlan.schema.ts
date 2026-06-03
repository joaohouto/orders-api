import { z } from "zod";

export const createAssociationPlanSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  description: z.string().optional(),
  price: z.number().positive("Preço deve ser positivo"),
  durationMonths: z.enum(["1", "6", "12"]).transform(Number),
});

export type CreateAssociationPlanInput = z.infer<typeof createAssociationPlanSchema>;
