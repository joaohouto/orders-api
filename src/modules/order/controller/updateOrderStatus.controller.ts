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

  if (!userId) return res.status(401).json({ error: "Não autenticado" });

  const parse = bodySchema.safeParse(req.body);
  if (!parse.success) {
    return res.status(400).json({ error: "Status inválido" });
  }

  try {
    const order = await updateOrderStatusUseCase(
      orderId,
      userId,
      parse.data.status
    );

    return res.json(order);
  } catch (err: any) {
    return res.status(403).json({ error: err.message });
  }
}
