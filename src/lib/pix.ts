// lib/pix.ts
import { Payload } from "pix-payload";

export function gerarPixPayload({
  chavePix,
  nome,
  cidade,
  valor,
  txid,
  mensagem,
}: {
  chavePix: string;
  nome: string;
  cidade: string;
  valor: number;
  txid: string;
  mensagem?: string;
}) {
  const payload = new Payload()
    .setPixKey(chavePix)
    .setMerchantName(nome)
    .setMerchantCity(cidade)
    .setAmount(valor.toFixed(2))
    .setTxid(txid)
    .setMessage(mensagem ?? "Pagamento do pedido");

  return payload.build();
}
