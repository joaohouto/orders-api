import { z } from "zod";

export const addCollaboratorSchema = z.object({
  userEmailToAdd: z.string().email("E-mail inválido"),
  role: z.enum(["VIEW", "EDIT"]),
});
