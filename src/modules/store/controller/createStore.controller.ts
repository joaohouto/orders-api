import { Request, Response } from "express";
import { createStore } from "../usecase/createStore.usecase";

export const createStoreController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  const { name, slug } = req.body;

  try {
    const store = await createStore({ name, slug, ownerId: user.id });
    return res.status(201).json(store);
  } catch (err) {
    return res.status(500).json({ msg: "Erro ao criar loja", err });
  }
};
