import { z } from "zod";

const optionalUrl = z.union([
  z.literal(""),
  z
    .string()
    .url("Enter a valid URL")
    .refine((value) => /^https?:\/\//i.test(value), "Use an http or https URL"),
]);
const color = z
  .string()
  .regex(/^#[0-9a-f]{6}$/i, "Enter a six-digit hex color");

export const generalSettingsSchema = z.object({
  platformName: z.string().trim().min(1, "Platform name is required"),
  platformDescription: z
    .string()
    .trim()
    .min(1, "Platform description is required"),
  businessAddress: z.string(),
  supportEmail: z.string().email("Enter a valid support email"),
  supportPhone: z.string(),
  websiteUrl: optionalUrl,
  instagramUrl: optionalUrl,
  facebookUrl: optionalUrl,
  twitterUrl: optionalUrl,
  linkedinUrl: optionalUrl,
  country: z.enum(["NG"]),
  currency: z.enum(["NGN", "USD", "GBP"]),
  timezone: z.enum(["Africa/Lagos"]),
  language: z.enum(["en-GB"]),
  logo: z.string(),
  favicon: z.string(),
  primaryColor: color,
  secondaryColor: color,
  maintenanceMode: z.boolean(),
  allowNewRegistrations: z.boolean(),
});

export type GeneralSettingsValues = z.infer<typeof generalSettingsSchema>;
