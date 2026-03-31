export const CollaboratorRoles = {
  VIEW: "VIEW",
  EDIT: "EDIT",
  OWNER: "OWNER",
} as const;

export type CollaboratorRole = keyof typeof CollaboratorRoles;
