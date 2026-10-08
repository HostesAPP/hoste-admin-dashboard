// Screen view models. The API adapter must map the confirmed backend contract.
export const ACCESS_SECTIONS = [
  "Overview",
  "Profiles",
  "Bookings",
  "Payments",
  "Groups",
  "Users",
  "Reports",
  "Notifications",
  "Support Tickets",
  "Settings",
] as const;
export const ACCESS_ACTIONS = [
  "View",
  "Create",
  "Edit",
  "Delete",
  "Manage",
] as const;
export type AccessSection = (typeof ACCESS_SECTIONS)[number];
export type AccessAction = (typeof ACCESS_ACTIONS)[number];
export type AccessPermissions = Record<AccessSection, AccessAction[]>;
export interface AccessRole {
  id: string;
  name: string;
  description: string;
  scope: string[];
  permissions: AccessPermissions;
  system: boolean;
}
export interface AccessAdmin {
  id: string;
  userId?: string;
  name: string;
  email: string;
  roleId: string;
  status: "Active" | "Invited";
  permissions: AccessPermissions;
}
export interface AccessAccount {
  id: string;
  name: string;
  email: string;
  classification: string;
  status: "Active" | "Suspended" | "Blocked" | "Deactivated";
}
export interface AccessActivity {
  id: string;
  name: string;
  type: string;
  activity: string;
  at: string;
  status: "Successful" | "Completed" | "Blocked" | "Failed";
}
export interface AccessPopulation {
  id: "customers" | "hosts" | "brands" | "planners";
  name: string;
  active: number;
  suspended: number;
  badge: string;
  access: string;
  tone: "primary" | "secondary" | "muted";
}
export interface AccessSettings {
  sessionDuration: "1" | "2" | "4";
  maxLoginAttempts: number;
  adminOnboarding: boolean;
  idleTimeout: "15" | "30" | "60";
  passwordExpiry: "30" | "60" | "90";
  twoFactor: boolean;
  trustedDevices: boolean;
  loginAlerts: boolean;
  ipBoundSessions: boolean;
  customers: boolean;
  hosts: boolean;
  brands: boolean;
  planners: boolean;
  emailVerification: boolean;
  accountApproval: boolean;
}
export interface AccessSnapshot {
  canManage: boolean;
  admins: AccessAdmin[];
  roles: AccessRole[];
  settings: AccessSettings;
  populations: AccessPopulation[];
  accounts: AccessAccount[];
  accountTotals: Record<AccessAccount["status"], number>;
  activities: AccessActivity[];
}
export type AccessCommand =
  | { type: "settings"; values: AccessSettings; reason?: string }
  | { type: "invite"; name: string; email: string; roleId: string }
  | {
      type: "create";
      name: string;
      email: string;
      roleId: string;
      temporaryPassword: string;
      permissions: AccessPermissions;
    }
  | { type: "admin-role"; id: string; roleId: string }
  | { type: "permissions"; id: string; permissions: AccessPermissions }
  | { type: "remove-admin"; id: string }
  | { type: "resend-invite"; id: string }
  | { type: "role"; role: AccessRole }
  | {
      type: "account";
      id: string;
      status: "Active" | "Suspended";
      reason?: string;
    };
export interface AccessAdapter {
  cacheKey: string;
  load: () => Promise<AccessSnapshot>;
  execute: (command: AccessCommand) => Promise<AccessSnapshot>;
}
