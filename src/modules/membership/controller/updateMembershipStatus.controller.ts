import { Request, Response } from "express";
import { updateMembershipStatus } from "../usecase/updateMembershipStatus.usecase";
import { z } from "zod";

const schema = z.object({
  status: z.enum(["ACTIVE", "CANCELED", "EXPIRED"]),
});

export async function updateMembershipStatusController(req: Request, res: Response) {
  const user = req.user;
  const { membershipId } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = schema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const membership = await updateMembershipStatus(membershipId, parsed.data.status, user.id);
    res.json(membership);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
