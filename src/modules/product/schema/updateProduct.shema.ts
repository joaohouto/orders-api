import { z } from "zod";

const variationSchema = z.object({
  name: z.string().min(1),
  priceAdjustment: z.number().default(0),
});

const variationGroupSchema = z.object({
  name: z.string().min(1),
  variations: z.array(variationSchema).min(1),
});

export const updateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  images: z.array(z.string().url()).min(1).max(10),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variationGroups: z.array(variationGroupSchema),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
