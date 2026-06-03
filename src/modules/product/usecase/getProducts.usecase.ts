import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

interface ListProductsParams {
  storeSlug: string;
  page?: number;
  limit?: number;
  search?: string;
  includeInactive?: boolean;
}

export async function getProducts({
  storeSlug,
  page,
  limit,
  search,
  includeInactive = false,
}: ListProductsParams) {
  const paginated = page !== undefined && limit !== undefined;
  const skip = paginated ? (page! - 1) * limit! : undefined;

  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const where = {
    storeId: store.id,
    deletedAt: null,
    ...(includeInactive ? {} : { isActive: true }),
    name: search
      ? { contains: search, mode: Prisma.QueryMode.insensitive }
      : undefined,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: {
        variationGroups: {
          where: { deletedAt: null },
          include: { variations: { where: { deletedAt: null } } },
        },
      },
      ...(paginated ? { skip, take: limit } : {}),
      orderBy: { position: "asc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: paginated
      ? {
          page: page!,
          limit: limit!,
          total,
          pages: Math.ceil(total / limit!),
        }
      : { total },
  };
}
