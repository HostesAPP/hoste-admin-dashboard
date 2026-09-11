"use client";

import { useState, useMemo } from "react";
import {
  GROUPS_KPI_METRICS,
  GROUPS_GROWTH_DATA,
  GROUP_MEMBERSHIP_OVERVIEW_DATA,
  GROUP_BOOKING_REVENUE_DATA,
  GROUP_STATUS_DATA,
  TOP_PERFORMING_GROUPS_DATA,
  ALL_GROUPS_DIRECTORY_DATA,
} from "../data/groups.data";
import type {
  GroupGrowthTab,
  GroupDirectoryItem,
  GroupsReportFilterParams,
} from "../types/groups.types";

const INITIAL_FILTERS: GroupsReportFilterParams = {
  status: "All",
  bookings: "All",
  size: "All Sizes",
  searchLeader: "",
  dateRange: "30 Days",
  page: 1,
  pageSize: 7,
};

export function useGroupsReport() {
  const [filters, setFilters] = useState<GroupsReportFilterParams>(INITIAL_FILTERS);
  const [activeGrowthTab, setActiveGrowthTab] = useState<GroupGrowthTab>("New Groups");
  const [selectedGroup, setSelectedGroup] = useState<GroupDirectoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const updateFilters = (newFilters: Partial<GroupsReportFilterParams>) => {
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
    return ALL_GROUPS_DIRECTORY_DATA.filter((item) => {
      // Search Leader / Group Name
      if (filters.searchLeader.trim()) {
        const query = filters.searchLeader.toLowerCase();
        const matchesName = item.groupName.toLowerCase().includes(query);
        const matchesLeader = item.groupLeader.toLowerCase().includes(query);
        if (!matchesName && !matchesLeader) return false;
      }

      // Status
      if (filters.status !== "All" && item.status !== filters.status) {
        return false;
      }

      // Size
      if (filters.size !== "All Sizes") {
        if (filters.size === "2-5 Members" && (item.members < 2 || item.members > 5)) return false;
        if (filters.size === "6-10 Members" && (item.members < 6 || item.members > 10)) return false;
        if (filters.size === "11-20 Members" && (item.members < 11 || item.members > 20)) return false;
        if (filters.size === "20+ Members" && item.members <= 20) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 1248; // Total count from PRD / screenshot display
  const totalPages = 3;
  const paginatedDirectory = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredDirectory.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredDirectory, filters.page, filters.pageSize]);

  const viewGroupDetails = (group: GroupDirectoryItem) => {
    setSelectedGroup(group);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: GROUPS_KPI_METRICS,
    growthData: GROUPS_GROWTH_DATA,
    membershipOverview: GROUP_MEMBERSHIP_OVERVIEW_DATA,
    bookingRevenueData: GROUP_BOOKING_REVENUE_DATA,
    groupStatusData: GROUP_STATUS_DATA,
    topPerformingGroups: TOP_PERFORMING_GROUPS_DATA,
    groupDirectory: paginatedDirectory,
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
    selectedGroup,
    isDetailOpen,
    setIsDetailOpen,
    viewGroupDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
