// View models for the supplied referral payout design, not API contracts.
export type ReferralPayoutStatus = "Paid" | "Pending" | "Processing" | "Failed";

export interface ReferralPayout {
  id: string;
  referrerId: string;
  rewardsIncluded: number;
  amount: number;
  currency: string;
  status: ReferralPayoutStatus;
  createdAt: string;
  paidAt: string | null;
  reference: string | null;
}

export interface PayoutRewardRecord {
  id: string;
  payoutId: string;
  referralId: string;
  referredUser: string;
  qualification: "Qualified";
  reward: number;
  status: "Approved";
}

export interface PayoutEvent {
  id: string;
  payoutId: string;
  label: string;
  actor: string;
  date: string;
  completed: boolean;
}

export interface ReferralPayoutSummary {
  periodEnd: string;
  totalEarnings: number;
  paidOut: number;
  pending: number;
  successRate: string;
}

export interface PayoutChartPoint {
  date: string;
  paid: number;
  pending: number;
}

export interface PayoutsData {
  rows: ReferralPayout[];
  summary: ReferralPayoutSummary;
  chart: PayoutChartPoint[];
  rewards: PayoutRewardRecord[];
  timeline: PayoutEvent[];
  audit: PayoutEvent[];
}
