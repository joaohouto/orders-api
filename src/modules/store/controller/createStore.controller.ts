import { Request, Response } from "express";
import { createStore } from "../usecase/createStore.usecase";

export const createStoreController = async (req: Request, res: Response) => {
  const user = req.user;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });

    return;
  }

  const { name, slug } = req.body;

  try {
    const store = await createStore({ name, slug, ownerId: user.id });
    res.status(201).json(store);

    return;
  } catch (err: any) {
    res.status(500).json({ msg: err.message || "Erro ao criar loja" });

    return;
  }
};
