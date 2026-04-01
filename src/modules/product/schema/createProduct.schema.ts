import { z } from "zod";

export const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string().url()).max(10).optional(),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variations: z
    .array(
      z.object({
        name: z.string().min(1),
        type: z.enum(["GENERIC", "COLOR", "SIZE", "FABRIC"]).default("GENERIC"),
        priceAdjustment: z.number().default(0),
      })
    )
    .min(1),
});

export type CreateProductInput = z.infer<typeof schema> & {
  requesterId: string;
  storeSlug: string;
};
