// features/groups/api/groups.api.ts

import { apiClient } from "@/lib/api-client";
import type {
  Group,
  GroupMember,
  GroupFilterParams,
  GroupMemberFilterParams,
  GroupsListResponse,
  GroupMembersResponse,
  GroupStatsData,
  GroupMemberRole,
  GroupMemberStatus,
} from "../types/groups.types";

export interface GetGroupsApiResponse {
  success?: boolean;
  data?:
    | Group[]
    | {
        groups?: Group[];
        total?: number;
        totalCount?: number;
        totalPages?: number;
        page?: number;
        pageSize?: number;
        limit?: number;
        stats?: GroupStatsData;
      };
  meta?: {
    total?: number;
    totalCount?: number;
    page?: number;
    limit?: number;
    pageSize?: number;
    totalPages?: number;
  };
  groups?: Group[];
  totalCount?: number;
  totalPages?: number;
  page?: number;
  pageSize?: number;
  stats?: GroupStatsData;
}

interface GenericApiResponse<T> {
  success?: boolean;
  data?: T;
  group?: T;
  groups?: T extends (infer U)[] ? U[] : never;
  meta?: {
    total?: number;
    totalCount?: number;
    page?: number;
    limit?: number;
    pageSize?: number;
    totalPages?: number;
  };
}

/**
 * Normalizes backend member responses into the frontend GroupMember contract
 */
function normalizeMember(m: Record<string, unknown>, groupId: string): GroupMember {
  const profile = (m.profile as Record<string, unknown>) || {};
  const isLeader =
    m.isLeader === true ||
    m.role === "Group Leader" ||
    m.role === "LEADER" ||
    m.role === "leader";

  const normalizedRole: GroupMemberRole = isLeader
    ? "Group Leader"
    : m.role === "Co-Leader" || m.role === "CO_LEADER"
    ? "Co-Leader"
    : "Member";

  const rawStatus = String(m.status || "Active").toLowerCase();
  const normalizedStatus: GroupMemberStatus =
    rawStatus === "active"
      ? "Active"
      : rawStatus === "pending"
      ? "Pending"
      : rawStatus === "suspended"
      ? "Suspended"
      : "Removed";

  return {
    id: String(m.id || m._id || profile.id || ""),
    groupId: String(m.groupId || groupId),
    profileId: (m.profileId || profile.id) as string | undefined,
    userId: String(m.userId || profile.userId || m.profileId || m.id || ""),
    name: String(m.name || profile.name || profile.displayName || profile.fullName || "Member"),
    email: String(m.email || profile.email || ""),
    avatarColor: (m.avatarColor as string) || "#EF5A22",
    avatarUrl: (m.avatarUrl || profile.avatarUrl) as string | undefined,
    role: normalizedRole,
    status: normalizedStatus,
    dateJoined: String(m.dateJoined || m.joinedAt || m.createdAt || new Date().toISOString()),
    lastActivity: String(m.lastActivity || m.updatedAt || "Recent"),
    isLeader,
  };
}

/**
 * 1. List all groups for Admin / Staff Dashboard
 * GET /api/v1/groups (Staff)
 */
export async function fetchGroups(params: GroupFilterParams = {}): Promise<GroupsListResponse> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set("page", String(params.page));
  if (params.pageSize) queryParams.set("limit", String(params.pageSize));
  if (params.search?.trim()) queryParams.set("search", params.search.trim());
  if (params.status && params.status !== "All") queryParams.set("status", params.status);
  if (params.category && params.category !== "All Categories") queryParams.set("category", params.category);
  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<GetGroupsApiResponse>(`/groups${queryString}`, {
    method: "GET",
  });

  // Extract groups array from various backend response formats
  let rawGroups: Group[] = [];
  if (Array.isArray(response)) {
    rawGroups = response;
  } else if (Array.isArray(response?.data)) {
    rawGroups = response.data;
  } else if (response?.data && typeof response.data === "object" && Array.isArray(response.data.groups)) {
    rawGroups = response.data.groups;
  } else if (Array.isArray(response?.groups)) {
    rawGroups = response.groups;
  }

  // Calculate or extract pagination metadata
  const totalCount =
    (typeof response?.data === "object" && !Array.isArray(response.data) && response.data?.total) ||
    (typeof response?.data === "object" && !Array.isArray(response.data) && response.data?.totalCount) ||
    response?.meta?.total ||
    response?.meta?.totalCount ||
    response?.totalCount ||
    rawGroups.length;

  const pageSize = params.pageSize || response?.meta?.limit || response?.meta?.pageSize || 10;
  const totalPages =
    (typeof response?.data === "object" && !Array.isArray(response.data) && response.data?.totalPages) ||
    response?.meta?.totalPages ||
    response?.totalPages ||
    Math.max(1, Math.ceil(totalCount / pageSize));

  const page = params.page || response?.meta?.page || 1;

  // Stats calculation: Only use backend-provided stats or derive verified aggregate from metadata
  const backendStats =
    (typeof response?.data === "object" && !Array.isArray(response.data) && response.data?.stats) ||
    response?.stats;

  const stats: GroupStatsData = backendStats || {
    totalGroups: {
      title: "01 — Total Groups",
      value: totalCount,
      footerText: "All groups on Hosté",
      rate: 0,
    },
    activeGroups: {
      title: "02 — Active Groups",
      value: rawGroups.filter((g) => g.status?.toUpperCase() === "ACTIVE" || g.status === "Active").length,
      footerText: "Currently active on page",
      rate: 0,
    },
    totalMembers: {
      title: "03 — Total Members",
      value: rawGroups.reduce((acc, g) => acc + (Number(g.memberCount || g.membersCount) || 0), 0),
      footerText: "Members on page",
      rate: 0,
    },
    suspendedGroups: {
      title: "04 — Suspended / Inactive",
      value: rawGroups.filter((g) => g.status?.toUpperCase() !== "ACTIVE" && g.status !== "Active").length,
      footerText: "Groups requiring attention on page",
      rate: 0,
    },
  };

  return {
    groups: rawGroups,
    totalCount,
    totalPages,
    page,
    pageSize,
    stats,
  };
}

/**
 * 2. Get one group by ID
 * GET /api/v1/groups/:groupId (Any authenticated user)
 */
export async function fetchGroupById(groupId: string): Promise<Group | null> {
  const response = await apiClient<GenericApiResponse<Group>>(`/groups/${groupId}`, {
    method: "GET",
  });

  if (!response) return null;
  const group =
    response.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? response.data
      : response.group || response;

  return group as Group;
}

/**
 * 3. List members with server-side pagination, searching, and filtering
 * GET /api/v1/groups/:groupId/members (Any authenticated user)
 */
export async function fetchGroupMembers(
  groupId: string,
  params: GroupMemberFilterParams = {}
): Promise<GroupMembersResponse> {
  const queryParams = new URLSearchParams();

  if (params.page) queryParams.set("page", String(params.page));
  if (params.pageSize) queryParams.set("limit", String(params.pageSize));
  if (params.search?.trim()) queryParams.set("search", params.search.trim());
  if (params.role && params.role !== "All") queryParams.set("role", params.role);
  if (params.status && params.status !== "All") queryParams.set("status", params.status);
  if (params.joined && params.joined !== "Any Date") queryParams.set("joined", params.joined);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(`/groups/${groupId}/members${queryString}`, {
    method: "GET",
  });

  let rawMembers: Record<string, unknown>[] = [];
  if (Array.isArray(response)) {
    rawMembers = response as Record<string, unknown>[];
  } else if (Array.isArray(response?.data)) {
    rawMembers = response.data as Record<string, unknown>[];
  } else if (
    response?.data &&
    typeof response.data === "object" &&
    Array.isArray((response.data as Record<string, unknown>).members)
  ) {
    rawMembers = (response.data as { members: Record<string, unknown>[] }).members;
  } else if (Array.isArray(response?.members)) {
    rawMembers = response.members as Record<string, unknown>[];
  }

  const responseDataObj =
    typeof response?.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : undefined;

  const responseMetaObj =
    typeof response?.meta === "object" && !Array.isArray(response.meta)
      ? (response.meta as Record<string, unknown>)
      : undefined;

  const totalCount =
    (typeof responseDataObj?.total === "number" && responseDataObj.total) ||
    (typeof responseDataObj?.totalCount === "number" && responseDataObj.totalCount) ||
    (typeof responseMetaObj?.total === "number" && responseMetaObj.total) ||
    (typeof responseMetaObj?.totalCount === "number" && responseMetaObj.totalCount) ||
    (typeof response?.totalCount === "number" && response.totalCount) ||
    rawMembers.length;

  const pageSize =
    params.pageSize ||
    (typeof responseMetaObj?.limit === "number" && responseMetaObj.limit) ||
    (typeof responseMetaObj?.pageSize === "number" && responseMetaObj.pageSize) ||
    10;

  const totalPages =
    (typeof responseDataObj?.totalPages === "number" && responseDataObj.totalPages) ||
    (typeof responseMetaObj?.totalPages === "number" && responseMetaObj.totalPages) ||
    (typeof response?.totalPages === "number" && response.totalPages) ||
    Math.max(1, Math.ceil(totalCount / pageSize));

  const page =
    params.page ||
    (typeof responseMetaObj?.page === "number" && responseMetaObj.page) ||
    1;

  const members = rawMembers.map((m) => normalizeMember(m, groupId));

  return {
    members,
    totalCount,
    totalPages,
    page,
    pageSize,
  };
}

/**
 * Overview group statistics
 */
export async function fetchGroupStats(): Promise<GroupStatsData> {
  const list = await fetchGroups({ pageSize: 100 });
  return list.stats;
}

/**
 * 5. Update group status
 * PATCH /api/v1/groups/:groupId/status
 * Access: Group leader (Active profile)
 * Body: { status: "ACTIVE" | "PAUSED" | "INACTIVE" }
 */
export async function updateGroupStatus(
  groupId: string,
  status: "ACTIVE" | "PAUSED" | "INACTIVE"
): Promise<Group> {
  const response = await apiClient<GenericApiResponse<Group>>(`/groups/${groupId}/status`, {
    method: "PATCH",
    body: JSON.stringify({ status }),
  });

  const updatedGroup =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? response.data
      : response?.group || (response as unknown as Group);

  return updatedGroup;
}
