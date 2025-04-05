import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import { updateProfileController } from "./controller/updateProfile.controller";
import { updateProfileSchema } from "./schema/updateProfile.schema";

const router = Router();

router.patch(
  "/profile",
  authMiddleware,
  validate(updateProfileSchema),
  updateProfileController
);

export default router;
