export type ReferralStatus =
  | "Pending"
  | "Converted"
  | "Rewarded"
  | "Expired"
  | "Rejected";
export type PayoutStatus = "PENDING" | "PROCESSING" | "COMPLETED" | "FAILED";
export type QualifyingStatus =
  | "NOT_QAULIFIED"
  | "QUALIFYING_ENGAGEMENT_COMPLETED"
  | "QUALIFIED";

export interface Referral {
  id: string;
  referralCode: string;
  referrerName: string;
  referrerEmail: string;
  referrerRole: "Hosté" | "Brand" | "Customer";
  referredName: string;
  referredEmail: string;
  status: ReferralStatus;
  rewardAmount: number;
  rewardPaymentStatus: "Paid" | "Pending" | "N/A" | "Failed";
  createdAt: string;
  convertedAt?: string;
  notes?: string;
}

export interface ReferralStats {
  totalReferrals: number;
  convertedCount: number;
  pendingCount: number;
  rewardedCount: number;
  totalRewardsPaid: number;
}

export interface ReferralParams {
  status?: ReferralStatus;
  qualifyingStatus?: QualifyingStatus;
  referrerProfileId?: string;
  referredProfileId?: string;
  payoutStatus?: PayoutStatus;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
  page?: number;
  pageSize?: number;
}
