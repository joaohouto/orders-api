import { Request, Response } from "express";
import { uploadFileUsecase } from "../usecase/uploadFile.usecase";

export const uploadFileController = async (req: Request, res: Response) => {
  const { storeId, productId } = req.body;
  const userId = req.user?.id;

  if (!req.file) {
    res.status(400).json({ error: "Arquivo não enviado" });
    return;
  }

  const file = await uploadFileUsecase({
    file: req.file,
    uploadedById: userId,
    storeId,
    productId,
  });

  res.status(201).json(file);
  return;
};
