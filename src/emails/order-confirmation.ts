interface OrderEmailProps {
  customerName: string;
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
}

export function generateOrderEmailTemplate({
  customerName,
  orderId,
  items,
  total,
}: OrderEmailProps) {
  const itemsHtml = items
    .map(
      (item) => `
      <li style="margin-bottom: 8px;">
        <div><strong>${item.productName}</strong> - ${item.variationName}</div>
        <div>Quantidade: ${item.quantity}</div>
        <div>Preço unitário: R$ ${Number(item.unitPrice).toFixed(2)}</div>
        ${
          item.note
            ? `<div style="font-style: italic;">Observação: ${item.note}</div>`
            : ""
        }
      </li>
    `
    )
    .join("");

  return `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; color: #333;">
      <h2>Pedido confirmado!</h2>
      <p>Olá ${customerName}, seu pedido <strong>#${orderId}</strong> foi confirmado com sucesso!</p>

      <h3>📦 Itens do pedido</h3>
      <ul style="padding-left: 20px; list-style: disc;">
        ${itemsHtml}
      </ul>

      <h3>Total: ${Number(total).toFixed(2)}</h3>

      <p style="margin-top: 32px;">Acompanhe o seu pedido na <a href="${
        process.env.WEB_CLIENT_URL
      }/orders">Página de Pedidos</a>.</p>
      <p style="font-size: 12px; color: #999;">Este é um e-mail automático. Não responda.</p>
    </div>
  `;
}
