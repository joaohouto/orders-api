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

export const updateProductSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().min(1),
  price: z.number().positive(),
  memberPrice: z.number().positive().optional().nullable(),
  images: z.array(z.string().url()).min(1).max(10),
  acceptOrderNote: z.boolean(),
  isActive: z.boolean(),
  soldOutAt: z.coerce.date().nullable().optional(),
  variationGroups: z.array(variationGroupSchema),
});

export type UpdateProductInput = z.infer<typeof updateProductSchema>;
