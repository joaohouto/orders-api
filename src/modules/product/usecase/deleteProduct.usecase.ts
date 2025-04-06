import { checkPermission } from "@/core/permission/checkPermission";
import { prisma } from "@/prisma/client";

export async function deleteProduct(productId: string, requesterId: string) {
  // Verifica se o user tem permissão (dono ou editor)
  const product = await prisma.product.findUnique({
    where: { id: productId },
    include: { store: { include: { collaborators: true } } },
  });

  if (!product) {
    throw new Error("Produto não encontrado");
  }

  const hasPermission = await checkPermission({
    storeId: product.store.id,
    userId: requesterId,
    allowedRoles: ["OWNER", "EDIT"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const now = new Date();

  // Soft delete no produto
  await prisma.product.update({
    where: { id: productId },
    data: { deletedAt: now },
  });

  // Soft delete nas variações
  await prisma.variation.updateMany({
    where: { productId },
    data: { deletedAt: now },
  });

  return { message: "Produto deletado com sucesso" };
}
