import { Request, Response } from "express";
import { reorderProducts } from "../usecase/reorderProducts.usecase";
import { handleError } from "@/shared/handleError";

export const reorderProductsController = async (
  req: Request,
  res: Response,
) => {
  const { storeSlug } = req.params;
  const { productIds } = req.body;
  const requesterId = req.user!.id;

  try {
    await reorderProducts({ storeSlug, productIds, requesterId });
    res.status(204).send();
    return;
  } catch (err) {
    handleError(res, err);
    return;
  }
};
