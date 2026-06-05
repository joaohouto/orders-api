import { z } from "zod";

export const bulkCreateMembershipsSchema = z.object({
  planId: z.string().min(1, "Selecione um plano"),
  paymentDate: z.coerce.date({ message: "Data de pagamento inválida" }),
  emails: z
    .array(z.string().email())
    .min(1, "Informe ao menos um e-mail")
    .max(500, "Máximo de 500 e-mails por vez"),
});

export type BulkCreateMembershipsInput = z.infer<typeof bulkCreateMembershipsSchema>;
