import { useQuery } from "@tanstack/react-query";
import { ReferralsApi } from "../referrals.api";
import type { ReferralParams } from "../types/referrals.types";
import type { ReferrersParams } from "../types/referrers.types";
import type { PayoutParams } from "../types/payouts.types";
import type { EarningsParams } from "../types/earnings.types";

export function useReferrals(params: ReferralParams) {
  return useQuery({
    queryKey: ["referrals", "list", params],
    queryFn: () => ReferralsApi.getReferrals(params),
  });
}

export function useReferralOverview(days: number) {
  return useQuery({
    queryKey: ["referrals", "overview", days],
    queryFn: () => ReferralsApi.getReferralOverview(days),
  });
}

export function useTopReferrers(page: number, limit: number) {
  return useQuery({
    queryKey: ["referrers", "list", page, limit],
    queryFn: () => ReferralsApi.getTopReferrers(page, limit),
  });
}

export function useReferrers(params: ReferrersParams) {
  return useQuery({
    queryKey: ["referrals", "referrers", params],
    queryFn: () => ReferralsApi.getReferrers(params),
  });
}
export function usePayouts(params: PayoutParams) {
  return useQuery({
    queryKey: ["referrals", "payouts", params],
    queryFn: () => ReferralsApi.getPayouts(params),
  });
}
export function useEarnings(params: EarningsParams) {
  return useQuery({
    queryKey: ["referrals", "earnings", params],
    queryFn: () => ReferralsApi.getEarnings(params),
  });
}
