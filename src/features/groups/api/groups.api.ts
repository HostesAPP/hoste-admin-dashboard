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
  GroupStatsMetric,
  GroupMemberRole,
  GroupMemberStatus,
  GroupLeaderInfo,
  GroupStatus,
} from "../types/groups.types";

/**
 * Normalizes backend group data into the UI Group model
 */
export function normalizeGroup(raw: Record<string, unknown>): Group {
  const id = String(raw.id || raw._id || "");
  const name = String(raw.name || raw.title || "Unnamed Group");

  const leaderProfileId = raw.leaderProfileId
    ? String(raw.leaderProfileId)
    : raw.leaderId
    ? String(raw.leaderId)
    : (raw.leader as Record<string, unknown>)?.profileId
    ? String((raw.leader as Record<string, unknown>).profileId)
    : (raw.leader as Record<string, unknown>)?.id
    ? String((raw.leader as Record<string, unknown>).id)
    : undefined;

  const rawLeader =
    (raw.leader as Record<string, unknown>) ||
    (raw.leaderProfile as Record<string, unknown>);

  let leader: GroupLeaderInfo | undefined = undefined;
  if (rawLeader && typeof rawLeader === "object") {
    leader = {
      id: String(rawLeader.id || rawLeader.profileId || leaderProfileId || ""),
      profileId: leaderProfileId,
      displayName: String(rawLeader.displayName || rawLeader.name || raw.leaderName || ""),
      name: String(rawLeader.displayName || rawLeader.name || raw.leaderName || ""),
      avatarUrl: rawLeader.avatarUrl ? String(rawLeader.avatarUrl) : undefined,
      email: rawLeader.email ? String(rawLeader.email) : undefined,
    };
  } else if (raw.leaderName) {
    leader = {
      id: leaderProfileId || "",
      profileId: leaderProfileId,
      displayName: String(raw.leaderName),
      name: String(raw.leaderName),
    };
  }

  const rawStatus = String(raw.status || "ACTIVE").toUpperCase();
  const status: GroupStatus =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "PAUSED"
      ? "Paused"
      : rawStatus === "INACTIVE" || rawStatus === "SUSPENDED"
      ? "Inactive"
      : (raw.status as GroupStatus) || "Active";

  const memberCount =
    typeof raw.memberCount === "number"
      ? raw.memberCount
      : typeof raw.membersCount === "number"
      ? raw.membersCount
      : Array.isArray(raw.members)
      ? raw.members.length
      : 0;

  const bookingCount =
    typeof raw.bookingCount === "number"
      ? raw.bookingCount
      : typeof raw.bookingsCount === "number"
      ? raw.bookingsCount
      : typeof raw.engagementsCount === "number"
      ? raw.engagementsCount
      : Array.isArray(raw.engagements)
      ? raw.engagements.length
      : 0;

  return {
    id,
    name,
    leaderProfileId,
    leader,
    category: raw.category ? String(raw.category) : "General",
    status,
    color: raw.color ? String(raw.color) : undefined,
    description: raw.description ? String(raw.description) : undefined,
    createdAt: raw.createdAt ? String(raw.createdAt) : undefined,
    updatedAt: raw.updatedAt ? String(raw.updatedAt) : undefined,
    memberCount,
    membersCount: memberCount,
    bookingCount,
    bookingsCount: bookingCount,
    engagementsCount: bookingCount,
    rating: (raw.rating as number | string) || undefined,
    leaderEarnings: (raw.leaderEarnings as number | string) || undefined,
  };
}

/**
 * Normalizes backend member responses into the frontend GroupMember contract
 */
export function normalizeMember(
  m: Record<string, unknown>,
  groupId: string
): GroupMember {
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

  const profileId = (m.profileId || profile.id) as string | undefined;

  return {
    id: String(m.id || m._id || profile.id || ""),
    groupId: String(m.groupId || groupId),
    profileId,
    userId: String(m.userId || profile.userId || profileId || m.id || ""),
    name: String(
      m.name ||
        profile.displayName ||
        profile.name ||
        profile.fullName ||
        "Member"
    ),
    email: String(m.email || profile.email || ""),
    avatarColor: (m.avatarColor as string) || undefined,
    avatarUrl: (m.avatarUrl || profile.avatarUrl) as string | undefined,
    role: normalizedRole,
    status: normalizedStatus,
    dateJoined: String(
      m.dateJoined || m.joinedAt || m.createdAt || new Date().toISOString()
    ),
    lastActivity: String(m.lastActivity || m.updatedAt || "Recent"),
    isLeader,
  };
}

/**
 * 1. List all groups for Admin / Staff Dashboard
 * GET /api/v1/groups
 */
export async function fetchGroups(
  params: GroupFilterParams = {}
): Promise<GroupsListResponse> {
  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const queryParams = new URLSearchParams();
  queryParams.set("skip", String(skip));
  queryParams.set("take", String(take));

  if (params.search?.trim()) queryParams.set("search", params.search.trim());
  if (params.status && params.status !== "All") {
    queryParams.set("status", params.status.toUpperCase());
  }
  if (params.category && params.category !== "All Categories") {
    queryParams.set("category", params.category);
  }

  // Map memberCount range to minMembers / maxMembers
  if (params.minMembers !== undefined) {
    queryParams.set("minMembers", String(params.minMembers));
  }
  if (params.maxMembers !== undefined) {
    queryParams.set("maxMembers", String(params.maxMembers));
  } else if (params.memberCount && params.memberCount !== "Any") {
    if (params.memberCount === "1-20") {
      queryParams.set("minMembers", "1");
      queryParams.set("maxMembers", "20");
    } else if (params.memberCount === "21-50") {
      queryParams.set("minMembers", "21");
      queryParams.set("maxMembers", "50");
    } else if (params.memberCount === "51-100") {
      queryParams.set("minMembers", "51");
      queryParams.set("maxMembers", "100");
    } else if (params.memberCount === "100+") {
      queryParams.set("minMembers", "100");
    }
  }

  if (params.sortBy) queryParams.set("sortBy", params.sortBy);
  if (params.sortOrder) queryParams.set("sortOrder", params.sortOrder);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(
    `/groups${queryString}`,
    {
      method: "GET",
    }
  );

  // LOG RESPONSE per user instruction
  console.log("[Groups API] GET /api/v1/groups response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const rawItems = Array.isArray(dataObj?.items)
    ? (dataObj.items as Record<string, unknown>[])
    : Array.isArray(response?.items)
    ? (response.items as Record<string, unknown>[])
    : Array.isArray(dataObj?.groups)
    ? (dataObj.groups as Record<string, unknown>[])
    : Array.isArray(response?.data)
    ? (response.data as Record<string, unknown>[])
    : Array.isArray(response)
    ? (response as Record<string, unknown>[])
    : [];

  const metaObj =
    response?.meta && typeof response.meta === "object" && !Array.isArray(response.meta)
      ? (response.meta as Record<string, unknown>)
      : undefined;

  const totalCount =
    typeof metaObj?.total === "number"
      ? metaObj.total
      : typeof dataObj?.total === "number"
      ? dataObj.total
      : typeof response?.total === "number"
      ? response.total
      : typeof dataObj?.totalCount === "number"
      ? dataObj.totalCount
      : typeof response?.totalCount === "number"
      ? response.totalCount
      : rawItems.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const groups = rawItems.map((item) => normalizeGroup(item));

  // Extract or compute stats
  const backendStats =
    dataObj?.stats && typeof dataObj.stats === "object"
      ? (dataObj.stats as GroupStatsData)
      : undefined;

  const stats: GroupStatsData = backendStats || {
    totalGroups: {
      title: "01 — Total Groups",
      value: totalCount,
      footerText: "All groups on Hosté",
      rate: 0,
    },
    activeGroups: {
      title: "02 — Active Groups",
      value: groups.filter((g) => g.status === "Active").length,
      footerText: "Currently active on platform",
      rate: 0,
    },
    totalMembers: {
      title: "03 — Total Members",
      value: groups.reduce((acc, g) => acc + (g.memberCount || 0), 0),
      footerText: "Registered group members",
      rate: 0,
    },
    suspendedGroups: {
      title: "04 — Suspended / Inactive",
      value: groups.filter((g) => g.status !== "Active").length,
      footerText: "Paused or inactive groups",
      rate: 0,
    },
  };

  return {
    groups,
    totalCount,
    totalPages,
    page,
    pageSize,
    stats,
  };
}

/**
 * 2. Get one group by ID
 * GET /api/v1/groups/:groupId
 */
export async function fetchGroupById(groupId: string): Promise<Group | null> {
  const cleanId = groupId.trim();
  if (!cleanId) return null;

  try {
    const response = await apiClient<Record<string, unknown>>(
      `/groups/${cleanId}`,
      {
        method: "GET",
      }
    );

    // LOG RESPONSE per user instruction
    console.log("[Groups API] GET /api/v1/groups/:id response:", response);

    if (!response) return null;

    const dataObj =
      response.data && typeof response.data === "object" && !Array.isArray(response.data)
        ? (response.data as Record<string, unknown>)
        : response.group && typeof response.group === "object" && !Array.isArray(response.group)
        ? (response.group as Record<string, unknown>)
        : response;

    return normalizeGroup(dataObj);
  } catch (err) {
    console.warn(`[Groups API] GET /groups/${cleanId} failed:`, err);
    return null;
  }
}

/**
 * 3. List members of a group with pagination & search
 * GET /api/v1/groups/:groupId/members
 */
export async function fetchGroupMembers(
  groupId: string,
  params: GroupMemberFilterParams = {}
): Promise<GroupMembersResponse> {
  const cleanId = groupId.trim();
  if (!cleanId) {
    return { members: [], totalCount: 0, totalPages: 1, page: 1, pageSize: 10 };
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 10;
  const skip = (page - 1) * pageSize;
  const take = pageSize;

  const queryParams = new URLSearchParams();
  queryParams.set("skip", String(skip));
  queryParams.set("take", String(take));
  queryParams.set("page", String(page));
  queryParams.set("limit", String(pageSize));

  if (params.search?.trim()) queryParams.set("search", params.search.trim());
  if (params.role && params.role !== "All") queryParams.set("role", params.role);
  if (params.status && params.status !== "All") queryParams.set("status", params.status);
  if (params.joined && params.joined !== "Any Date") queryParams.set("joined", params.joined);

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(
    `/groups/${cleanId}/members${queryString}`,
    {
      method: "GET",
    }
  );

  // LOG RESPONSE per user instruction
  console.log("[Groups API] GET /api/v1/groups/:id/members response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const rawMembers = Array.isArray(dataObj?.items)
    ? (dataObj.items as Record<string, unknown>[])
    : Array.isArray(dataObj?.members)
    ? (dataObj.members as Record<string, unknown>[])
    : Array.isArray(response?.members)
    ? (response.members as Record<string, unknown>[])
    : Array.isArray(response?.data)
    ? (response.data as Record<string, unknown>[])
    : Array.isArray(response)
    ? (response as Record<string, unknown>[])
    : [];

  const totalCount =
    typeof dataObj?.total === "number"
      ? dataObj.total
      : typeof response?.total === "number"
      ? response.total
      : typeof dataObj?.totalCount === "number"
      ? dataObj.totalCount
      : typeof response?.totalCount === "number"
      ? response.totalCount
      : rawMembers.length;

  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const members = rawMembers.map((m) => normalizeMember(m, cleanId));

  return {
    members,
    totalCount,
    totalPages,
    page,
    pageSize,
  };
}

/**
 * 4. Overview group statistics
 * GET /api/v1/groups/counts
 */
export async function fetchGroupStats(): Promise<GroupStatsMetric[]> {
  const response = await apiClient<Record<string, unknown>>(`/groups/counts`, {
    method: "GET",
  });

  console.log("[Groups API] GET /api/v1/groups/counts response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const total = Number(dataObj?.total ?? 0);
  const byStatus = (dataObj?.byStatus as Record<string, unknown>) || {};
  const active = Number(byStatus.ACTIVE ?? 0);
  const paused = Number(byStatus.PAUSED ?? 0);
  const inactive = Number(byStatus.INACTIVE ?? 0);

  return [
    {
      title: "01 — Total Groups",
      value: total,
      footerText: "All groups on Hosté",
      rate: 0,
    },
    {
      title: "02 — Active Groups",
      value: active,
      footerText: "Currently active on platform",
      rate: 0,
    },
    {
      title: "03 — Paused Groups",
      value: paused,
      footerText: "Temporarily paused groups",
      rate: 0,
    },
    {
      title: "04 — Inactive Groups",
      value: inactive,
      footerText: "Deactivated or inactive groups",
      rate: 0,
    },
  ];
}

/**
 * 5. Update group status (staff)
 * PATCH /api/v1/groups/:groupId/admin-status
 */
export async function updateGroupStatus(
  groupId: string,
  status: "ACTIVE" | "PAUSED" | "INACTIVE",
  reason: string
): Promise<Group> {
  const cleanId = groupId.trim();
  const safeReason =
    reason?.trim().length >= 3
      ? reason.trim()
      : "Status updated by staff administrator";

  const response = await apiClient<Record<string, unknown>>(
    `/groups/${cleanId}/admin-status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status, reason: safeReason }),
    }
  );

  // LOG RESPONSE per user instruction
  console.log("[Groups API] PATCH /api/v1/groups/:id/admin-status response:", response);

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response?.group && typeof response.group === "object" && !Array.isArray(response.group)
      ? (response.group as Record<string, unknown>)
      : (response as Record<string, unknown>);

  return normalizeGroup(dataObj);
}
