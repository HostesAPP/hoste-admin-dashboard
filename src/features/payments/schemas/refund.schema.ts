import { z } from "zod";
export function createRefundSchema(
  availableAmount: number,
  reasons: readonly string[],
) {
  return z.object({
    amount: z
      .string()
      .trim()
      .regex(
        /^\d+(?:\.\d{1,2})?$/,
        "Enter an amount with up to two decimal places.",
      )
      .refine(
        (value) => Number(value) > 0,
        "Enter an amount greater than zero.",
      )
      .refine(
        (value) => Number(value) <= availableAmount,
        "Amount exceeds the available refund balance.",
      ),
    reason: z
      .string()
      .refine((value) => reasons.includes(value), "Select a refund reason."),
    description: z.string().max(250, "Use 250 characters or fewer."),
    destination: z.literal("Original Payment Method"),
  });
}
