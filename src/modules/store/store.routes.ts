import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import { createStoreController } from "./controller/createStore.controller";
import { createStoreSchema } from "./schema/createStore.schema";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createStoreSchema),
  createStoreController
);

export default router;
