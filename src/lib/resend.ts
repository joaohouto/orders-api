import { Resend } from "resend";
import { generateOrderEmailTemplate } from "@/emails/order-confirmation";

const resend = new Resend(process.env.RESEND_API_KEY!);

export async function sendOrderEmail({
  to,
  name,
  orderId,
  orderCode,
  items,
  total,
}: {
  to: string;
  name: string;
  orderId: string;
  orderCode: string;
  items: {
    productId: string;
    productName: string;
    unitPrice: any;
    quantity: number;
    note: string | undefined;
    selectedVariations: { variationId: string; variationName: string; variationGroup: string }[];
  }[];
  total: any;
}) {
  const html = generateOrderEmailTemplate({
    customerName: name,
    orderId,
    orderCode,
    total,
    items: items.map((item) => ({
      ...item,
      variationName: item.selectedVariations.map((v) => v.variationName).join(" / "),
    })),
  });

  await resend.emails.send({
    from: "vendeuu <vendeuu@joaocouto.com>",
    to,
    subject: "🐦 Confirmação do seu pedido!",
    html,
  });
}
