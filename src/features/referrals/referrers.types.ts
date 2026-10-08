// Display models for the supplied Referrers design, separate from API contracts.
export interface DirectoryReferrer {
  id: string;
  name: string;
  email: string;
  code: string;
  peopleReferred: number;
  qualified: number;
  qualificationRate: string;
  earnings: number;
  paidOut: number | null;
  pending: number | null;
  status: "Active" | "Inactive" | "Suspended";
  lastActivity: string;
  threshold: {
    current: number;
    required: number;
    remaining: number;
    progress: number;
    reached: boolean;
  };
}

export interface ReferrerHistoryRecord {
  id: string;
  referrerId: string;
  person: string;
  date: string;
  status: "Completed" | "Pending";
  qualification: "Qualified" | "Pending";
  earning: number;
}

export interface ReferrersSummary {
  periodEnd: string;
  total: number;
  active: number;
  activeRate: string;
  breakdown: string;
  successful: number;
  successfulEarnings: number;
  totalRewards: number;
  rewardReferrals: number;
}
