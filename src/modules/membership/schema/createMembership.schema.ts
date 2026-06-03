import { z } from "zod";

export const createMembershipSchema = z.object({
  planId: z.string().min(1, "Plano é obrigatório"),
});

export type CreateMembershipInput = z.infer<typeof createMembershipSchema>;
