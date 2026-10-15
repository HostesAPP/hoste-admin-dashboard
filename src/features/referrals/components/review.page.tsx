import { ReferralsOverview } from "@/features/referrals/components/referrals.overview";
import { Toaster } from "@/components/ui/sonner";
import { MOCK_PAYOUTS_DATA } from "@/features/referrals/data/payouts.data";
import {
  MOCK_REWARD_REFERRERS,
  MOCK_REWARDS_SNAPSHOT,
} from "@/features/referrals/data/rewards.data";
import {
  MOCK_DIRECTORY_REFERRERS,
  MOCK_REFERRER_HISTORY,
  MOCK_REFERRERS_SUMMARY,
} from "@/features/referrals/data/referrers.data";
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

export function ReviewPage() {
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
        directoryRows={MOCK_DIRECTORY_REFERRERS}
        directoryHistory={MOCK_REFERRER_HISTORY}
        directorySummary={MOCK_REFERRERS_SUMMARY}
        rewardsSnapshot={MOCK_REWARDS_SNAPSHOT}
        rewardReferrers={MOCK_REWARD_REFERRERS}
        payoutData={MOCK_PAYOUTS_DATA}
      />
    </>
  );
}
