import { z } from "zod";

export const createGuestOrderSchema = z.object({
  buyerName: z.string().min(1),
  buyerPhone: z.string().optional(),
  buyerEmail: z.string().email().optional(),
  items: z.array(
    z.object({
      productId: z.string(),
      variationIds: z.array(z.string()),
      textInputs: z.record(z.string()).optional(),
      quantity: z.number().min(1),
      note: z.string().optional(),
      useMemberPrice: z.boolean().optional(),
    })
  ),
});

export type CreateGuestOrderInput = z.infer<typeof createGuestOrderSchema>;
