// features/groups/api/groups.api.ts

import { GROUPS, GROUP_MEMBERS } from "../data/groups.data";
import { getGroupMembers, getGroupLeader, getGroupEngagements } from "../lib/groups.utils";
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

// In-memory working copies of data for mock mutations
let currentGroups: Group[] = [...GROUPS];
let currentMembers: GroupMember[] = [...GROUP_MEMBERS];

const delay = (ms: number = 80) => new Promise((resolve) => setTimeout(resolve, ms));

export async function fetchGroups(params: GroupFilterParams = {}): Promise<GroupsListResponse> {
  await delay(120);

  const {
    search = "",
    status = "All",
    category = "All Categories",
    memberCount = "Any",
    page = 1,
    pageSize = 10,
  } = params;

  let filtered = [...currentGroups];

  // Search filter
  if (search.trim()) {
    const q = search.toLowerCase().trim();
    filtered = filtered.filter((group) => {
      const leader = getGroupLeader(group.leaderProfileId);
      return (
        group.name.toLowerCase().includes(q) ||
        group.id.toLowerCase().includes(q) ||
        group.category.toLowerCase().includes(q) ||
        (leader && leader.displayName.toLowerCase().includes(q))
      );
    });
  }

  // Status filter
  if (status && status !== "All") {
    filtered = filtered.filter(
      (group) => group.status.toLowerCase() === status.toLowerCase()
    );
  }

  // Category filter
  if (category && category !== "All Categories") {
    filtered = filtered.filter(
      (group) => group.category.toLowerCase() === category.toLowerCase()
    );
  }

  // Member count filter
  if (memberCount && memberCount !== "Any") {
    filtered = filtered.filter((group) => {
      const count = getGroupMembers(group.id).length;
      if (memberCount === "1-20") return count >= 1 && count <= 20;
      if (memberCount === "21-50") return count >= 21 && count <= 50;
      if (memberCount === "51-100") return count >= 51 && count <= 100;
      if (memberCount === "100+") return count > 100;
      return true;
    });
  }

  const totalCount = filtered.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedGroups = filtered.slice(startIndex, startIndex + pageSize);

  const stats: GroupStatsData = {
    totalGroups: {
      title: "01 — Total Groups",
      value: currentGroups.length,
      footerText: "All groups on Hosté",
      rate: 12,
    },
    activeGroups: {
      title: "02 — Active Groups",
      value: currentGroups.filter((g) => g.status === "Active").length,
      footerText: "Currently active",
      rate: 8,
    },
    totalMembers: {
      title: "03 — Total Members",
      value: currentMembers.length,
      footerText: "Members across all groups",
      rate: 15,
    },
    suspendedGroups: {
      title: "04 — Suspended / Inactive",
      value: currentGroups.filter((g) => g.status !== "Active").length,
      footerText: "Groups requiring attention",
      rate: 0,
    },
  };

  return {
    groups: paginatedGroups,
    totalCount,
    totalPages,
    page: validPage,
    pageSize,
    stats,
  };
}

export async function fetchGroupById(groupId: string): Promise<Group | null> {
  await delay(80);
  const found = currentGroups.find((g) => g.id.toLowerCase() === groupId.toLowerCase());
  return found || currentGroups[0] || null;
}

export async function fetchGroupStats(): Promise<GroupStatsData> {
  await delay(60);
  return {
    totalGroups: {
      title: "01 — Total Groups",
      value: currentGroups.length,
      footerText: "All groups on Hosté",
      rate: 12,
    },
    activeGroups: {
      title: "02 — Active Groups",
      value: currentGroups.filter((g) => g.status === "Active").length,
      footerText: "Currently active",
      rate: 8,
    },
    totalMembers: {
      title: "03 — Total Members",
      value: currentMembers.length,
      footerText: "Members across all groups",
      rate: 15,
    },
    suspendedGroups: {
      title: "04 — Suspended / Inactive",
      value: currentGroups.filter((g) => g.status !== "Active").length,
      footerText: "Groups requiring attention",
      rate: 0,
    },
  };
}

export async function fetchGroupMembers(
  groupId: string,
  params: GroupMemberFilterParams = {}
): Promise<GroupMembersResponse> {
  await delay(90);

  const { search = "", role = "All", status = "All", page = 1, pageSize = 10 } = params;

  let members = currentMembers.filter(
    (m) => m.groupId.toLowerCase() === groupId.toLowerCase()
  );

  // If none match specific ID, fallback to GRP-001 members so mock doesn't break
  if (members.length === 0) {
    members = currentMembers.filter((m) => m.groupId === "GRP-001");
  }

  if (search.trim()) {
    const q = search.toLowerCase().trim();
    members = members.filter(
      (m) =>
        m.name.toLowerCase().includes(q) ||
        m.email.toLowerCase().includes(q) ||
        m.userId.toLowerCase().includes(q)
    );
  }

  if (role && role !== "All") {
    members = members.filter((m) => m.role === role);
  }

  if (status && status !== "All") {
    members = members.filter((m) => m.status === status);
  }

  const totalCount = members.length;
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const validPage = Math.min(Math.max(1, page), totalPages);
  const startIndex = (validPage - 1) * pageSize;
  const paginatedMembers = members.slice(startIndex, startIndex + pageSize);

  return {
    members: paginatedMembers,
    totalCount,
    totalPages,
    page: validPage,
    pageSize,
  };
}

export async function suspendGroup(groupId: string, reason?: string): Promise<Group> {
  await delay(150);
  currentGroups = currentGroups.map((g) =>
    g.id.toLowerCase() === groupId.toLowerCase()
      ? { ...g, status: "Paused" as const, updatedAt: new Date().toISOString() }
      : g
  );
  const updated = currentGroups.find((g) => g.id.toLowerCase() === groupId.toLowerCase());
  if (!updated) throw new Error("Group not found");
  return updated;
}

export async function restoreGroup(groupId: string): Promise<Group> {
  await delay(150);
  currentGroups = currentGroups.map((g) =>
    g.id.toLowerCase() === groupId.toLowerCase()
      ? { ...g, status: "Active" as const, updatedAt: new Date().toISOString() }
      : g
  );
  const updated = currentGroups.find((g) => g.id.toLowerCase() === groupId.toLowerCase());
  if (!updated) throw new Error("Group not found");
  return updated;
}

export async function addGroupMember(
  groupId: string,
  data: {
    name: string;
    email: string;
    role: GroupMemberRole;
    status: GroupMemberStatus;
  }
): Promise<GroupMember> {
  await delay(150);
  const newMember: GroupMember = {
    id: `mem-${Date.now()}`,
    groupId,
    userId: `USR-${Math.floor(10000 + Math.random() * 90000)}`,
    name: data.name,
    email: data.email,
    role: data.role,
    status: data.status,
    dateJoined: new Date().toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }),
    lastActivity: "Just now",
    avatarColor: ["#EF5A22", "#0284C7", "#10B981", "#8B5CF6", "#F59E0B"][
      Math.floor(Math.random() * 5)
    ],
    isLeader: data.role === "Group Leader",
  };
  currentMembers = [newMember, ...currentMembers];
  return newMember;
}

export async function changeGroupMemberRole(
  groupId: string,
  memberId: string,
  newRole: GroupMemberRole
): Promise<GroupMember> {
  await delay(120);
  let updatedMember: GroupMember | null = null;
  currentMembers = currentMembers.map((m) => {
    if (m.id === memberId) {
      updatedMember = {
        ...m,
        role: newRole,
        isLeader: newRole === "Group Leader",
      };
      return updatedMember;
    }
    if (newRole === "Group Leader" && (m.role === "Group Leader" || m.isLeader)) {
      return { ...m, role: "Member" as const, isLeader: false };
    }
    return m;
  });
  if (!updatedMember) throw new Error("Member not found");
  return updatedMember;
}

export async function removeGroupMember(groupId: string, memberId: string): Promise<boolean> {
  await delay(120);
  currentMembers = currentMembers.filter((m) => m.id !== memberId);
  return true;
}

export async function transferGroupLeader(
  groupId: string,
  newLeaderMemberId: string
): Promise<boolean> {
  await delay(150);
  currentMembers = currentMembers.map((m) => {
    if (m.id === newLeaderMemberId) {
      return { ...m, role: "Group Leader" as const, isLeader: true };
    }
    if (m.role === "Group Leader" || m.isLeader) {
      return { ...m, role: "Member" as const, isLeader: false };
    }
    return m;
  });
  return true;
}
