import { z } from "zod";

export const notificationChannelSchema = z.enum(["EMAIL", "PUSH", "SMS"]);
export const notificationProviderSchema = z.object({
  provider: z.string().trim().min(1, "Enter a provider."),
  sender: z.string().trim().min(1, "Enter a sender name or identifier."),
  senderEmail: z.string().email("Enter a valid sender email.").optional(),
  replyTo: z.string().email("Enter a valid reply-to email.").optional(),
});
export const notificationEmailSchema = notificationProviderSchema.extend({
  senderEmail: z.string().trim().email("Enter a valid sender email."),
  replyTo: z.string().trim().email("Enter a valid reply-to email."),
});
const deliveryPreferencesSchema = z.object({
  email: z.boolean(),
  push: z.boolean(),
  sms: z.boolean(),
});
export const notificationCategorySchema = deliveryPreferencesSchema.extend({
  id: z.string(),
  label: z.string(),
});
export const notificationPreferencesSchema = z.object({
  categories: z.array(notificationCategorySchema),
});
export const notificationTemplateSchema = z.object({
  id: z.string(),
  channel: notificationChannelSchema,
  name: z.string(),
  subject: z.string().trim().min(1, "Enter a template title."),
  body: z.string().trim().min(1, "Enter a template message."),
});
export const notificationSettingsSchema = z.object({
  channels: z.array(
    z.object({
      id: notificationChannelSchema,
      enabled: z.boolean(),
      configuration: notificationProviderSchema,
    }),
  ),
  userPreferences: z.array(
    deliveryPreferencesSchema.extend({
      id: z.string(),
      label: z.string(),
      categories: z.array(notificationCategorySchema),
    }),
  ),
  eventGroups: z.array(
    z.object({
      id: z.string(),
      title: z.string(),
      heading: z.string(),
      events: z.array(
        z.object({
          id: z.string(),
          label: z.string(),
          email: z.boolean(),
          push: z.boolean(),
        }),
      ),
    }),
  ),
  bookingReminderLeadTime: z
    .string()
    .trim()
    .min(1, "Enter a booking reminder schedule."),
  subscriptionReminders: z
    .string()
    .trim()
    .min(1, "Enter a subscription reminder schedule."),
  quietHours: z.boolean(),
  quietStart: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid start time."),
  quietEnd: z
    .string()
    .regex(/^([01]\d|2[0-3]):[0-5]\d$/, "Enter a valid end time."),
  enableNewTypes: z.boolean(),
  allowMarketingOptOut: z.boolean(),
  allowUserPreferences: z.boolean(),
  automaticTransactional: z.boolean(),
  retryFailed: z.boolean(),
  maxRetries: z.number().int().min(0),
  templates: z.array(notificationTemplateSchema),
});
