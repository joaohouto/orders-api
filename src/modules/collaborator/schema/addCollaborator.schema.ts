import { z } from "zod";

export const addCollaboratorSchema = z.object({
  userIdToAdd: z.string().min(1),
  role: z.enum(["VIEW", "EDIT"]),
});
