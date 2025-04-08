import { Request, Response } from "express";
import { createOrder } from "../usecase/createOrder.usecase";
import { z } from "zod";

const createOrderSchema = z.object({
  items: z.array(
    z.object({
      productId: z.string(),
      variationId: z.string(),
      quantity: z.number().min(1),
      note: z.string().optional(),
    })
  ),
});

export async function createOrderController(req: Request, res: Response) {
  const user = req.user;
  const { storeId } = req.params;

  if (!user) return res.status(401).json({ error: "Não autenticado" });

  const parsed = createOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const order = await createOrder(parsed.data, storeId, user.id);
    return res.status(201).json(order);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
