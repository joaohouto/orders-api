import { Parser } from "json2csv";

import { prisma } from "@/prisma/client";
import { checkPermission } from "@/core/permission/checkPermission";

const STATUS_LABELS: Record<string, string> = {
  PENDING: "Pendente",
  CONFIRMED: "Confirmado",
  IN_PRODUCTION: "Em produção",
  READY: "Pronto",
  DELIVERED: "Entregue",
  CANCELED: "Cancelado",
};

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
    where: {
      storeId: store.id,
    },
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
          selectedVariations: true,
        },
      },
    },
  });

  const flattenedItems = orders.flatMap((order) =>
    order.items.map((item) => ({
      "Código": order.code,
      "Status": STATUS_LABELS[order.status] ?? order.status,
      "Cliente": order.user.name,
      "Telefone": order.user.phone,
      "CPF/CNPJ": order.user.document,
      "Produto": item.product.name,
      "Variações": item.selectedVariations.map((v) => v.variationName).join(" / "),
      "Observação": item.note ?? "",
      "Preço unitário": Number(item.unitPrice).toFixed(2),
      "Quantidade": item.quantity,
      "Total do item": (Number(item.unitPrice) * item.quantity).toFixed(2),
    }))
  );

  const parser = new Parser({
    fields: [
      "Código",
      "Status",
      "Cliente",
      "Telefone",
      "CPF/CNPJ",
      "Produto",
      "Variações",
      "Observação",
      "Preço unitário",
      "Quantidade",
      "Total do item",
    ],
  });

  const csv = parser.parse(flattenedItems);

  return csv;
}
