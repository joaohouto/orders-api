import { Router } from "express";

import { authMiddleware } from "@/middleware/auth.middleware";
import { validate } from "@/middleware/validate";

import { addCollaboratorController } from "./controller/addCollaborator.controller";
import { addCollaboratorSchema } from "./schema/addCollaborator.schema";

import { listCollaboratorsController } from "./controller/listCollaborators.controller";
import { removeCollaboratorController } from "./controller/removeCollaborator.controller";
import { updateCollaboratorRoleController } from "./controller/updateCollaboratorRole.controller";

const router = Router();

router.post(
  "/stores/:storeSlug/collaborators",
  authMiddleware,
  validate(addCollaboratorSchema),
  addCollaboratorController
);

router.get(
  "/stores/:storeSlug/collaborators",
  authMiddleware,
  listCollaboratorsController
);

router.delete(
  "/stores/:storeSlug/collaborators/:userId",
  authMiddleware,
  removeCollaboratorController
);

router.patch(
  "/stores/:storeSlug/collaborators/:userId/role",
  authMiddleware,
  updateCollaboratorRoleController
);

export default router;
