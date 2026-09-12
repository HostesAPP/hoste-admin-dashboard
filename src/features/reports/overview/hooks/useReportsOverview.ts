"use client";

import { useState } from "react";
import type { PerformanceMetricTab, RecentReportItem } from "../types/overview.types";
import {
  OVERVIEW_KPI_METRICS,
  PLATFORM_PERFORMANCE_DATA,
  USER_DISTRIBUTION_DATA,
  REPORT_CATEGORY_CARDS,
  RECENT_REPORTS_DATA,
} from "../data/overview.data";

export function useReportsOverview() {
  const [dateRange, setDateRange] = useState("Last 30 Days (Jul 25 - Aug 23)");
  const [activeTab, setActiveTab] = useState<PerformanceMetricTab>("Revenue");
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleDownloadReport = (report: RecentReportItem) => {
    if (report.status !== "Ready") return;
    const blob = new Blob([`Report Content for ${report.name}`], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = report.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return {
    kpiMetrics: OVERVIEW_KPI_METRICS,
    performanceData: PLATFORM_PERFORMANCE_DATA,
    userDistribution: USER_DISTRIBUTION_DATA,
    categoryCards: REPORT_CATEGORY_CARDS,
    recentReports: RECENT_REPORTS_DATA,
    dateRange,
    setDateRange,
    activeTab,
    setActiveTab,
    isExportOpen,
    setIsExportOpen,
    handleDownloadReport,
  };
}
