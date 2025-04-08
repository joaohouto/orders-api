import QRCode from "qrcode";

export async function gerarQRCodeBase64(payload: string) {
  return await QRCode.toDataURL(payload); // retorna uma imagem em base64
}
