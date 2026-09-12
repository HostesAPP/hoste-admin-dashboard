"use client";

import { useState, useMemo } from "react";
import type {
  ActivityTimeRange,
  PlatformActivityMetricTab,
  PlatformActivityFilterParams,
  PlatformActivityLogItem,
} from "../types/platform-activity.types";
import {
  PLATFORM_ACTIVITY_KPIS,
  PLATFORM_ACTIVITY_CHART_DATA,
  USER_ACTIVITY_BREAKDOWN_DATA,
  ENGAGEMENT_TREND_SPARKLINE,
  BOOKING_VELOCITY_DATA,
  PLATFORM_AREA_ACTIVITY_DATA,
  RECENT_ACTIVITY_LOGS,
} from "../data/platform-activity.data";

export const usePlatformActivityReport = () => {
  const [filters, setFilters] = useState<PlatformActivityFilterParams>({
    timeRange: "30 Days",
    metricTab: "Active Users",
    userType: "All Types",
    activityType: "All Events",
    status: "All",
    area: "All Areas",
    searchQuery: "",
  });

  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 7;
  const [selectedLog, setSelectedLog] = useState<PlatformActivityLogItem | null>(null);
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const handleFilterChange = (updates: Partial<PlatformActivityFilterParams>) => {
    setFilters((prev) => ({ ...prev, ...updates }));
    setCurrentPage(1);
  };

  const handleResetFilters = () => {
    setFilters({
      timeRange: "30 Days",
      metricTab: "Active Users",
      userType: "All Types",
      activityType: "All Events",
      status: "All",
      area: "All Areas",
      searchQuery: "",
    });
    setCurrentPage(1);
  };

  const filteredLogs = useMemo(() => {
    return RECENT_ACTIVITY_LOGS.filter((log) => {
      // User type filter
      if (filters.userType !== "All Types" && log.userType !== filters.userType) {
        return false;
      }
      // Activity type filter
      if (filters.activityType !== "All Events" && log.activityType !== filters.activityType) {
        return false;
      }
      // Status filter
      if (filters.status !== "All" && log.status !== filters.status) {
        return false;
      }
      // Area filter
      if (filters.area !== "All Areas" && log.area !== filters.area) {
        return false;
      }
      // Search query
      if (filters.searchQuery.trim()) {
        const q = filters.searchQuery.toLowerCase();
        const matchesDesc = log.activityDescription.toLowerCase().includes(q);
        const matchesUser = log.user.toLowerCase().includes(q);
        if (!matchesDesc && !matchesUser) return false;
      }
      return true;
    });
  }, [filters]);

  const totalCount = 18940; // Total platform audit count shown in screenshot
  const totalPages = Math.ceil(filteredLogs.length / pageSize) || 3;
  const paginatedLogs = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize;
    return filteredLogs.slice(startIndex, startIndex + pageSize);
  }, [filteredLogs, currentPage, pageSize]);

  const chartData = PLATFORM_ACTIVITY_CHART_DATA[filters.metricTab] || PLATFORM_ACTIVITY_CHART_DATA["Active Users"];

  const handleViewLog = (log: PlatformActivityLogItem) => {
    setSelectedLog(log);
    setIsDetailsOpen(true);
  };

  return {
    filters,
    kpis: PLATFORM_ACTIVITY_KPIS,
    chartData,
    userBreakdown: USER_ACTIVITY_BREAKDOWN_DATA,
    engagementSparkline: ENGAGEMENT_TREND_SPARKLINE,
    bookingVelocityData: BOOKING_VELOCITY_DATA,
    platformAreaData: PLATFORM_AREA_ACTIVITY_DATA,
    logs: paginatedLogs,
    totalLogsCount: totalCount,
    currentPage,
    totalPages,
    pageSize,
    selectedLog,
    isDetailsOpen,
    isExportOpen,
    setIsDetailsOpen,
    setIsExportOpen,
    handleFilterChange,
    handleResetFilters,
    setCurrentPage,
    handleViewLog,
  };
};
