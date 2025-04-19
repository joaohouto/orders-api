import { Request, Response } from "express";
import { generatePix } from "../usecase/generatePix.usecase";

export async function generatePixController(req: Request, res: Response) {
  const user = req.user;
  const { orderId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });

    return;
  }

  try {
    const payment = await generatePix(orderId, user.id);

    res.json(payment);
    return;
  } catch (err: any) {
    res.status(403).json({ error: err.message });
    return;
  }
}
