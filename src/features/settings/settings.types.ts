export interface PlatformSettings {
  currency: string;
  currencySymbol: string;
  timezone: string;
  platformFeePercent: number;
  maintenanceMode: boolean;
  allowNewRegistrations: boolean;
  requireTwoFactorForAdmins: boolean;
  emailNotificationsEnabled: boolean;
  pushNotificationsEnabled: boolean;
  smsNotificationsEnabled: boolean;
  autoApproveVerifiedProfiles: boolean;
}

export interface SettingsCategory {
  id:
    | "general"
    | "access"
    | "hoste"
    | "bookings"
    | "payments"
    | "notifications"
    | "content"
    | "security"
    | "system";
  title: string;
  description: string;
  items: string[];
  summary: string;
  tone: "primary" | "secondary";
  href: string;
}
