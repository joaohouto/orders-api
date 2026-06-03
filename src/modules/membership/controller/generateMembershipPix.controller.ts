import { Request, Response } from "express";
import { generateMembershipPix } from "../usecase/generateMembershipPix.usecase";

export async function generateMembershipPixController(req: Request, res: Response) {
  const user = req.user;
  const { membershipId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const payment = await generateMembershipPix(membershipId, user.id);
    res.json(payment);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
}
