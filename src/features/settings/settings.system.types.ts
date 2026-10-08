import type { z } from "zod";
import type {
  systemSettingsSchema,
  systemMaintenancePlanSchema,
} from "./schemas/settings.system.schema";

export type SystemSettings = z.infer<typeof systemSettingsSchema>;
export type SystemMaintenancePlan = z.infer<typeof systemMaintenancePlanSchema>;
export type SystemBackup = {
  id: string;
  date: string;
  size: string;
  type: string;
  status: string;
};
export type SystemSettingsSnapshot = {
  canManage: boolean;
  settings: SystemSettings;
  stats: { label: string; value: string; detail: string }[];
  integrations: {
    id: string;
    label: string;
    description: string;
    status: string;
    tone: "primary" | "secondary" | "neutral";
  }[];
  backups: SystemBackup[];
  storage: { label: string; status: string }[];
  logSummary: { label: string; value: string; tone: "secondary" | "primary" }[];
  health: { label: string; value: string; healthy?: boolean }[];
};
export type SystemOperation =
  | { type: "CLEAR_CACHE" | "CREATE_BACKUP" }
  | { type: "RESTORE_BACKUP"; backupId: string }
  | { type: "TEST_EMAIL"; senderEmail: string; replyTo: string }
  | { type: "SCHEDULE_MAINTENANCE"; plan: SystemMaintenancePlan };
export type SystemSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<SystemSettingsSnapshot>;
  save: (settings: SystemSettings) => Promise<SystemSettingsSnapshot>;
  operate: (operation: SystemOperation) => Promise<{ message: string }>;
};
