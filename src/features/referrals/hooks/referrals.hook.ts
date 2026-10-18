import { useQuery } from "@tanstack/react-query";
import { ReferralsApi } from "../referrals.api";

export function useReferrals(
  params: Record<string, string | number | boolean | null | undefined> = {},
) {
  return useQuery({
    queryKey: ["referrals", "list", params],
    queryFn: () => ReferralsApi.getReferrals(params),
  });
}

export function useReferralOverview() {
  return useQuery({
    queryKey: ["referrals", "overview"],
    queryFn: () => ReferralsApi.getReferralOverview(),
  });
}
