import { z } from "zod";

const variationSchema = z.object({
  name: z.string().min(1),
  priceAdjustment: z.number().default(0),
});

const variationGroupSchema = z.object({
  name: z.string().min(1),
  type: z.enum(["select", "text"]).default("select"),
  variations: z.array(variationSchema).default([]),
}).superRefine((data, ctx) => {
  if (data.type !== "text" && data.variations.length === 0) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      message: "Array must contain at least 1 element(s)",
      path: ["variations"],
    });
  }
});

export const schema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().optional(),
  price: z.number().positive(),
  memberPrice: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).max(10).optional(),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  variationGroups: z.array(variationGroupSchema).min(1),
});

export type CreateProductInput = z.infer<typeof schema> & {
  requesterId: string;
  storeSlug: string;
};
