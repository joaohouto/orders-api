import { Request, Response } from "express";
import { listAllStores } from "../usecase/listAllStores.usecase";

export const listAllStoresController = async (req: Request, res: Response) => {
  try {
    const list = await listAllStores();

    res.json(list);
  } catch (err: any) {
    res.status(403).json({ msg: err.message });
  }
};
