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