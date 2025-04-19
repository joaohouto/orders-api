import { Resend } from "resend";
import { generateOrderEmailTemplate } from "@/emails/order-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderEmail({
  to,
  name,
  orderId,
  items,
  total,
}: {
  to: string;
  name: string;
  orderId: string;
  items: {
    productId: string;
    variationId: string;
    productName: string;
    variationName: string;
    unitPrice: any;
    quantity: number;
    note: string | undefined;
  }[];
  total: any;
}) {
  const html = generateOrderEmailTemplate({
    customerName: name,
    orderId,
    total,
    items,
  });

  await resend.emails.send({
    from: "Vendeuu <vendeuu@joaocouto.com>",
    to,
    subject: "Confirmação do seu pedido!",
    html,
  });
}
