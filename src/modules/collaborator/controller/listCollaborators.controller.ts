import { Request, Response } from "express";
import { listCollaborators } from "../usecase/listCollaborators.usecase";

export const listCollaboratorsController = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  const storeId = req.params.storeId;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  try {
    const list = await listCollaborators({
      storeId,
      requesterId: user.id,
    });

    res.json(list);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
