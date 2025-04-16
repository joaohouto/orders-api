import { Request, Response } from "express";
import { deleteProduct } from "../usecase/deleteProduct.usecase";

export async function deleteProductController(req: Request, res: Response) {
  const productId = req.params.productId;
  const user = req.user;

  if (!user) {
    res.status(401).json({ msg: "Não autenticado" });

    return;
  }

  try {
    const result = await deleteProduct(productId, user.id);

    res.json(result);

    return;
  } catch (err: any) {
    res.status(400).json({ error: err.message });

    return;
  }
}
