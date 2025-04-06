import { Request, Response } from "express";
import { deleteProduct } from "../usecase/deleteProduct.usecase";

export async function deleteProductController(req: Request, res: Response) {
  const productId = req.params.productId;
  const user = req.user;

  if (!user) return res.status(401).json({ msg: "Não autenticado" });

  try {
    const result = await deleteProduct(productId, user.id);
    return res.json(result);
  } catch (err: any) {
    return res.status(400).json({ error: err.message });
  }
}
