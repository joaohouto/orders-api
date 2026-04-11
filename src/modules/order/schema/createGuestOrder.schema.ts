import { z } from "zod";

export const createGuestOrderSchema = z.object({
  buyerName: z.string().min(1),
  buyerPhone: z.string().min(1),
  buyerEmail: z.string().email().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variationIds: z.array(z.string()).min(1),
      quantity: z.number().min(1),
      note: z.string().optional(),
    })
  ),
});

export type CreateGuestOrderInput = z.infer<typeof createGuestOrderSchema>;
