import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";

import { createProductController } from "./controller/createProduct.controller";
import { getProductsController } from "./controller/getProducts.controller";
import { getProductBySlugController } from "./controller/getProductBySlug.controller";
import { updateProductController } from "./controller/updateProduct.controller";
import { deleteProductController } from "./controller/deleteProduct.controller";

const router = Router();

router.post(
  "/stores/:storeSlug/products",
  authMiddleware,
  createProductController
);

router.get("/stores/:storeSlug/products", getProductsController);

router.get(
  "/stores/:storeSlug/products/:productSlug",
  getProductBySlugController
);

router.put(
  "/stores/:storeSlug/products/:productSlug",
  authMiddleware,
  updateProductController
);

router.delete("/products/:productId", authMiddleware, deleteProductController);

export default router;
