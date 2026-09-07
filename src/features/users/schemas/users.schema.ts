import { z } from "zod";

export const userFilterSchema = z.object({
  tab: z.enum(["ALL", "HOSTES", "CUSTOMERS", "ADMINS"]),
  search: z.string(),
  filter: z.string(),
  dateJoined: z.string(),
  status: z.string(),
  role: z.string(),
  page: z.number().int().min(1),
  pageSize: z.number().int().min(1).max(50),
});

export type UserFilterFormValues = z.infer<typeof userFilterSchema>;

export const exportUsersSchema = z.object({
  scope: z.enum(["all", "filtered"]),
  format: z.enum(["csv", "xlsx", "pdf", "json"]),
});

export type ExportUsersFormValues = z.infer<typeof exportUsersSchema>;

export const inviteAdminSchema = z.object({
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Please enter a valid email address"),
  phoneNumber: z.string().optional(),
  role: z.string().min(1, "Please select an admin role"),
  permissions: z.array(z.string()),
  message: z.string().optional(),
});

export type InviteAdminFormValues = z.infer<typeof inviteAdminSchema>;
