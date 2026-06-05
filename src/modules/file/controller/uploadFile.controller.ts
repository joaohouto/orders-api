import { Request, Response } from "express";
import { uploadFileUsecase } from "../usecase/uploadFile.usecase";
import { handleError } from "@/shared/handleError";

export const uploadFileController = async (req: Request, res: Response) => {
  const { storeId, productId } = req.body;
  const userId = req.user?.id;

  if (!userId) {
    res.status(401).json({ error: "Não autenticado" });
    return;
  }

  if (!req.file) {
    res.status(400).json({ error: "Arquivo não enviado" });
    return;
  }

  try {
    const file = await uploadFileUsecase({
      file: req.file,
      uploadedById: userId,
      storeId,
      productId,
    });

    res.status(201).json(file);
  } catch (err) {
    handleError(res, err);
  }
};
