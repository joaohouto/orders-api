import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { createOrderController } from "./controller/createOrder.controller";
import { getStoreOrdersController } from "./controller/listStoreOrders.controller";
import { getUserOrdersController } from "./controller/getUserOrders.controller";
import { updateOrderStatusController } from "./controller/updateOrderStatus.controller";
import { cancelOrderController } from "./controller/cancelOrder.controller";
import { getOrderById } from "./controller/getOrderById.controller";
import { exportStoreOrdersController } from "./controller/exportStoreOrders.controller";

const router = Router();

router.post("/stores/:storeId/orders", authMiddleware, createOrderController);
router.get("/me/orders", authMiddleware, getUserOrdersController);
router.patch("/orders/:orderId/cancel", authMiddleware, cancelOrderController);

router.get(
  "/stores/:storeSlug/orders",
  authMiddleware,
  getStoreOrdersController
);

router.get(
  "/stores/:storeSlug/orders/export",
  authMiddleware,
  exportStoreOrdersController
);

router.get("/orders/:orderId", authMiddleware, getOrderById);

router.patch(
  "/orders/:orderId/status",
  authMiddleware,
  updateOrderStatusController
);

export default router;
