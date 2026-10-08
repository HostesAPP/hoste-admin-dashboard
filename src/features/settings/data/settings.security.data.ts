import type {
  SecurityControlGroup,
  SecuritySettingsSnapshot,
} from "../settings.security.types";

export const SECURITY_CONTROL_GROUPS: SecurityControlGroup[] = [
  {
    id: "authentication",
    title: "Authentication Security",
    fields: [
      {
        name: "twoFactorEnabled",
        label: "Two-Factor Authentication (2FA)",
        description:
          "Require an additional verification step when administrators sign in.",
        required: true,
      },
      {
        name: "requireAllAdmins",
        label: "Require 2FA for All Admins",
        description: "Mandatory 2FA setup for standard administrative staff.",
        required: true,
      },
      {
        name: "requireSuperAdmins",
        label: "Require 2FA for Super Admins",
        description:
          "Enforce a second verification step for super administrator access.",
        required: true,
      },
      {
        name: "requireEmailVerification",
        label: "Require Email Verification for New Accounts",
        description:
          "New administrator accounts must verify their email before first login.",
      },
    ],
  },
  {
    id: "password",
    title: "Password Policy",
    fields: [
      { name: "requireUppercase", label: "Require Uppercase Letter" },
      { name: "requireLowercase", label: "Require Lowercase Letter" },
      { name: "requireNumber", label: "Require Number" },
      { name: "requireSpecial", label: "Require Special Character (@#$%^&*)" },
      { name: "preventPasswordReuse", label: "Prevent Password Reuse" },
    ],
  },
  {
    id: "login",
    title: "Login Protection",
    fields: [
      { name: "accountLockout", label: "Account Lockout" },
      {
        name: "progressiveLockout",
        label: "Progressive Lockout",
        description: "Increase lockout time on consecutive failures.",
      },
      {
        name: "notifyFailedLogins",
        label: "Notify Admin After Repeated Failed Login Attempts",
      },
      {
        name: "blockSuspiciousLogins",
        label: "Block Suspicious Login Attempts",
      },
      {
        name: "verifySuspiciousLogins",
        label: "Require Verification After Suspicious Login",
      },
    ],
  },
  {
    id: "session",
    title: "Session Security",
    fields: [
      { name: "rememberMe", label: 'Allow "Remember Me"' },
      {
        name: "signOutInactive",
        label: "Automatically Sign Out Inactive Users",
      },
      {
        name: "reauthSensitive",
        label: "Require Re-authentication for Sensitive Actions",
        description:
          "Verify identity before changing permissions, payments, or security settings.",
      },
    ],
  },
  {
    id: "accounts",
    title: "Admin & Account Protection",
    fields: [
      { name: "selfServiceReset", label: "Allow Self-Service Password Reset" },
      {
        name: "notifyCredentialChanges",
        label: "Notify Users After Password or Email Changes",
      },
      {
        name: "blockCompromisedPasswords",
        label: "Block Previously Compromised Passwords (HaveIBeenPwned API)",
      },
      {
        name: "authorizedAccountsOnly",
        label: "Restrict Admin Dashboard to Authorized Accounts Only",
      },
      {
        name: "trustedDevicesOnly",
        label: "Allow Access From Trusted Devices Only",
      },
      {
        name: "reauthRoleChanges",
        label: "Require Re-authentication for Role & Permission Changes",
      },
      {
        name: "reauthFinancialSettings",
        label: "Require Re-authentication for Financial Settings",
      },
    ],
  },
];
const INITIAL_SECURITY_SETTINGS: Omit<SecuritySettingsSnapshot, "defaults"> = {
  canManage: true,
  stats: [
    {
      label: "Security Status",
      value: "Protected",
      detail: "",
      tone: "secondary",
    },
    {
      label: "2FA Enforced",
      value: "Enabled",
      detail: "100% Admins",
      tone: "secondary",
    },
    {
      label: "Active Sessions",
      value: "14",
      detail: "across 8 users",
      tone: "neutral",
    },
    {
      label: "Failed Logins (24h)",
      value: "3",
      detail: "↓ 50% vs avg",
      tone: "secondary",
    },
    { label: "Locked Accounts", value: "0", detail: "Normal", tone: "neutral" },
    {
      label: "Security Alerts",
      value: "1",
      detail: "Requires Review",
      tone: "primary",
    },
  ],
  settings: {
    twoFactorEnabled: true,
    requireAllAdmins: true,
    requireSuperAdmins: true,
    requireEmailVerification: true,
    minimumPasswordLength: 12,
    requireUppercase: true,
    requireLowercase: true,
    requireNumber: true,
    requireSpecial: true,
    passwordExpiryDays: 90,
    preventPasswordReuse: true,
    passwordHistory: 5,
    maximumFailedLogins: 5,
    accountLockout: true,
    lockoutMinutes: 30,
    progressiveLockout: true,
    notifyFailedLogins: true,
    blockSuspiciousLogins: true,
    verifySuspiciousLogins: true,
    sessionTimeoutMinutes: 60,
    rememberMe: false,
    maxActiveSessions: 3,
    signOutInactive: true,
    reauthSensitive: true,
    selfServiceReset: true,
    notifyCredentialChanges: true,
    blockCompromisedPasswords: true,
    authorizedAccountsOnly: true,
    trustedDevicesOnly: true,
    reauthRoleChanges: true,
    reauthFinancialSettings: true,
    ipRestrictions: { enabled: false, allowedAddresses: ["192.168.1.0/24"] },
    twoFactor: { method: "TOTP", graceDays: 3 },
    notifications: [
      {
        id: "suspicious",
        label: "Suspicious Login Detected",
        email: true,
        push: true,
      },
      {
        id: "failed-logins",
        label: "Multiple Failed Login Attempts",
        email: true,
        push: true,
      },
      {
        id: "admin-created",
        label: "New Admin Account Created",
        email: true,
        push: false,
      },
      {
        id: "role-changed",
        label: "Admin Role / Permissions Changed",
        email: true,
        push: true,
      },
      {
        id: "credentials-changed",
        label: "Password or Email Changed",
        email: true,
        push: true,
      },
      { id: "lockout", label: "Account Locked Out", email: true, push: true },
    ],
  },
  sessions: [
    {
      id: "session-current",
      device: "MacBook Pro (Chrome)",
      ip: "192.168.1.45",
      location: "Enugu, NG",
      status: "Current",
    },
    {
      id: "session-dell",
      device: "Dell XPS (Firefox)",
      ip: "102.89.22.11",
      location: "Lagos, NG",
      status: "Active",
    },
    {
      id: "session-iphone",
      device: "iPhone 15 (Safari)",
      ip: "102.89.33.4",
      location: "Enugu, NG",
      status: "Idle",
    },
  ],
  activity: [
    {
      id: "security-1",
      event: "Successful Login",
      detail: "10 mins ago · 192.168.1.45",
      user: "Chikwado N.",
      status: "Successful",
    },
    {
      id: "security-2",
      event: "Failed Login Attempt",
      detail: "1 hour ago · 185.220.101.4",
      user: "admin_test",
      status: "Failed",
    },
    {
      id: "security-3",
      event: "2FA Enabled",
      detail: "2 hours ago · 102.89.22.11",
      user: "Sarah K.",
      status: "Successful",
    },
    {
      id: "security-4",
      event: "Admin Role Changed",
      detail: "5 hours ago · 192.168.1.45",
      user: "Chikwado N.",
      status: "Successful",
    },
    {
      id: "security-5",
      event: "Session Revoked",
      detail: "1 day ago · 192.168.1.45",
      user: "Chikwado N.",
      status: "Revoked",
    },
  ],
};
export const MOCK_SECURITY_SETTINGS: SecuritySettingsSnapshot = {
  ...INITIAL_SECURITY_SETTINGS,
  defaults: structuredClone(INITIAL_SECURITY_SETTINGS.settings),
};
