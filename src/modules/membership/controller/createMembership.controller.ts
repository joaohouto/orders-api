import { Request, Response } from "express";
import { createMembership } from "../usecase/createMembership.usecase";
import { createMembershipSchema } from "../schema/createMembership.schema";

export async function createMembershipController(req: Request, res: Response) {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  const parsed = createMembershipSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({ error: parsed.error.flatten() });
    return;
  }

  try {
    const membership = await createMembership(parsed.data, storeSlug, user.id);
    res.status(201).json(membership);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
