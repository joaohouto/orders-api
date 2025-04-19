import { z } from "zod";

export const createStoreSchema = z.object({
  name: z.string().min(2).max(50),
  slug: z.string().min(2).max(50),
  instagram: z.string().min(2).max(50).optional(),
  pix: z.string().min(1).optional(),
});
