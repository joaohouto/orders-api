import { prisma } from "@/prisma/client";
import { CollaboratorRoles } from "@/shared/enums/collaboratorRole";
import { Decimal } from "@prisma/client/runtime/library";
import { CreateProductInput } from "../schema/createProduct.schema";

export async function createProduct({
  name,
  slug,
  description,
  images,
  storeSlug,
  acceptOrderNote,
  isActive,
  variations,
  requesterId,
}: CreateProductInput) {
  const store = await prisma.store.findUnique({
    where: { slug: storeSlug },
    include: { owner: true },
  });

  if (!store) throw new Error("Loja não encontrada");

  const isOwner = store.ownerId === requesterId;

  const isEditor = await prisma.collaborator.findFirst({
    where: {
      storeId: store.id,
      userId: requesterId,
      role: CollaboratorRoles.EDIT,
    },
  });

  if (!isOwner && !isEditor) {
    throw new Error("Sem permissão para criar produto");
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      description,
      images,
      storeId: store.id,
      isActive,
      acceptOrderNote,
      variations: {
        create: variations.map((v) => ({
          name: v.name,
          price: new Decimal(v.price),
        })),
      },
    },
    include: {
      variations: true,
    },
  });

  return product;
}
