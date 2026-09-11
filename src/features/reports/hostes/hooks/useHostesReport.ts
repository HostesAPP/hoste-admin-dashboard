"use client";

import { useState, useMemo } from "react";
import type {
  HostesReportFilterParams,
  HosteDirectoryItem,
  HosteGrowthTab,
} from "../types/hostes.types";
import {
  HOSTE_REPORT_KPI_METRICS,
  HOSTE_GROWTH_DATA,
  HOSTE_VERIFICATION_DATA,
  HOSTE_ACCOUNT_STATUS_DATA,
  BOOKING_PERFORMANCE_METRICS,
  EARNINGS_OVERVIEW_METRICS,
  TOP_PERFORMING_HOSTES_DATA,
  HOSTE_DIRECTORY_TABLE_DATA,
} from "../data/hostes.data";

export function useHostesReport(initialFilters?: Partial<HostesReportFilterParams>) {
  const [filters, setFilters] = useState<HostesReportFilterParams>({
    verification: initialFilters?.verification || "All",
    accountStatus: initialFilters?.accountStatus || "All",
    booking: initialFilters?.booking || "All",
    type: initialFilters?.type || "All Types",
    rating: initialFilters?.rating || "4.0+",
    search: initialFilters?.search || "",
    dateRange: initialFilters?.dateRange || "30 Days",
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 5,
  });

  const [activeGrowthTab, setActiveGrowthTab] = useState<HosteGrowthTab>("Total Hostés");
  const [selectedHoste, setSelectedHoste] = useState<HosteDirectoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredDirectory = useMemo(() => {
    return HOSTE_DIRECTORY_TABLE_DATA.filter((item) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const match =
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query);
        if (!match) return false;
      }

      if (filters.verification && filters.verification !== "All") {
        if (item.verification !== filters.verification) return false;
      }

      if (filters.accountStatus && filters.accountStatus !== "All") {
        if (item.accountStatus !== filters.accountStatus) return false;
      }

      if (filters.rating && filters.rating !== "All") {
        const minRating = parseFloat(filters.rating.replace("+", ""));
        if (!isNaN(minRating) && item.rating < minRating) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 2100;
  const filteredCount = filteredDirectory.length;
  const totalPages = Math.ceil(filteredCount / filters.pageSize) || 1;

  const paginatedDirectory = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredDirectory.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredDirectory, filters.page, filters.pageSize]);

  const updateFilters = (newFilters: Partial<HostesReportFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      verification: "All",
      accountStatus: "All",
      booking: "All",
      type: "All Types",
      rating: "4.0+",
      search: "",
      dateRange: "30 Days",
      page: 1,
      pageSize: 5,
    });
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const viewHosteDetails = (hoste: HosteDirectoryItem) => {
    setSelectedHoste(hoste);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: HOSTE_REPORT_KPI_METRICS,
    growthData: HOSTE_GROWTH_DATA,
    verificationData: HOSTE_VERIFICATION_DATA,
    accountStatusData: HOSTE_ACCOUNT_STATUS_DATA,
    bookingPerformance: BOOKING_PERFORMANCE_METRICS,
    earningsOverview: EARNINGS_OVERVIEW_METRICS,
    topPerformers: TOP_PERFORMING_HOSTES_DATA,
    hostesDirectory: paginatedDirectory,
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
    selectedHoste,
    isDetailOpen,
    setIsDetailOpen,
    viewHosteDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
