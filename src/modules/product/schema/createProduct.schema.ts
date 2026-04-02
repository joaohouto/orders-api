import { z } from "zod";

const variationSchema = z.object({
  name: z.string().min(1),
  priceAdjustment: z.number().default(0),
});

const variationGroupSchema = z.object({
  name: z.string().min(1),
  variations: z.array(variationSchema).min(1),
});

export const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  images: z.array(z.string().url()).max(10).optional(),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variationGroups: z.array(variationGroupSchema).min(1),
});

export type CreateProductInput = z.infer<typeof schema> & {
  requesterId: string;
  storeSlug: string;
};
