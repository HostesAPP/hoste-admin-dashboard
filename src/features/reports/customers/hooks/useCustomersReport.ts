"use client";

import { useState, useMemo } from "react";
import {
  CUSTOMER_KPI_METRICS,
  CUSTOMER_GROWTH_DATA,
  CUSTOMER_BOOKING_PERFORMANCE_DATA,
  CUSTOMER_SPENDING_OVERVIEW_DATA,
  TOP_CUSTOMERS_DATA,
  CUSTOMER_DIRECTORY_DATA,
} from "../data/customers.data";
import type {
  CustomerGrowthTab,
  CustomerDirectoryItem,
  CustomerReportFilterParams,
} from "../types/customers.types";

const INITIAL_FILTERS: CustomerReportFilterParams = {
  status: "All",
  booking: "All",
  type: "All Types",
  spend: "₦0 - ₦100M+",
  search: "",
  dateRange: "This Month",
  page: 1,
  pageSize: 4,
};

export function useCustomersReport() {
  const [filters, setFilters] = useState<CustomerReportFilterParams>(INITIAL_FILTERS);
  const [activeGrowthTab, setActiveGrowthTab] = useState<CustomerGrowthTab>("Total Customers");
  const [selectedCustomer, setSelectedCustomer] = useState<CustomerDirectoryItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const updateFilters = (newFilters: Partial<CustomerReportFilterParams>) => {
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
    return CUSTOMER_DIRECTORY_DATA.filter((item) => {
      // Search
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(query);
        const matchesEmail = item.email.toLowerCase().includes(query);
        const matchesCity = item.city?.toLowerCase().includes(query);
        if (!matchesName && !matchesEmail && !matchesCity) return false;
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

      // Type / Tier
      if (filters.type !== "All Types") {
        if (filters.type === "VIP" && !item.tier?.includes("VIP")) return false;
        if (filters.type === "Corporate" && !item.tier?.includes("Corporate")) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 18420; // Total count from PRD / screenshot display
  const totalPages = Math.ceil(filteredDirectory.length / filters.pageSize) || 2;
  const paginatedDirectory = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredDirectory.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredDirectory, filters.page, filters.pageSize]);

  const viewCustomerDetails = (customer: CustomerDirectoryItem) => {
    setSelectedCustomer(customer);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: CUSTOMER_KPI_METRICS,
    growthData: CUSTOMER_GROWTH_DATA,
    bookingPerformance: CUSTOMER_BOOKING_PERFORMANCE_DATA,
    spendingOverview: CUSTOMER_SPENDING_OVERVIEW_DATA,
    topCustomers: TOP_CUSTOMERS_DATA,
    customerDirectory: paginatedDirectory,
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
    selectedCustomer,
    isDetailOpen,
    setIsDetailOpen,
    viewCustomerDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
