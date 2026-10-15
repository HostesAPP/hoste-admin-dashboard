import { string, z } from "zod";

export const paymentFilterSchema = z.object({
  search: z.string(),
  date: z.enum(["LAST_30_DAYS", "LAST_7_DAYS", "TODAY"]),
  status: z.enum(["ALL", "SUCCESSFUL", "PENDING", "FAILED"]),
  method: z.enum(["ALL", "BANK_TRANSFER", "CREDIT_CARD", "PAYPAL"]),
});

export type PaymentFilterSchema = z.infer<typeof paymentFilterSchema>;
