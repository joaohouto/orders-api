import { Request, Response } from "express";
import { listMemberships } from "../usecase/listMemberships.usecase";

export async function listMembershipsController(req: Request, res: Response) {
  const user = req.user;
  const { storeSlug } = req.params;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const memberships = await listMemberships(storeSlug, user.id);
    res.json(memberships);
  } catch (err: any) {
    res.status(403).json({ error: err.message });
  }
}
