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
