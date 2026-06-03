import { Request, Response } from "express";
import { listUserMemberships } from "../usecase/listUserMemberships.usecase";

export async function listUserMembershipsController(req: Request, res: Response) {
  const user = req.user;

  if (!user) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  try {
    const memberships = await listUserMemberships(user.id);
    res.json(memberships);
  } catch (err: any) {
    res.status(400).json({ error: err.message });
  }
}
