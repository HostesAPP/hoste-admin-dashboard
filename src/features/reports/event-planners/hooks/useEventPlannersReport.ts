"use client";

import { useState, useMemo } from "react";
import {
  EVENT_PLANNER_KPI_METRICS,
  EVENT_PLANNER_GROWTH_DATA,
  BOOKING_PERFORMANCE_DATA,
  SPENDING_OVERVIEW_DATA,
  TOP_PERFORMING_EVENT_PLANNERS,
  EVENT_PLANNER_DIRECTORY_DATA,
} from "../data/event-planners.data";
import type {
  EventPlannerGrowthTab,
  EventPlannerDirectoryItem,
  EventPlannerReportFilterParams,
} from "../types/event-planners.types";

const INITIAL_FILTERS: EventPlannerReportFilterParams = {
  status: "All",
  booking: "All",
  type: "All Types",
  spend: "₦0 - ₦500M+",
  search: "",
  dateRange: "This Month",
  page: 1,
  pageSize: 4,
};

export function useEventPlannersReport() {
  const [filters, setFilters] = useState<EventPlannerReportFilterParams>(INITIAL_FILTERS);
  const [activeGrowthTab, setActiveGrowthTab] = useState<EventPlannerGrowthTab>("Total Event Planners");
  const [selectedPlanner, setSelectedPlanner] = useState<EventPlannerDirectoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const updateFilters = (newFilters: Partial<EventPlannerReportFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: newFilters.page ?? 1,
    }));
  };

  const resetFilters = () => {
    setFilters(INITIAL_FILTERS);
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  // Filter directory items
  const filteredDirectory = useMemo(() => {
    return EVENT_PLANNER_DIRECTORY_DATA.filter((item) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesAgency = item.agencyType?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesAgency) return false;
      }

      // Status
      if (filters.status !== "All" && item.status !== filters.status) {
        return false;
      }

      // Booking range
      if (filters.booking !== "All") {
        if (filters.booking === "1-5 Bookings" && (item.bookings < 1 || item.bookings > 5)) return false;
        if (filters.booking === "6-20 Bookings" && (item.bookings < 6 || item.bookings > 20)) return false;
        if (filters.booking === "20+ Bookings" && item.bookings <= 20) return false;
      }

      // Type
      if (filters.type !== "All Types") {
        if (filters.type === "Wedding" && !item.agencyType?.includes("Wedding")) return false;
        if (filters.type === "Corporate" && !item.agencyType?.includes("Corporate") && !item.agencyType?.includes("Summits")) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 1480; // Total count from PRD / screenshot display
  const totalPages = Math.ceil(filteredDirectory.length / filters.pageSize) || 2;
  const paginatedDirectory = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredDirectory.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredDirectory, filters.page, filters.pageSize]);

  const viewPlannerDetails = (planner: EventPlannerDirectoryItem) => {
    setSelectedPlanner(planner);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: EVENT_PLANNER_KPI_METRICS,
    growthData: EVENT_PLANNER_GROWTH_DATA,
    bookingPerformance: BOOKING_PERFORMANCE_DATA,
    spendingOverview: SPENDING_OVERVIEW_DATA,
    topPerformers: TOP_PERFORMING_EVENT_PLANNERS,
    plannerDirectory: paginatedDirectory,
    totalCount,
    currentPage: filters.page,
    totalPages,
    pageSize: filters.pageSize,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    activeGrowthTab,
    setActiveGrowthTab,
    selectedPlanner,
    isDetailOpen,
    setIsDetailOpen,
    viewPlannerDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
