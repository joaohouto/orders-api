import { z } from "zod";

export const updateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1).max(10),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variations: z.array(
    z.object({
      name: z.string().min(1),
      type: z.enum(["GENERIC", "COLOR", "SIZE", "FABRIC"]).default("GENERIC"),
      priceAdjustment: z.number().default(0),
    })
  ),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
