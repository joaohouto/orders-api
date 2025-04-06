import { prisma } from "@/prisma/client";

interface CheckPermissionParams {
  storeId: string;
  userId: string;
  allowedRoles: Array<"OWNER" | "EDIT" | "VIEW">;
}

export async function checkPermission({
  storeId,
  userId,
  allowedRoles,
}: CheckPermissionParams): Promise<boolean> {
  if (allowedRoles.includes("OWNER")) {
    const isOwner = await prisma.store.findFirst({
      where: {
        id: storeId,
        ownerId: userId,
      },
    });

    if (isOwner) return true;
  }

  if (allowedRoles.includes("EDIT") || allowedRoles.includes("VIEW")) {
    const collaborator = await prisma.collaborator.findFirst({
      where: {
        storeId,
        userId,
        role: {
          in: allowedRoles.filter((r) => r !== "OWNER"),
        },
      },
    });

    if (collaborator) return true;
  }

  return false;
}
