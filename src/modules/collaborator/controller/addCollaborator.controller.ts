import { Request, Response } from "express";
import { addCollaborator } from "../usecase/addCollaborator.usecase";

export const addCollaboratorController = async (
  req: Request,
  res: Response
) => {
  const user = req.user;
  const storeId = req.params.storeId;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });
  const { userIdToAdd, role } = req.body;

  try {
    const result = await addCollaborator({
      storeId,
      userIdToAdd,
      role,
      requesterId: user.id,
    });

    res.status(201).json(result);
  } catch (err: any) {
    res.status(400).json({ msg: err.message });
  }
};
