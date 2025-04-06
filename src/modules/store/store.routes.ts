import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import { createStoreController } from "./controller/createStore.controller";
import { createStoreSchema } from "./schema/createStore.schema";
import { updateStoreController } from "./controller/updateStore.controller";
import { listUserStoresController } from "./controller/listUserStores.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createStoreSchema),
  createStoreController
);

router.get("/mine", authMiddleware, listUserStoresController);

router.put("/:storeId", authMiddleware, updateStoreController);

export default router;
