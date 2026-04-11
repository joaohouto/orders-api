import { Request, Response } from "express";
import { createGuestOrder } from "../usecase/createGuestOrder.usecase";
import { createGuestOrderSchema } from "../schema/createGuestOrder.schema";

export async function createGuestOrderController(req: Request, res: Response) {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = createGuestOrderSchema.safeParse(req.body);

  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const order = await createGuestOrder(parsed.data, storeSlug, user.id);
    res.status(201).json(order);
    return;
  } catch (err: any) {
    res.status(400).json({ error: err.message });
    return;
  }
}
