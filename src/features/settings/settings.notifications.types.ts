import type { z } from "zod";
import type {
  notificationChannelSchema,
  notificationProviderSchema,
  notificationSettingsSchema,
  notificationTemplateSchema,
  notificationEmailSchema,
} from "./schemas/settings.notifications.schema";

// Settings screen models; production contracts are mapped at the adapter boundary.
export type NotificationSettings = z.infer<typeof notificationSettingsSchema>;
export type NotificationChannel = z.infer<typeof notificationChannelSchema>;
export type NotificationProvider = z.infer<typeof notificationProviderSchema>;
export type NotificationEmailConfiguration = z.infer<
  typeof notificationEmailSchema
>;
export type NotificationTemplate = z.infer<typeof notificationTemplateSchema>;
export type NotificationSettingsSnapshot = {
  canManage: boolean;
  settings: NotificationSettings;
  defaults: NotificationSettings;
  stats: {
    label: string;
    value: string;
    detail?: string;
    tone?: "secondary" | "destructive" | "warning";
  }[];
  channels: {
    id: NotificationChannel;
    label: string;
    description: string;
    status: string;
  }[];
  templateSummaries: {
    channel: NotificationChannel;
    label: string;
    summary: string;
  }[];
  activity: {
    id: string;
    notification: string;
    recipient: string;
    channel: string;
    date: string;
    status: "Delivered" | "Sent" | "Failed";
  }[];
};
export type NotificationSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<NotificationSettingsSnapshot>;
  save: (
    settings: NotificationSettings,
  ) => Promise<NotificationSettingsSnapshot>;
  testEmail: (configuration: NotificationEmailConfiguration) => Promise<string>;
};
