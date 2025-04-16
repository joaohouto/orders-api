import { z } from "zod";

export const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variationId: z.string(),
      quantity: z.number().min(1),
      note: z.string().optional(),
    })
  ),
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
