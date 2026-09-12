"use client";

import { useState, useMemo } from "react";
import type {
  ReportFilterParams,
  ReportTransaction,
  ChartMetricView,
} from "../types/reports.types";
import {
  REPORT_KPI_METRICS,
  REVENUE_CHART_DATA,
  PAYMENT_STATUS_BREAKDOWN,
  BOOKING_TYPE_BREAKDOWN,
  REPORT_TRANSACTIONS,
} from "../data/reports.data";

export function useReports(initialFilters?: Partial<ReportFilterParams>) {
  const [filters, setFilters] = useState<ReportFilterParams>({
    search: initialFilters?.search || "",
    status: initialFilters?.status || "All",
    bookingType: initialFilters?.bookingType || "All",
    userType: initialFilters?.userType || "All",
    paymentMethod: initialFilters?.paymentMethod || "All",
    dateRange: initialFilters?.dateRange || "Last 30 Days (Jul 25 - Aug 23)",
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 8,
  });

  const [chartView, setChartView] = useState<ChartMetricView>("total");
  const [selectedTxn, setSelectedTxn] = useState<ReportTransaction | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredTransactions = useMemo(() => {
    return REPORT_TRANSACTIONS.filter((txn) => {
      // Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const matchSearch =
          txn.txnId.toLowerCase().includes(query) ||
          txn.customerName.toLowerCase().includes(query) ||
          txn.bookingId.toLowerCase().includes(query);
        if (!matchSearch) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "All" && filters.status !== "All Statuses") {
        if (txn.status !== filters.status) return false;
      }

      // Booking type filter
      if (filters.bookingType && filters.bookingType !== "All" && filters.bookingType !== "All Booking Types") {
        if (txn.bookingType !== filters.bookingType) return false;
      }

      // User type filter
      if (filters.userType && filters.userType !== "All" && filters.userType !== "All User Types") {
        if (txn.customerType !== filters.userType) return false;
      }

      // Payment method filter
      if (filters.paymentMethod && filters.paymentMethod !== "All" && filters.paymentMethod !== "All Payment Methods") {
        if (!txn.paymentMethod.toLowerCase().includes(filters.paymentMethod.toLowerCase())) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 1542; // Real total count as displayed in mockup
  const filteredCount = filteredTransactions.length;
  const totalPages = Math.ceil(filteredCount / filters.pageSize) || 1;

  const paginatedTransactions = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredTransactions.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredTransactions, filters.page, filters.pageSize]);

  const updateFilters = (newFilters: Partial<ReportFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1, // Reset to page 1 on filter changes
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      bookingType: "All",
      userType: "All",
      paymentMethod: "All",
      dateRange: "Last 30 Days (Jul 25 - Aug 23)",
      page: 1,
      pageSize: 8,
    });
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const viewTransactionDetails = (txn: ReportTransaction) => {
    setSelectedTxn(txn);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: REPORT_KPI_METRICS,
    chartData: REVENUE_CHART_DATA,
    paymentBreakdown: PAYMENT_STATUS_BREAKDOWN,
    bookingTypeBreakdown: BOOKING_TYPE_BREAKDOWN,
    transactions: paginatedTransactions,
    totalCount,
    filteredCount,
    currentPage: filters.page,
    totalPages,
    pageSize: filters.pageSize,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    chartView,
    setChartView,
    selectedTxn,
    isDetailOpen,
    setIsDetailOpen,
    viewTransactionDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
