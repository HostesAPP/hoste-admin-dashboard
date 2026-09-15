// features/dashboard/api/dashboard.api.ts

import { DashboardOverviewData } from "../dashboard.types";
import { MOCK_DASHBOARD_OVERVIEW_DATA } from "../data/dashboard.data";

export async function fetchDashboardOverview(): Promise<DashboardOverviewData> {
  // Simulates network latency for realistic API readiness
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_DASHBOARD_OVERVIEW_DATA);
    }, 100);
  });
}
