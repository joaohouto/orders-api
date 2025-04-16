import { Request, Response } from "express";
import { updateProfile } from "../usecase/updateProfile.usecase";

export const updateProfileController = async (req: Request, res: Response) => {
  const user = req.user;
  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });

    return;
  }

  const { name, phone } = req.body;

  try {
    const updated = await updateProfile({ userId: user.id, name, phone });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ msg: "Erro ao atualizar perfil", err });
  }
};
