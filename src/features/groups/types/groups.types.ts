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
};

// group member types
export type GroupMemberStatus = "Removed" | "Active";

export type GroupMember = {
  id: string;
  groupId: string;
  profileId: string;
  status: GroupMemberStatus;
};