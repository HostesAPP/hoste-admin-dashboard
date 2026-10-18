// Presentation models for the supplied rewards design, not API contracts.
export type RewardStatus =
  "Pending Review" | "Approved" | "Rejected" | "Eligible for Payout";
export type RewardReferrerType =
  | "Student"
  | "Club / Organization"
  | "Brand"
  | "Individual"
  | "Brand / Partner";

export interface RewardReferrer {
  id: string;
  name: string;
  email: string;
  code: string;
  type: RewardReferrerType;
  active: boolean;
}

export interface ReferralReward {
  id: string;
  referrerId: string;
  referredUser: string;
  referredEmail: string;
  referredActive: boolean;
  referralId: string;
  referralStatus: "Completed" | "Pending";
  qualification: string;
  qualificationMet: boolean;
  amount: number;
  status: RewardStatus;
  date: string;
  generatedAt: string;
  referralDate: string;
  qualifiedAt: string;
  canReview: boolean;
  reviewNote?: string;
}

export interface RewardsSummary {
  periodEnd: string;
  rewardAmount: number;
  pending: number;
  pendingAmount: number;
  approved: number;
  approvedAmount: number;
  rejected: number;
  rejectedAmount: number;
  total: number;
  totalAmount: number;
}

export interface RewardsSnapshot {
  records: ReferralReward[];
  summary: RewardsSummary;
}
