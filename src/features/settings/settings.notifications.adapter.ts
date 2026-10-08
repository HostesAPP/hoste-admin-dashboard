import { MOCK_NOTIFICATION_SETTINGS } from "./data/settings.notifications.data";
import {
  notificationEmailSchema,
  notificationSettingsSchema,
} from "./schemas/settings.notifications.schema";
import type {
  NotificationSettingsAdapter,
  NotificationSettingsSnapshot,
} from "./settings.notifications.types";

export function createMockNotificationSettingsAdapter(
  initial: NotificationSettingsSnapshot = MOCK_NOTIFICATION_SETTINGS,
): NotificationSettingsAdapter {
  let snapshot = structuredClone(initial);
  return {
    cacheKey: "notification-settings-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      if (!snapshot.canManage)
        throw new Error(
          "You do not have permission to change notification settings.",
        );
      snapshot = {
        ...snapshot,
        channels: snapshot.channels.map((channel) => {
          const previous = snapshot.settings.channels.find(
            (item) => item.id === channel.id,
          )?.configuration;
          const next = settings.channels.find(
            (item) => item.id === channel.id,
          )?.configuration;
          return previous?.provider === next?.provider &&
            previous?.sender === next?.sender &&
            previous?.senderEmail === next?.senderEmail &&
            previous?.replyTo === next?.replyTo
            ? channel
            : { ...channel, status: "Not verified" };
        }),
        settings: structuredClone(notificationSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
    async testEmail(configuration) {
      if (!snapshot.canManage)
        throw new Error(
          "You do not have permission to test notification settings.",
        );
      notificationEmailSchema.parse(configuration);
      return "Preview check complete. No email was sent.";
    },
  };
}
export const mockNotificationSettingsAdapter =
  createMockNotificationSettingsAdapter();
