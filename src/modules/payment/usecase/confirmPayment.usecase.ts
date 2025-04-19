import { prisma } from "@/prisma/client";

interface IConfirmPayment {
  payerId: string;
  orderId: string;
}

export async function confirmPayment({ orderId, payerId }: IConfirmPayment) {
  const order = await prisma.order.update({
    where: {
      id: orderId,
    },
    data: {
      status: "CONFIRMED",
    },
  });

  await prisma.orderStatusHistory.create({
    data: {
      orderId,
      status: "CONFIRMED",
    },
  });

  return order;
}
