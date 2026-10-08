import { z } from "zod";

export const securityAddressSchema = z.union([
  z.ipv4(),
  z.ipv6(),
  z.cidrv4(),
  z.cidrv6(),
]);
export const securityIpSchema = z
  .object({
    enabled: z.boolean(),
    allowedAddresses: z.array(securityAddressSchema),
  })
  .refine((value) => !value.enabled || value.allowedAddresses.length > 0, {
    path: ["allowedAddresses"],
    message: "Add at least one allowed IP address or CIDR block.",
  });
export const parseSecurityAddresses = (value: string) =>
  value
    .split(/[,\n]/)
    .map((address) => address.trim())
    .filter(Boolean);
export const securityIpEditorSchema = z
  .object({ enabled: z.boolean(), addresses: z.string() })
  .superRefine((value, context) => {
    const result = securityIpSchema.safeParse({
      enabled: value.enabled,
      allowedAddresses: parseSecurityAddresses(value.addresses),
    });
    if (!result.success)
      context.addIssue({
        code: "custom",
        path: ["addresses"],
        message:
          "Enter valid IP addresses or CIDR blocks. An enabled restriction requires at least one address.",
      });
  });
export const securityTwoFactorSchema = z.object({
  method: z.enum(["TOTP", "EMAIL_OTP"]),
  graceDays: z.number().int().min(0),
});
export const securitySettingsSchema = z.object({
  twoFactorEnabled: z.literal(true),
  requireAllAdmins: z.literal(true),
  requireSuperAdmins: z.literal(true),
  requireEmailVerification: z.boolean(),
  minimumPasswordLength: z.number().int().min(1),
  requireUppercase: z.boolean(),
  requireLowercase: z.boolean(),
  requireNumber: z.boolean(),
  requireSpecial: z.boolean(),
  passwordExpiryDays: z.number().int().min(0),
  preventPasswordReuse: z.boolean(),
  passwordHistory: z.number().int().min(1),
  maximumFailedLogins: z.number().int().min(1),
  accountLockout: z.boolean(),
  lockoutMinutes: z.number().int().min(1),
  progressiveLockout: z.boolean(),
  notifyFailedLogins: z.boolean(),
  blockSuspiciousLogins: z.boolean(),
  verifySuspiciousLogins: z.boolean(),
  sessionTimeoutMinutes: z.number().int().min(1),
  rememberMe: z.boolean(),
  maxActiveSessions: z.number().int().min(1),
  signOutInactive: z.boolean(),
  reauthSensitive: z.boolean(),
  selfServiceReset: z.boolean(),
  notifyCredentialChanges: z.boolean(),
  blockCompromisedPasswords: z.boolean(),
  authorizedAccountsOnly: z.boolean(),
  trustedDevicesOnly: z.boolean(),
  reauthRoleChanges: z.boolean(),
  reauthFinancialSettings: z.boolean(),
  ipRestrictions: securityIpSchema,
  twoFactor: securityTwoFactorSchema,
  notifications: z.array(
    z.object({
      id: z.string(),
      label: z.string(),
      email: z.boolean(),
      push: z.boolean(),
    }),
  ),
});
