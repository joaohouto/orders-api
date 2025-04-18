import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(2).max(50),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, "Telefone inválido")
    .optional(),

  document: z
    .string()
    .refine(isValidCPF, {
      message: "CPF inválido",
    })
    .optional(),
});

export function isValidCPF(cpf: string): boolean {
  cpf = cpf.replace(/[^\d]+/g, "");
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) return false;

  let sum = 0;
  for (let i = 0; i < 9; i++) sum += parseInt(cpf.charAt(i)) * (10 - i);
  let firstCheck = (sum * 10) % 11;
  if (firstCheck === 10 || firstCheck === 11) firstCheck = 0;
  if (firstCheck !== parseInt(cpf.charAt(9))) return false;

  sum = 0;
  for (let i = 0; i < 10; i++) sum += parseInt(cpf.charAt(i)) * (11 - i);
  let secondCheck = (sum * 10) % 11;
  if (secondCheck === 10 || secondCheck === 11) secondCheck = 0;
  return secondCheck === parseInt(cpf.charAt(10));
}
