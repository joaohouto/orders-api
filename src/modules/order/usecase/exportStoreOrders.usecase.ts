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

function formatDate(date: Date): string {
  return date.toLocaleString("pt-BR", { timeZone: "America/Sao_Paulo" });
}

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

  // Coleta todos os nomes de grupos de variação únicos presentes nos pedidos
  const allVariationGroups = Array.from(
    new Set(
      orders.flatMap((order) =>
        order.items.flatMap((item) =>
          item.selectedVariations.map((v) => v.variationGroup)
        )
      )
    )
  ).sort();

  const flattenedItems = orders.flatMap((order) =>
    order.items.map((item) => {
      const variationColumns: Record<string, string> = {};
      for (const group of allVariationGroups) {
        const match = item.selectedVariations.find(
          (v) => v.variationGroup === group
        );
        variationColumns[group] = match?.variationName ?? "";
      }

      return {
        "Código": order.code,
        "Data do pedido": formatDate(order.createdAt),
        "Status": STATUS_LABELS[order.status] ?? order.status,
        "Cliente": order.buyerName,
        "Telefone": order.buyerPhone,
        "CPF/CNPJ": order.user?.document ?? "",
        "Produto": item.product.name,
        ...variationColumns,
        "Observação": item.note ?? "",
        "Preço unitário": Number(item.unitPrice).toFixed(2),
        "Quantidade": item.quantity,
        "Total do item": (Number(item.unitPrice) * item.quantity).toFixed(2),
      };
    })
  );

  const fields = [
    "Código",
    "Data do pedido",
    "Status",
    "Cliente",
    "Telefone",
    "CPF/CNPJ",
    "Produto",
    ...allVariationGroups,
    "Observação",
    "Preço unitário",
    "Quantidade",
    "Total do item",
  ];

  const parser = new Parser({ fields });
  const csv = parser.parse(flattenedItems);

  return csv;
}
