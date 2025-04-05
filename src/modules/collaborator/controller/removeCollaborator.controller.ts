import { Request, Response } from "express";
import { removeCollaborator } from "../usecase/removeCollaborator.usecase";

export const removeCollaboratorController = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  const storeId = req.params.storeId;
  const userIdToRemove = req.params.userId;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  try {
    const result = await removeCollaborator({
      storeId,
      userIdToRemove,
      requesterId: user.id,
    });

    res.json(result);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
