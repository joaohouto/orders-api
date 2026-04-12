import { profanity } from "@2toad/profanity";

// Sem caracteres ambíguos: sem 0, 1, I, O
const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";

function generate(): string {
  let code = "";
  for (let i = 0; i < 8; i++) {
    code += ALPHABET[Math.floor(Math.random() * ALPHABET.length)];
  }
  return `${code.slice(0, 4)}-${code.slice(4)}`;
}

export function generateOrderCode(): string {
  for (let attempt = 0; attempt < 20; attempt++) {
    const code = generate();
    if (!profanity.exists(code.replace("-", " "))) return code;
  }
  throw new Error("Não foi possível gerar um código para o pedido");
}
