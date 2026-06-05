import { Router } from "express";
import { authMiddleware } from "@/middleware/auth.middleware";
import { createMembershipController } from "./controller/createMembership.controller";
import { listMembershipsController } from "./controller/listMemberships.controller";
import { updateMembershipStatusController } from "./controller/updateMembershipStatus.controller";
import { listUserMembershipsController } from "./controller/listUserMemberships.controller";
import { generateMembershipPixController } from "./controller/generateMembershipPix.controller";
import { bulkCreateMembershipsController } from "./controller/bulkCreateMemberships.controller";

const router = Router();

router.post("/stores/:storeSlug/memberships", authMiddleware, createMembershipController);
router.get("/stores/:storeSlug/memberships", authMiddleware, listMembershipsController);
router.patch("/memberships/:membershipId/status", authMiddleware, updateMembershipStatusController);
router.get("/me/memberships", authMiddleware, listUserMembershipsController);
router.post("/stores/:storeSlug/memberships/bulk", authMiddleware, bulkCreateMembershipsController);
router.get("/memberships/:membershipId/payment/pix", authMiddleware, generateMembershipPixController);

export default router;
