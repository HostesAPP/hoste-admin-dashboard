// groups types
export type GroupStatus = "Active" | "Paused" | "Inactive";

export type Group = {
  id: string;
  name: string;
  leaderProfileId: string;
  category: string;
  status: GroupStatus;
  createdAt: string;
  updatedAt: string;
  color: string;
  description: string;
};

// group member types
export type GroupMemberStatus = "Active" | "Pending" | "Suspended" | "Removed";
export type GroupMemberRole = "Group Leader" | "Member" | "Co-Leader";

export type GroupMember = {
  id: string;
  groupId: string;
  profileId?: string;
  userId: string;
  name: string;
  email: string;
  avatarColor?: string;
  avatarUrl?: string;
  role: GroupMemberRole;
  status: GroupMemberStatus;
  dateJoined: string;
  lastActivity: string;
  isLeader?: boolean;
};

// Filter & query parameters
export interface GroupFilterParams {
  search?: string;
  status?: string;
  category?: string;
  memberCount?: string;
  page?: number;
  pageSize?: number;
  sortBy?: string;
  sortOrder?: "asc" | "desc";
}

export interface GroupMemberFilterParams {
  search?: string;
  role?: string;
  status?: string;
  joined?: string;
  page?: number;
  pageSize?: number;
}

// Group stats overview
export interface GroupStatsMetric {
  title: string;
  value: number;
  footerText: string;
  rate: number;
}

export interface GroupStatsData {
  totalGroups: GroupStatsMetric;
  activeGroups: GroupStatsMetric;
  totalMembers: GroupStatsMetric;
  suspendedGroups: GroupStatsMetric;
}

// Responses
export interface GroupsListResponse {
  groups: Group[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
  stats: GroupStatsData;
}

export interface GroupMembersResponse {
  members: GroupMember[];
  totalCount: number;
  totalPages: number;
  page: number;
  pageSize: number;
}