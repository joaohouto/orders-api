import { Parser } from "json2csv";

import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

export async function exportStoreOrdersUseCase(
  storeSlug: string,
  userId: string
) {
  const store = await prisma.store.findUnique({
    where: {
      slug: storeSlug,
    },
  });

  if (!store) throw new Error("Loja não encontrada");

  const hasPermission = await checkPermission({
    storeId: store.id,
    userId,
    allowedRoles: ["OWNER", "EDIT", "VIEW"],
  });

  if (!hasPermission) throw new Error("Sem permissão");

  const orders = await prisma.order.findMany({
    include: {
      user: {
        select: {
          name: true,
          phone: true,
          document: true,
        },
      },
      items: {
        include: {
          product: true,
        },
      },
    },
  });

  const flattenedItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      orderId: order.id,
      status: order.status,
      userName: order.user.name,
      userPhone: order.user.phone,
      userDocument: order.user.document,
      productName: item.product.name,
      productVariation: item.variationName,
      productItemNote: item.note,
      unitPrice: item.unitPrice,
      quantity: item.quantity,
    }))
  );

  const parser = new Parser({
    fields: [
      "orderId",
      "status",
      "userName",
      "userPhone",
      "userDocument",
      "productName",
      "productVariation",
      "productItemNote",
      "unitPrice",
      "quantity",
    ],
  });

  const csv = parser.parse(flattenedItems);

  return csv;
}
