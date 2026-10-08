import { z } from "zod";

export const systemMaintenancePlanSchema = z
  .object({
    enabled: z.boolean(),
    startUtc: z.iso.datetime({ local: true }),
    endUtc: z.iso.datetime({ local: true }),
    notifyUsers: z.boolean(),
    leadHours: z.number().int().min(0),
  })
  .refine(
    (plan) =>
      !plan.enabled ||
      Date.parse(plan.endUtc.endsWith("Z") ? plan.endUtc : `${plan.endUtc}Z`) >
        Date.parse(
          plan.startUtc.endsWith("Z") ? plan.startUtc : `${plan.startUtc}Z`,
        ),
    { path: ["endUtc"], message: "End time must be after the start time." },
  );
export const systemSettingsSchema = z.object({
  maintenanceMode: z.boolean(),
  maintenanceMessage: z.string().trim().min(1, "Enter a maintenance message."),
  estimatedMaintenanceHours: z.number().min(0),
  allowAdminAccess: z.boolean(),
  platformName: z.string().trim().min(1, "Enter a platform name."),
  platformUrl: z.string().url("Enter a valid URL."),
  timezone: z.string().min(1),
  currency: z.literal("NGN"),
  dateFormat: z.enum(["DD/MM/YYYY", "MM/DD/YYYY", "YYYY-MM-DD"]),
  timeFormat: z.enum(["12_HOUR", "24_HOUR"]),
  language: z.string(),
  country: z.string(),
  redisCaching: z.boolean(),
  cacheRefreshHours: z.number().int().min(1),
  backgroundProcessing: z.boolean(),
  healthMonitoring: z.boolean(),
  senderName: z.string().trim().min(1, "Enter a sender name."),
  senderEmail: z.string().email("Enter a valid sender email."),
  replyTo: z.string().email("Enter a valid reply-to email."),
  automaticBackup: z.boolean(),
  backupFrequency: z.enum(["DAILY_0200", "WEEKLY", "MANUAL"]),
  backupRetentionDays: z.number().int().min(1),
  maintenancePlan: systemMaintenancePlanSchema,
  modules: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      description: z.string(),
      enabled: z.boolean(),
    }),
  ),
});
