import { Preference } from "mercadopago";

import { mercadopagoClient } from "@/lib/mercadopago";
import { prisma } from "@/prisma/client";

const preference = new Preference(mercadopagoClient);

interface ICreatePayment {
  orderId: string;
  requesterId: string;
}

export async function createPayment({ orderId, requesterId }: ICreatePayment) {
  const order = await prisma.order.findUnique({
    where: {
      id: orderId,
      userId: requesterId,
    },
    include: {
      items: {
        include: {
          product: true,
        },
      },
      user: true,
    },
  });

  if (!order) {
    throw new Error("Pedido não encontrado");
  }

  if (order.userId !== requesterId) {
    throw new Error("Você não tem permissão para pagar este pedido");
  }

  if (order.status !== "PENDING") {
    throw new Error("O pedido não pode ser pago");
  }

  const orderItems = order.items.map((item: any) => {
    return {
      id: item.id,
      unit_price: item.unitPrice.toNumber(),
      quantity: item.quantity,
      title: `${item.productName} (${item.variationName}) ${item.note}`,
    };
  });

  const preferenceData = await preference.create({
    body: {
      items: orderItems,
      back_urls: {
        success: `${process.env.WEB_CLIENT_URL}/orders/${orderId}`,
        failure: `${process.env.WEB_CLIENT_URL}/orders/${orderId}`,
        pending: `${process.env.WEB_CLIENT_URL}/orders/${orderId}`,
      },
      notification_url:
        "https://1b73-2804-28f4-8b00-4c7-7687-41a0-5dde-5952.ngrok-free.app/webhook/mercadopago",
      payer: {
        email: order.user.email,
        name: order.user.name,
      },
      metadata: {
        payer_email: order.user.email,
        payer_id: order.user.id,
        order_id: order.id,
      },
    },
  });

  return {
    redirectTo: preferenceData.init_point,
  };
}
