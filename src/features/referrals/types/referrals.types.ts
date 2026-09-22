export type ReferralStatus = "Pending" | "Qualified" | "Paid" | "Expired" | "Cancelled";
export type QualifyingStatus = "Not Qualified" | "Qualifying Engagement Completed" | "Qualified";
export type ReferralPayoutStatus = "Pending" | "Processing" | "Completed" | "Failed";

export interface ReferralRecord {
  id: string;
  referenceId: string; // REF-YYMMDD-XXXX
  referrerName: string;
  referrerProfileId: string;
  referredBrandName: string;
  referredBrandProfileId: string;
  referralStatus: ReferralStatus;
  qualifyingStatus: QualifyingStatus;
  qualifyingEngagementId?: string;
  earningAmount: number; // Strictly ₦1,000 per PRD v2.2 §08
  payoutStatus: ReferralPayoutStatus;
  processingFee: number;
  payoutReferenceId?: string;
  processedAt?: string;
  createdAt: string;
}

// TODO: pending product confirmation for referral threshold/progress mechanic per PRD v2.2 §11
// TODO: pending product confirmation for separate rewards & approvals workflow per PRD v2.2 §12
