import { Request, Response } from "express";
import { createOrder } from "../usecase/createOrder.usecase";
import { createOrderSchema } from "../schema/createOrder.schema";

export async function createOrderController(req: Request, res: Response) {
  const user = req.user;
  const { storeId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
  }

  const parsed = createOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
  }

  try {
    const order = await createOrder(parsed.data, storeId, user.id);

    res.status(201).json(order);

    return;
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }
}
