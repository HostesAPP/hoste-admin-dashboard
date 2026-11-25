// features/dashboard/hooks/dashboard.hooks.ts

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "../api/dashboard.api";
import type { DashboardTimeframe } from "../dashboard.types";

export function useDashboardOverview(timeframe: DashboardTimeframe = "Daily") {
  return useQuery({
    queryKey: ["dashboard-overview", timeframe],
    queryFn: () => fetchDashboardOverview(timeframe),
    placeholderData: (previousData) => previousData,
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
}
