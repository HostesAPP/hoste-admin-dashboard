"use client";

import { useState, useMemo } from "react";
import type {
  BrandReportFilterParams,
  BrandDirectoryItem,
  BrandGrowthTab,
} from "../types/brand-users.types";
import {
  BRAND_REPORT_KPI_METRICS,
  BRAND_GROWTH_DATA,
  BRAND_ACCOUNT_STATUS_DATA,
  BRAND_BOOKING_PERFORMANCE,
  BRAND_SPENDING_BREAKDOWN,
  TOP_PERFORMING_BRANDS_DATA,
  BRAND_DIRECTORY_TABLE_DATA,
} from "../data/brand-users.data";

export function useBrandUsersReport(initialFilters?: Partial<BrandReportFilterParams>) {
  const [filters, setFilters] = useState<BrandReportFilterParams>({
    status: initialFilters?.status || "All Statuses",
    booking: initialFilters?.booking || "All Statuses",
    type: initialFilters?.type || "All Booking Types",
    spend: initialFilters?.spend || "All Ranges",
    brand: initialFilters?.brand || "All Brands",
    search: initialFilters?.search || "",
    dateRange: initialFilters?.dateRange || "Last 30 Days (Jul 25 - Aug 23)",
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 7,
  });

  const [activeGrowthTab, setActiveGrowthTab] = useState<BrandGrowthTab>("Total Brands");
  const [selectedBrand, setSelectedBrand] = useState<BrandDirectoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredDirectory = useMemo(() => {
    return BRAND_DIRECTORY_TABLE_DATA.filter((item) => {
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const match =
          item.name.toLowerCase().includes(query) ||
          item.email.toLowerCase().includes(query);
        if (!match) return false;
      }

      if (filters.status && filters.status !== "All" && filters.status !== "All Statuses") {
        if (item.status !== filters.status) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 482;
  const filteredCount = filteredDirectory.length;
  const totalPages = Math.ceil(filteredCount / filters.pageSize) || 1;

  const paginatedDirectory = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredDirectory.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredDirectory, filters.page, filters.pageSize]);

  const updateFilters = (newFilters: Partial<BrandReportFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      status: "All Statuses",
      booking: "All Statuses",
      type: "All Booking Types",
      spend: "All Ranges",
      brand: "All Brands",
      search: "",
      dateRange: "Last 30 Days (Jul 25 - Aug 23)",
      page: 1,
      pageSize: 7,
    });
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const viewBrandDetails = (brand: BrandDirectoryItem) => {
    setSelectedBrand(brand);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: BRAND_REPORT_KPI_METRICS,
    growthData: BRAND_GROWTH_DATA,
    accountStatusData: BRAND_ACCOUNT_STATUS_DATA,
    bookingPerformance: BRAND_BOOKING_PERFORMANCE,
    spendingBreakdown: BRAND_SPENDING_BREAKDOWN,
    topPerformers: TOP_PERFORMING_BRANDS_DATA,
    brandDirectory: paginatedDirectory,
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
    selectedBrand,
    isDetailOpen,
    setIsDetailOpen,
    viewBrandDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
