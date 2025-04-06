import { Request, Response } from "express";
import { listUserStores } from "../usecase/listUserStores.usecase";

export const listUserStoresController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  try {
    const list = await listUserStores({
      requesterId: user.id,
    });

    res.json(list);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
