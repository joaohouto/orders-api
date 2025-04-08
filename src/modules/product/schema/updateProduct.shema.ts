import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  images: z.array(z.string().url()).min(1),
  acceptOrderNote: z.boolean(),
  variations: z.array(
    z.object({
      name: z.string().min(1),
      price: z.number().nonnegative(),
    })
  ),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
