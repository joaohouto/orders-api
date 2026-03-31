import { prisma } from "@/prisma/client";

// Sem caracteres ambíguos: sem 0, 1, I, O
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generate(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export async function generateUniqueOrderCode(): Promise<string> {
  for (let attempt = 0; attempt < 10; attempt++) {
    const code = generate();
    const existing = await prisma.order.findUnique({ where: { code } });
    if (!existing) return code;
  }
  throw new Error("Não foi possível gerar um código único para o pedido");
}
