import { z } from "zod";

export const updateStoreSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
  instagram: z.string().min(2).max(50).optional(),
  icon: z.string().url().min(1).optional(),
  banner: z.string().url().min(1).optional(),
  pix: z.string().min(1).optional(),
  city: z.string().min(1).optional(),
  postalCode: z.string().min(1).optional(),
});

export type UpdateStoreInput = z.infer<typeof updateStoreSchema>;
