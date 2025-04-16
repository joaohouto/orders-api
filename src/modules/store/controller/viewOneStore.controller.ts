import { Request, Response } from "express";
import { viewOneStore } from "../usecase/viewOneStore.usecase";

export const viewOneStoreController = async (req: Request, res: Response) => {
  const { storeSlug } = req.params;

  try {
    const store = await viewOneStore({
      storeSlug,
    });

    if (!store) {
      res.status(404).json({
        msg: "Loja não encontrada",
      });

      return;
    }

    res.json(store);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
