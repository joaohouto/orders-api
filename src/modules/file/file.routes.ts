import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { upload } from "@/middleware/upload";

import { uploadFileController } from "@/modules/file/controller/uploadFile.controller";

const router = Router();

router.post(
  "/files/upload",
  authMiddleware,
  upload.single("file"),
  uploadFileController
);

export default router;
