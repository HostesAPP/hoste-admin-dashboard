// features/dashboard/hooks/dashboard.hooks.ts

import { useQuery } from "@tanstack/react-query";
import { fetchDashboardOverview } from "../api/dashboard.api";

export function useDashboardOverview() {
  return useQuery({
    queryKey: ["dashboard-overview"],
    queryFn: () => fetchDashboardOverview(),
    staleTime: 1000 * 60 * 5, // 5 minutes cache
  });
}
