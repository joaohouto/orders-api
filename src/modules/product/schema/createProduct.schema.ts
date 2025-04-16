import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  images: z.array(z.string().url()).optional(),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variations: z
    .array(
      z.object({
        name: z.string().min(1),
        price: z.number().positive(),
      })
    )
    .min(1),
});

export type CreateProductInput = z.infer<typeof schema> & {
  requesterId: string;
  storeSlug: string;
};
