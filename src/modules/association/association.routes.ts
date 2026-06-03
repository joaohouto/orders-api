import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { listAssociationPlansController } from "./controller/listAssociationPlans.controller";
import { createAssociationPlanController } from "./controller/createAssociationPlan.controller";
import { updateAssociationPlanController } from "./controller/updateAssociationPlan.controller";
import { deleteAssociationPlanController } from "./controller/deleteAssociationPlan.controller";
import { getAssociationPlanController } from "./controller/getAssociationPlan.controller";

const router = Router();

router.get("/stores/:storeSlug/association-plans", listAssociationPlansController);
router.get("/association-plans/:planId", getAssociationPlanController);
router.post("/stores/:storeId/association-plans", authMiddleware, createAssociationPlanController);
router.patch("/association-plans/:planId", authMiddleware, updateAssociationPlanController);
router.delete("/association-plans/:planId", authMiddleware, deleteAssociationPlanController);

export default router;
