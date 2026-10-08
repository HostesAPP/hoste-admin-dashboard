import { z } from "zod";
import { MOCK_SYSTEM_SETTINGS } from "./data/settings.system.data";
import {
  systemMaintenancePlanSchema,
  systemSettingsSchema,
} from "./schemas/settings.system.schema";
import type {
  SystemSettingsAdapter,
  SystemSettingsSnapshot,
} from "./settings.system.types";

export function createMockSystemSettingsAdapter(
  initial: SystemSettingsSnapshot = MOCK_SYSTEM_SETTINGS,
): SystemSettingsAdapter {
  let snapshot = structuredClone(initial);
  const authorize = () => {
    if (!snapshot.canManage)
      throw new Error("You do not have permission to manage system settings.");
  };
  return {
    cacheKey: "system-settings-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      authorize();
      snapshot = {
        ...snapshot,
        settings: structuredClone(systemSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
    async operate(operation) {
      authorize();
      if (
        operation.type === "RESTORE_BACKUP" &&
        !snapshot.backups.some((backup) => backup.id === operation.backupId)
      )
        throw new Error("The selected backup is no longer available.");
      if (operation.type === "SCHEDULE_MAINTENANCE") {
        systemMaintenancePlanSchema.parse(operation.plan);
        if (!operation.plan.enabled)
          throw new Error(
            "Enable scheduled maintenance before scheduling a window.",
          );
      }
      if (operation.type === "TEST_EMAIL")
        z.object({
          senderEmail: z.string().email(),
          replyTo: z.string().email(),
        }).parse(operation);
      const messages = {
        CLEAR_CACHE: "Preview action complete. No real cache was cleared.",
        CREATE_BACKUP: "Preview action complete. No real backup was created.",
        RESTORE_BACKUP:
          "Preview action complete. No platform data was restored.",
        TEST_EMAIL: "Preview check complete. No email was sent.",
        SCHEDULE_MAINTENANCE:
          "Preview action complete. No maintenance window was scheduled.",
      };
      return { message: messages[operation.type] };
    },
  };
}
export const mockSystemSettingsAdapter = createMockSystemSettingsAdapter();
