// features/users/api/users.api.ts

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import { formatDate } from "@/lib/utils";
import type {
  User,
  UserFilterParams,
  UserStats,
  UserResponseDto,
  UsersStatsResponse,
  UsersQueryResponse,
  UserStatus,
  UserType,
} from "../types/users.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Format relative timestamp for lastActive
 */
function formatRelativeTime(dateStr?: string | null): string {
  if (!dateStr) return "Never";
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
}

/**
 * Normalizes backend User DTO to UI User model
 */
export function normalizeUserFromBackend(
  raw: Record<string, unknown> | UserResponseDto
): User {
  const id = String(raw.id || "");
  const email = String(raw.email || "");
  const phoneNumber = raw.phoneNumber ? String(raw.phoneNumber) : undefined;

  // Name resolution
  const staff = raw.staff as UserResponseDto["staff"];
  const profiles = (raw.profiles as UserResponseDto["profiles"]) || [];
  let name = email.split("@")[0] || "User";
  if (staff && (staff.firstName || staff.lastName)) {
    name = `${staff.firstName || ""} ${staff.lastName || ""}`.trim();
  } else if (profiles.length > 0 && profiles[0].displayName) {
    name = profiles[0].displayName;
  }

  // Category & Type resolution
  const categoryUpper = String(raw.category || "CUSTOMER").toUpperCase();
  let type: UserType = "Customer";
  if (categoryUpper === "HOST") {
    type = "Hosté";
  } else if (categoryUpper === "STAFF") {
    type = "Staff";
  }

  // Role subtitle
  let roleSubtitle: string | undefined = undefined;
  if (staff?.staffRole) {
    roleSubtitle = staff.staffRole;
  } else if (profiles.length > 0) {
    const types = profiles.map((p) =>
      p.profileType === "HOST"
        ? "Event Host"
        : p.profileType === "BRAND"
        ? "Brand"
        : "Event Planner"
    );
    roleSubtitle = Array.from(new Set(types)).join(" • ");
  }

  // Status resolution
  const rawStatus = String(raw.accountStatus || "ACTIVE").toUpperCase();
  const status: UserStatus =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "SUSPENDED"
      ? "Suspended"
      : "Deleted";

  const userCode = `USR-${id.slice(0, 8).toUpperCase()}`;
  const createdAt = String(raw.createdAt || new Date().toISOString());
  const lastLoginAt = raw.lastLoginAt ? String(raw.lastLoginAt) : null;

  return {
    id,
    userCode,
    name,
    fullName: name,
    email,
    phoneNumber,
    type,
    roleSubtitle,
    role: raw.role === "STAFF" ? "Staff" : "User",
    accountStatus: status,
    status,
    emailVerified: Boolean(raw.emailVerified),
    phoneVerified: Boolean(raw.phoneVerified),
    dateJoined: formatDate(createdAt),
    lastActive: formatRelativeTime(lastLoginAt),
    lastLoginAt,
    createdAt,
    updatedAt: (raw as Record<string, unknown>).updatedAt
      ? String((raw as Record<string, unknown>).updatedAt)
      : createdAt,
    security: {
      emailVerified: Boolean(raw.emailVerified),
      phoneVerified: Boolean(raw.phoneVerified),
      twoFactorEnabled: false,
      lastLogin: lastLoginAt ? formatDate(lastLoginAt) : "Never",
      lastLoginDevice: "Web Browser",
      lastLoginLocation: "Nigeria",
    },
    permissions: [
      { id: "perm-1", name: "Manage Bookings", granted: true },
      { id: "perm-2", name: "Process Payouts", granted: false },
      { id: "perm-3", name: "Review Applications", granted: categoryUpper === "STAFF" },
    ],
    adminActivity: {
      profilesReviewed: 0,
      usersManaged: 0,
      bookingsManaged: 0,
      reportsGenerated: 0,
    },
    recentActivities: [],
  };
}

/**
 * Builds URL query params from UserFilterParams
 */
function buildUserQueryParams(params: UserFilterParams = {}): URLSearchParams {
  const queryParams = new URLSearchParams();

  // Pagination (skip & take)
  const pageSize = params.pageSize || 10;
  const page = params.page || 1;
  const skip = params.skip !== undefined ? params.skip : (page - 1) * pageSize;
  const take = params.take !== undefined ? params.take : pageSize;

  queryParams.set("skip", String(skip));
  queryParams.set("take", String(take));

  // Search
  if (params.search?.trim()) {
    queryParams.set("search", params.search.trim());
  }

  // Category tab mapping
  if (params.tab && params.tab !== "ALL") {
    if (params.tab === "HOSTES") queryParams.set("category", "HOST");
    else if (params.tab === "CUSTOMERS") queryParams.set("category", "CUSTOMER");
    else if (params.tab === "ADMINS") queryParams.set("category", "STAFF");
  }

  // Account status mapping
  if (params.status && params.status !== "all" && params.status !== "") {
    const s = params.status.toUpperCase();
    if (s === "ACTIVE" || s === "SUSPENDED" || s === "DELETED") {
      queryParams.set("accountStatus", s);
    }
  }

  // Date filters
  if (params.dateFrom) {
    queryParams.set("dateFrom", params.dateFrom);
  }
  if (params.dateTo) {
    queryParams.set("dateTo", params.dateTo);
  } else if (params.dateJoined) {
    const now = new Date();
    const todayStr = now.toISOString().split("T")[0];
    if (params.dateJoined === "7d") {
      const past = new Date(Date.now() - 7 * 86400000);
      queryParams.set("dateFrom", past.toISOString().split("T")[0]);
      queryParams.set("dateTo", todayStr);
    } else if (params.dateJoined === "30d") {
      const past = new Date(Date.now() - 30 * 86400000);
      queryParams.set("dateFrom", past.toISOString().split("T")[0]);
      queryParams.set("dateTo", todayStr);
    } else if (params.dateJoined === "year") {
      const startOfYear = `${now.getFullYear()}-01-01`;
      queryParams.set("dateFrom", startOfYear);
      queryParams.set("dateTo", todayStr);
    }
  }

  return queryParams;
}

/**
 * 1. List Users Directory
 * Method: GET /api/v1/users
 * Access: Staff Only
 */
export async function fetchUsers(
  params: UserFilterParams = {}
): Promise<UsersQueryResponse> {
  const queryParams = buildUserQueryParams(params);
  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";

  const response = await apiClient<Record<string, unknown>>(
    `/users${queryString}`,
    {
      method: "GET",
    }
  );

  // LOG THE RESPONSE per user instruction
  console.log("[Users API] GET /api/v1/users response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const rawItems = Array.isArray(dataObj?.items)
    ? (dataObj.items as Record<string, unknown>[])
    : Array.isArray(response?.data)
    ? (response.data as Record<string, unknown>[])
    : Array.isArray(response)
    ? (response as Record<string, unknown>[])
    : [];

  const total =
    typeof dataObj?.total === "number"
      ? dataObj.total
      : typeof response?.total === "number"
      ? response.total
      : rawItems.length;

  const pageSize = params.pageSize || 10;
  const page = params.page || 1;
  const skip = typeof dataObj?.skip === "number" ? dataObj.skip : (page - 1) * pageSize;
  const take = typeof dataObj?.take === "number" ? dataObj.take : pageSize;
  const totalPages = Math.max(1, Math.ceil(total / take));

  const users = rawItems.map((item) => normalizeUserFromBackend(item));

  // Placeholder stats fallback; real stats are fetched via fetchUserStats
  const stats: UserStats = {
    totalUsers: { count: total, growthPercent: 0, growthPeriod: "total" },
    hostes: { count: 0, subtitle: "Active event pros" },
    customers: { count: 0, subtitle: "Registered clients" },
    adminsAndStaff: { count: 0, subtitle: "Platform staff" },
  };

  return {
    users,
    totalCount: total,
    stats,
    page: Math.floor(skip / take) + 1,
    pageSize: take,
    totalPages,
    skip,
    take,
  };
}

/**
 * 2. User Stats & Tab Counts
 * Method: GET /api/v1/users/stats
 * Access: Staff Only
 */
export async function fetchUserStats(
  params: Partial<UserFilterParams> = {}
): Promise<UsersStatsResponse> {
  const queryParams = new URLSearchParams();

  if (params.search?.trim()) queryParams.set("search", params.search.trim());
  if (params.dateFrom) queryParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) queryParams.set("dateTo", params.dateTo);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(
    `/users/stats${queryString}`,
    {
      method: "GET",
    }
  );

  // LOG THE RESPONSE per user instruction
  console.log("[Users API] GET /api/v1/users/stats response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const byCategory = (dataObj?.byCategory as Record<string, unknown>) || {};
  const byAccountStatus = (dataObj?.byAccountStatus as Record<string, unknown>) || {};

  return {
    total: Number(dataObj?.total || 0),
    byCategory: {
      STAFF: Number(byCategory.STAFF || 0),
      HOST: Number(byCategory.HOST || 0),
      CUSTOMER: Number(byCategory.CUSTOMER || 0),
    },
    byAccountStatus: {
      ACTIVE: Number(byAccountStatus.ACTIVE || 0),
      SUSPENDED: Number(byAccountStatus.SUSPENDED || 0),
      DELETED: Number(byAccountStatus.DELETED || 0),
    },
  };
}

/**
 * 3. Export Users (CSV)
 * Method: GET /api/v1/users/export
 * Access: Staff Only
 */
export async function exportUsersCsv(
  params: Partial<UserFilterParams> = {}
): Promise<{ truncated: boolean; filename: string }> {
  const queryParams = new URLSearchParams();

  if (params.search?.trim()) queryParams.set("search", params.search.trim());

  if (params.tab && params.tab !== "ALL") {
    if (params.tab === "HOSTES") queryParams.set("category", "HOST");
    else if (params.tab === "CUSTOMERS") queryParams.set("category", "CUSTOMER");
    else if (params.tab === "ADMINS") queryParams.set("category", "STAFF");
  }

  if (params.status && params.status !== "all" && params.status !== "") {
    const s = params.status.toUpperCase();
    if (s === "ACTIVE" || s === "SUSPENDED" || s === "DELETED") {
      queryParams.set("accountStatus", s);
    }
  }

  if (params.dateFrom) queryParams.set("dateFrom", params.dateFrom);
  if (params.dateTo) queryParams.set("dateTo", params.dateTo);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const accessToken = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_URL}/users/export${queryString}`, {
    method: "GET",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  const isTruncated = response.headers.get("X-Export-Truncated") === "true";
  const disposition = response.headers.get("Content-Disposition");
  let filename = `users-${new Date().toISOString().split("T")[0]}.csv`;
  if (disposition && disposition.includes("filename=")) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  // LOG THE RESPONSE per user instruction
  console.log("[Users API] GET /api/v1/users/export response:", {
    status: response.status,
    ok: response.ok,
    isTruncated,
    filename,
  });

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);

  return { truncated: isTruncated, filename };
}

/**
 * 4. Fetch User by ID
 * Method: GET /api/v1/users/:id
 * Access: Staff Only
 * Falls back to search if single-user endpoint is not defined on backend.
 */
export async function fetchUserById(id: string): Promise<User | null> {
  const cleanId = id.trim();
  if (!cleanId) return null;

  try {
    const res = await apiClient<Record<string, unknown>>(`/users/${cleanId}`, {
      method: "GET",
    });

    console.log("[Users API] GET /api/v1/users/:id response:", res);
    const dataObj =
      res?.data && typeof res.data === "object" && !Array.isArray(res.data)
        ? (res.data as Record<string, unknown>)
        : res;

    return normalizeUserFromBackend(dataObj);
  } catch (err) {
    console.warn(
      `[Users API] GET /users/${cleanId} failed, falling back to query:`,
      err
    );
    try {
      const searchRes = await fetchUsers({ search: cleanId, take: 5 });
      console.log("[Users API] Fallback search response:", searchRes);
      const match =
        searchRes.users.find(
          (u) =>
            u.id.toLowerCase() === cleanId.toLowerCase() ||
            u.userCode.toLowerCase() === cleanId.toLowerCase()
        ) || searchRes.users[0];
      return match || null;
    } catch {
      return null;
    }
  }
}

