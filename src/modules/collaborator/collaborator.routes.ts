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
  "/stores/:storeId/collaborators",
  authMiddleware,
  validate(addCollaboratorSchema),
  addCollaboratorController
);

router.get(
  "/stores/:storeId/collaborators",
  authMiddleware,
  listCollaboratorsController
);

router.delete(
  "/stores/:storeId/collaborators/:userId",
  authMiddleware,
  removeCollaboratorController
);

router.patch(
  "/stores/:storeId/collaborators/:userId/role",
  authMiddleware,
  updateCollaboratorRoleController
);

export default router;
