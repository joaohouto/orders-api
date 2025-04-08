import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import { createStoreController } from "./controller/createStore.controller";
import { createStoreSchema } from "./schema/createStore.schema";
import { updateStoreController } from "./controller/updateStore.controller";
import { listUserStoresController } from "./controller/listUserStores.controller";
import { viewOneStoreController } from "./controller/viewOneStore.controller";
import { listAllStoresController } from "./controller/listAllStores.controller";

const router = Router();

router.post(
  "/",
  authMiddleware,
  validate(createStoreSchema),
  createStoreController
);

router.get("/", listAllStoresController);
router.get("/mine", authMiddleware, listUserStoresController);
router.get("/:storeSlug", viewOneStoreController);

router.put("/:storeId", authMiddleware, updateStoreController);

export default router;
