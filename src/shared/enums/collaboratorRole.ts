export const CollaboratorRoles = {
  VIEW: "VIEW",
  EDIT: "EDIT",
} as const;

export type CollaboratorRole = keyof typeof CollaboratorRoles;
