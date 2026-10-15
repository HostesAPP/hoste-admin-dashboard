import { z } from "zod";

export const hosteRequirementSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, "Enter a document name."),
  required: z.boolean(),
  enabled: z.boolean(),
});

export const hostePlanSchema = z.object({
  id: z.string(),
  name: z.string().trim().min(2, "Enter a plan name."),
  price: z.number().min(0, "Price cannot be negative."),
  duration: z.enum(["14 Days", "1 Month", "3 Months", "12 Months"]),
  enabled: z.boolean(),
  activeHosts: z.number().int().min(0),
  note: z.string(),
});

export const hosteCommissionSchema = z
  .object({
    id: z.string(),
    category: z.string().trim().min(2),
    type: z.enum(["Percentage (%)", "Fixed Amount (NGN)"]),
    value: z.number().min(0),
    status: z.enum(["Active", "Default"]),
  })
  .refine((rule) => rule.type !== "Percentage (%)" || rule.value <= 100, {
    path: ["value"],
    message: "Percentage cannot exceed 100.",
  });

export const hosteSettingsSchema = z
  .object({
    registrations: z.boolean(),
    approval: z.boolean(),
    identity: z.boolean(),
    autoApprove: z.boolean(),
    badgeFee: z.number().min(0),
    badgeDuration: z.enum(["1 Month", "3 Months", "12 Months"]),
    badgeVerification: z.boolean(),
    badgeRenewal: z.boolean(),
    reviewMethod: z.literal("Manual Review"),
    requirements: z.array(hosteRequirementSchema),
    plans: z.array(hostePlanSchema),
    commissions: z.array(hosteCommissionSchema),
    defaultCommission: z.number().min(0),
    defaultCommissionType: z.enum(["Percentage (%)", "Fixed Amount (NGN)"]),
    deactivate: z.boolean(),
    pause: z.boolean(),
    reactivationApproval: z.boolean(),
    suspendExpired: z.boolean(),
    restrictUnverified: z.boolean(),
    reminders: z.boolean(),
    reminderDays: z.array(z.number().int()),
    notifyHost: z.boolean(),
    notifyAdmin: z.boolean(),
    restrictExpired: z.boolean(),
    customAvailability: z.boolean(),
    requireAvailability: z.boolean(),
    rejectRequests: z.boolean(),
    disputeIntervention: z.boolean(),
  })
  .refine(
    (settings) =>
      settings.defaultCommissionType !== "Percentage (%)" ||
      settings.defaultCommission <= 100,
    {
      path: ["defaultCommission"],
      message: "Percentage cannot exceed 100.",
    },
  );
