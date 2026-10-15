// Presentation models for the supplied overview design, not API contracts.
export type ReferralTab =
  | "Overview"
  | "Referral Activity"
  | "Referrers"
  | "Rewards & Approvals"
  | "Payouts";
export type ReferralRange = "30" | "7" | "1";
export type ReferralMetric =
  "referrals" | "registrations" | "successful" | "rewards";
export type PromoterType =
  "Student" | "Club" | "Brand" | "Individual" | "Partner";

export interface ReferralOverviewSummary {
  periodEnd: string;
  reward: number;
  threshold: number;
  updatedAt: string;
  updatedBy: string;
  attentionCounts: { rewards: number; payouts: number; flagged: number };
  metrics: readonly {
    label: string;
    value: string;
    detail: string;
    footnote: string;
    tone: "default" | "primary" | "success";
  }[];
  journey: readonly {
    label: string;
    value: string;
    rate: string;
    detail: string;
    tone: "default" | "primary" | "success";
  }[];
}

export interface ReferrerOverview {
  id: string;
  name: string;
  code: string;
  type: PromoterType;
  total: number;
  successful: number;
  earned: number;
  paid: number;
}

export interface ReferralActivityOverview {
  id: string;
  referrerId: string;
  referredUser: string;
  status: "Qualified" | "Registered" | "Link Used" | "Rejected" | "Expired";
  rewardStatus: "Approved" | "Pending Review" | "Rejected" | null;
  rewardAmount: number;
  payout: "Pending" | "Paid" | null;
  date: string;
}

export interface ReferralPerformancePoint {
  date: string;
  referrals: number;
  registrations: number;
  successful: number;
  rewards: number;
}
