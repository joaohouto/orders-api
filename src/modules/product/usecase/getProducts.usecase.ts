import { prisma } from "@/prisma/client";
import { Prisma } from "@prisma/client";

interface ListProductsParams {
  storeSlug: string;
  page?: number;
  limit?: number;
  search?: string;
}

export async function getProducts({
  storeSlug,
  page = 1,
  limit = 10,
  search,
}: ListProductsParams) {
  const skip = (page - 1) * limit;

  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const where = {
    storeId: store.id,
    deletedAt: null,
    name: search
      ? { contains: search, mode: Prisma.QueryMode.insensitive }
      : undefined,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      include: { variations: true },
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.product.count({ where }),
  ]);

  return {
    data: products,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
}
