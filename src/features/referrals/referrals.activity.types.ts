import type { PromoterType } from "./referrals.overview.types";

// View models for the activity design; backend contracts remain unchanged.
export interface ActivityPromoter {
  id: string;
  name: string;
  email: string;
  type: PromoterType;
  code: string;
  flagReason?: string;
}

export interface ActivityReferral {
  id: string;
  referrerId: string;
  referredUser: string;
  referredRole: "Host" | "Guest";
  date: string;
  qualification: "Qualified" | "Pending" | "Flagged";
  rewardAmount: number | null;
  payout: "Paid" | "Processing" | "Pending" | "Rejected" | null;
}

export interface ActivitySummary {
  periodEnd: string;
  total: number;
  registered: number;
  conversionRate: string;
  successful: number;
  earned: number;
  pending: number;
}
