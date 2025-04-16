import { Request, Response } from "express";
import { z } from "zod";
import { updateOrderStatusUseCase } from "../usecase/updateOrderStatus.usecase";

const bodySchema = z.object({
  status: z.enum([
    "PENDING",
    "CONFIRMED",
    "IN_PRODUCTION",
    "READY",
    "DELIVERED",
    "CANCELED",
  ]),
});

export async function updateOrderStatusController(req: Request, res: Response) {
  const userId = req.user?.id;
  const orderId = req.params.orderId;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) {
    res.status(400).json({ error: "Status inválido" });
    return;
  }

  try {
    const order = await updateOrderStatusUseCase(
      orderId,
      userId,
      parse.data.status
    );

    res.json(order);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
