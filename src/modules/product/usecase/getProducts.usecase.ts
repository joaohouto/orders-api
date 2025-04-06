import { prisma } from "@/prisma/client";

interface ListProductsParams {
  storeId: string;
  page?: number;
  limit?: number;
  search?: string;
}

export async function getProducts({
  storeId,
  page = 1,
  limit = 10,
  search,
}: ListProductsParams) {
  const skip = (page - 1) * limit;

  const where = {
    storeId,
    deletedAt: null,
    name: search ? { contains: search, mode: "insensitive" } : undefined,
  };

  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      //include: { variations: true },
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
