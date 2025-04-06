import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { createOrderController } from "./controller/createOrder.controller";
import { getStoreOrdersController } from "./controller/listStoreOrders.controller";
import { getUserOrdersController } from "./controller/getUserOrders.controller";
import { updateOrderStatusController } from "./controller/updateOrderStatus.controller";
import { cancelOrderController } from "./controller/cancelOrder.controller";

const router = Router();

router.post("/orders", authMiddleware, createOrderController);
router.get("/stores/:storeId/orders", authMiddleware, getStoreOrdersController);
router.get("/me/orders", authMiddleware, getUserOrdersController);

router.patch(
  "/orders/:orderId/status",
  authMiddleware,
  updateOrderStatusController
);

router.patch("/orders/:orderId/cancel", authMiddleware, cancelOrderController);

export default router;
