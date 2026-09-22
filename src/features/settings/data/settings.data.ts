import { PlatformSettings } from "../settings.types";

export const DEFAULT_PLATFORM_SETTINGS: PlatformSettings = {
  currency: "NGN",
  currencySymbol: "₦",
  timezone: "Africa/Lagos (WAT, UTC+1)",
  platformFeePercent: 10,
  maintenanceMode: false,
  allowNewRegistrations: true,
  requireTwoFactorForAdmins: true,
  emailNotificationsEnabled: true,
  pushNotificationsEnabled: true,
  smsNotificationsEnabled: false,
  autoApproveVerifiedProfiles: false,
};
