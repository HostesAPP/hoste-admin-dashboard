import type { Metadata } from "next";
import { ReferralsOverview } from "@/features/referrals/components/referrals.overview";
import { Toaster } from "@/components/ui/sonner";
import {
  MOCK_ACTIVITY_PROMOTERS,
  MOCK_ACTIVITY_REFERRALS,
  MOCK_ACTIVITY_SUMMARY,
} from "@/features/referrals/data/referrals.activity.data";
import {
  MOCK_RECENT_REFERRALS,
  MOCK_REFERRAL_OVERVIEW,
  MOCK_REFERRAL_PERFORMANCE,
  MOCK_REFERRAL_PROMOTERS,
  MOCK_TOP_REFERRERS,
} from "@/features/referrals/data/referrals.overview.data";

export const metadata: Metadata = { title: "Referral Overview | Hosté Admin" };

export default function ReferralsPage() {
  return (
    <>
      <Toaster />
      <ReferralsOverview
        summary={MOCK_REFERRAL_OVERVIEW}
        topReferrers={MOCK_TOP_REFERRERS}
        promoters={MOCK_REFERRAL_PROMOTERS}
        activity={MOCK_RECENT_REFERRALS}
        chartData={MOCK_REFERRAL_PERFORMANCE}
        activityRecords={MOCK_ACTIVITY_REFERRALS}
        activityPromoters={MOCK_ACTIVITY_PROMOTERS}
        activitySummary={MOCK_ACTIVITY_SUMMARY}
      />
    </>
  );
}
