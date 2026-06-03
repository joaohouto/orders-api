import { z } from "zod";

export const updateAssociationPlanSchema = z.object({
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  price: z.number().positive().optional(),
  durationMonths: z.enum(["1", "6", "12"]).transform(Number).optional(),
  isActive: z.boolean().optional(),
});

export type UpdateAssociationPlanInput = z.infer<typeof updateAssociationPlanSchema>;
