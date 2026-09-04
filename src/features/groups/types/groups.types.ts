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