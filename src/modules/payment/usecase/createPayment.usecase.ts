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
        success: `${process.env.WEB_CLIENT_URL}/orders?status=success`,
        failure: `${process.env.WEB_CLIENT_URL}/orders?status=failed`,
        pending: `${process.env.WEB_CLIENT_URL}/orders?status=pending`,
      },
      notification_url:
        "https://c7f9-2804-28f4-8b00-4c7-dd76-713b-f87a-5773.ngrok-free.app/webhook/mercadopago",
      payer: {
        email: order.user.email,
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
