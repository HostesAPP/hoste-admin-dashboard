import { z } from "zod";

export const financeCommissionSchema = z
  .object({
    id: z.string(),
    name: z.string().trim().min(1, "Enter a rule name."),
    category: z.string().trim().min(1, "Enter a booking or Hoste type."),
    status: z.literal("ACTIVE"),
    type: z.enum(["PERCENTAGE", "FIXED"]),
    value: z.number().min(0),
  })
  .refine((rule) => rule.type !== "PERCENTAGE" || rule.value <= 100, {
    path: ["value"],
    message: "Percentage must be between 0 and 100.",
  });

export const financeSettingsSchema = z
  .object({
    methods: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        description: z.string(),
        enabled: z.boolean(),
      }),
    ),
    escrowEnabled: z.boolean(),
    holdUntilCompletion: z.boolean(),
    disputeHold: z.boolean(),
    releaseCondition: z.enum(["AFTER_COMPLETION", "MANUAL"]),
    holdingDays: z.number().int().min(0).max(365),
    commissions: z.array(financeCommissionSchema),
    defaultCalculation: z.enum(["PERCENTAGE", "FIXED"]),
    payoutsEnabled: z.boolean(),
    payoutSchedule: z.enum(["WEEKLY", "MONTHLY", "MANUAL"]),
    minimumPayout: z.number().min(0),
    processingFee: z.number().min(0),
    verifiedHosteRequired: z.boolean(),
    completedBookingRequired: z.boolean(),
    automaticRefunds: z.boolean(),
    refundApproval: z.enum(["ADMIN", "AUTOMATIC"]),
    refundWindowHours: z.number().int().min(0),
    partialRefunds: z.boolean(),
    cancellationRefunds: z.boolean(),
    currency: z.literal("NGN"),
    minimumTransaction: z.number().min(0),
    maximumTransaction: z.number().min(0),
    verifyPayments: z.boolean(),
    reconcilePayments: z.boolean(),
    recordFailedTransactions: z.boolean(),
    notifications: z.array(
      z.object({
        id: z.string(),
        label: z.string(),
        email: z.boolean(),
        push: z.boolean(),
      }),
    ),
  })
  .refine(
    (settings) => settings.minimumTransaction <= settings.maximumTransaction,
    {
      path: ["maximumTransaction"],
      message: "Maximum must be at least the minimum transaction amount.",
    },
  );

export const financeGatewaySchema = z.object({
  publicKey: z.string().trim().min(1, "Enter a public key."),
  secretKey: z.string(),
  mode: z.enum(["LIVE", "TEST"]),
});
