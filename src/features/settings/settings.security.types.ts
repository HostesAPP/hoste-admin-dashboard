import type { z } from "zod";
import type {
  securitySettingsSchema,
  securityIpSchema,
  securityTwoFactorSchema,
} from "./schemas/settings.security.schema";

export type SecuritySettings = z.infer<typeof securitySettingsSchema>;
export type SecurityIpRestrictions = z.infer<typeof securityIpSchema>;
export type SecurityTwoFactor = z.infer<typeof securityTwoFactorSchema>;
export type SecurityToggleName = {
  [Key in keyof SecuritySettings]: SecuritySettings[Key] extends boolean
    ? Key
    : never;
}[keyof SecuritySettings];
export type SecurityControlGroup = {
  id: string;
  title: string;
  fields: readonly {
    name: SecurityToggleName;
    label: string;
    description?: string;
    required?: boolean;
  }[];
};
export type SecuritySettingsSnapshot = {
  canManage: boolean;
  settings: SecuritySettings;
  defaults: SecuritySettings;
  stats: {
    label: string;
    value: string;
    detail: string;
    tone: "secondary" | "primary" | "neutral";
  }[];
  sessions: {
    id: string;
    device: string;
    ip: string;
    location: string;
    status: "Current" | "Active" | "Idle";
  }[];
  activity: {
    id: string;
    event: string;
    detail: string;
    user: string;
    status: "Successful" | "Failed" | "Revoked";
  }[];
};
export type SecuritySettingsAdapter = {
  cacheKey: string;
  load: () => Promise<SecuritySettingsSnapshot>;
  save: (settings: SecuritySettings) => Promise<SecuritySettingsSnapshot>;
  revokeSession: (id: string) => Promise<SecuritySettingsSnapshot>;
  signOutOthers: () => Promise<SecuritySettingsSnapshot>;
};
