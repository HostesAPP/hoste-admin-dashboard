// src/lib/permissions.ts

import { useAuthStore } from "@/features/auth/auth.store";

export type StaffRole =
  | "SUPER_ADMIN"
  | "OPS"
  | "FINANCE"
  | "SUPPORT"
  | "MODERATOR";

export type PermissionLevel = "NONE" | "VIEW" | "FULL";

export type ModuleArea =
  | "overview"
  | "profiles"
  | "bookings"
  | "payouts"
  | "users"
  | "circle"
  | "referrals"
  | "notifications"
  | "reports"
  | "settings";

/**
 * Hosté Admin Role-Based Access Control (RBAC) Matrix
 * Defines what each staff role can access and perform across platform areas.
 */
export const ROLE_PERMISSIONS: Record<
  ModuleArea,
  Record<StaffRole, PermissionLevel>
> = {
  overview: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "FULL",
    SUPPORT: "VIEW",
    MODERATOR: "VIEW",
  },
  profiles: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "NONE",
    SUPPORT: "VIEW",
    MODERATOR: "FULL",
  },
  bookings: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "VIEW",
    SUPPORT: "VIEW",
    MODERATOR: "NONE",
  },
  payouts: {
    SUPER_ADMIN: "FULL",
    OPS: "VIEW",
    FINANCE: "FULL",
    SUPPORT: "NONE",
    MODERATOR: "NONE",
  },
  users: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "NONE",
    SUPPORT: "NONE",
    MODERATOR: "FULL",
  },
  circle: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "VIEW",
    SUPPORT: "VIEW",
    MODERATOR: "NONE",
  },
  referrals: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "NONE",
    SUPPORT: "NONE",
    MODERATOR: "NONE",
  },
  notifications: {
    SUPER_ADMIN: "FULL",
    OPS: "FULL",
    FINANCE: "NONE",
    SUPPORT: "VIEW",
    MODERATOR: "NONE",
  },
  reports: {
    SUPER_ADMIN: "FULL",
    OPS: "VIEW",
    FINANCE: "VIEW",
    SUPPORT: "FULL",
    MODERATOR: "FULL",
  },
  settings: {
    SUPER_ADMIN: "FULL",
    OPS: "NONE",
    FINANCE: "NONE",
    SUPPORT: "NONE",
    MODERATOR: "NONE",
  },
};

/**
 * Normalizes any incoming role or staffRole string to a canonical StaffRole
 */
export function normalizeStaffRole(
  roleOrStaffRole?: string | null
): StaffRole {
  if (!roleOrStaffRole) return "SUPER_ADMIN";
  const clean = roleOrStaffRole.trim().toUpperCase().replace(/[\s-]+/g, "_");

  if (clean.includes("SUPER") || clean === "SUPER_ADMIN") return "SUPER_ADMIN";
  if (
    clean.includes("OPERATION") ||
    clean.includes("OPS") ||
    clean === "OPERATIONS"
  )
    return "OPS";
  if (clean.includes("FINANCE") || clean.includes("FINANCIAL")) return "FINANCE";
  if (clean.includes("SUPPORT") || clean.includes("CUSTOMER_SUPPORT"))
    return "SUPPORT";
  if (clean.includes("MODERAT") || clean === "MODERATOR") return "MODERATOR";

  // If assigned role is plain STAFF or ADMIN with no staffRole, default to SUPER_ADMIN
  if (clean === "ADMIN" || clean === "STAFF") return "SUPER_ADMIN";

  return "SUPER_ADMIN";
}

/**
 * Returns the permission level for a given role and area
 */
export function getPermission(
  roleOrStaffRole?: string | null,
  area: ModuleArea = "overview"
): PermissionLevel {
  const staffRole = normalizeStaffRole(roleOrStaffRole);
  return ROLE_PERMISSIONS[area]?.[staffRole] ?? "NONE";
}

/**
 * Checks if the role can at least view the area
 */
export function canView(
  roleOrStaffRole?: string | null,
  area: ModuleArea = "overview"
): boolean {
  const level = getPermission(roleOrStaffRole, area);
  return level === "VIEW" || level === "FULL";
}

/**
 * Checks if the role has full management capabilities in the area
 */
export function canManage(
  roleOrStaffRole?: string | null,
  area: ModuleArea = "overview"
): boolean {
  const level = getPermission(roleOrStaffRole, area);
  return level === "FULL";
}

/**
 * React Hook to check the current authenticated staff member's permissions
 */
export function usePermission(area: ModuleArea) {
  const user = useAuthStore((state) => state.user);
  const staffRole = user?.staffRole || user?.role;
  const permission = getPermission(staffRole, area);

  return {
    permission,
    canView: permission === "VIEW" || permission === "FULL",
    canManage: permission === "FULL",
    isNone: permission === "NONE",
    staffRole: normalizeStaffRole(staffRole),
  };
}

