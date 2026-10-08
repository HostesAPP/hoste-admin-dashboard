import { z } from "zod";
import { ACCESS_ACTIONS, ACCESS_SECTIONS } from "../settings.access.types";

export const accessPermissionsSchema = z.record(
  z.enum(ACCESS_SECTIONS),
  z.array(z.enum(ACCESS_ACTIONS)),
);
export const addAccessAdminSchema = z.object({
  name: z.string().trim().min(2, "Full name is required"),
  email: z.string().trim().email("Please enter a valid email address"),
  roleId: z.string().min(1, "Select a role"),
});
export const createAccessAdminSchema = addAccessAdminSchema
  .extend({
    temporaryPassword: z
      .string()
      .min(8, "Use at least 8 characters")
      .regex(/[A-Za-z]/, "Include a letter")
      .regex(/[0-9]/, "Include a number")
      .regex(/[^A-Za-z0-9]/, "Include a symbol"),
    confirmPassword: z.string(),
    permissions: accessPermissionsSchema,
  })
  .refine((values) => values.temporaryPassword === values.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });
export const accessReasonSchema = z.object({
  reason: z.string().trim().min(1, "A reason is required"),
});
export const accessRoleSchema = z.object({
  name: z.string().trim().min(2, "Role name is required"),
  description: z.string().trim().min(1, "Description is required"),
  permissions: accessPermissionsSchema,
});
export type AddAccessAdminValues = z.infer<typeof addAccessAdminSchema>;
export type CreateAccessAdminValues = z.infer<typeof createAccessAdminSchema>;

export const accessSettingsSchema = z.object({
  sessionDuration: z.enum(["1", "2", "4"]),
  maxLoginAttempts: z.number().int().min(1),
  adminOnboarding: z.boolean(),
  idleTimeout: z.enum(["15", "30", "60"]),
  passwordExpiry: z.enum(["30", "60", "90"]),
  twoFactor: z.boolean(),
  trustedDevices: z.boolean(),
  loginAlerts: z.boolean(),
  ipBoundSessions: z.boolean(),
  customers: z.boolean(),
  hosts: z.boolean(),
  brands: z.boolean(),
  planners: z.boolean(),
  emailVerification: z.boolean(),
  accountApproval: z.boolean(),
});
