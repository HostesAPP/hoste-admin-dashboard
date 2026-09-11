"use client";

import { useState, useMemo } from "react";
import type {
  BookingReportFilterParams,
  BookingReportItem,
  BookingVolumeTab,
} from "../types/bookings.types";
import {
  BOOKING_REPORT_KPI_METRICS,
  BOOKING_VOLUME_TRENDS_DATA,
  BOOKING_STATUS_BREAKDOWN_DATA,
  BOOKING_TYPE_PERFORMANCE_DATA,
  BOOKING_USER_CATEGORIES_DATA,
  BOOKING_REPORT_TABLE_DATA,
} from "../data/bookings.data";

export function useBookingsReport(initialFilters?: Partial<BookingReportFilterParams>) {
  const [filters, setFilters] = useState<BookingReportFilterParams>({
    search: initialFilters?.search || "",
    status: initialFilters?.status || "All",
    bookingType: initialFilters?.bookingType || "All",
    userType: initialFilters?.userType || "All",
    paymentStatus: initialFilters?.paymentStatus || "All",
    hoste: initialFilters?.hoste || "All",
    dateRange: initialFilters?.dateRange || "Last 30 Days (Jul 25 - Aug 23)",
    page: initialFilters?.page || 1,
    pageSize: initialFilters?.pageSize || 7,
  });

  const [activeVolumeTab, setActiveVolumeTab] = useState<BookingVolumeTab>("Total Volume");
  const [selectedBooking, setSelectedBooking] = useState<BookingReportItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);

  const filteredBookings = useMemo(() => {
    return BOOKING_REPORT_TABLE_DATA.filter((bkg) => {
      // Search filter
      if (filters.search.trim()) {
        const query = filters.search.toLowerCase().trim();
        const match =
          bkg.bookingId.toLowerCase().includes(query) ||
          bkg.customerName.toLowerCase().includes(query) ||
          bkg.hosteName.toLowerCase().includes(query);
        if (!match) return false;
      }

      // Status filter
      if (filters.status && filters.status !== "All" && filters.status !== "All Statuses") {
        if (bkg.bookingStatus !== filters.status) return false;
      }

      // Booking Type filter
      if (filters.bookingType && filters.bookingType !== "All" && filters.bookingType !== "All Booking Types") {
        if (bkg.bookingType !== filters.bookingType) return false;
      }

      // User Type filter
      if (filters.userType && filters.userType !== "All" && filters.userType !== "All User Types") {
        if (bkg.customerType !== filters.userType) return false;
      }

      // Payment Status filter
      if (filters.paymentStatus && filters.paymentStatus !== "All" && filters.paymentStatus !== "All Statuses") {
        if (bkg.paymentStatus !== filters.paymentStatus) return false;
      }

      // Hoste filter
      if (filters.hoste && filters.hoste !== "All" && filters.hoste !== "All Hostés") {
        if (!bkg.hosteName.toLowerCase().includes(filters.hoste.toLowerCase())) return false;
      }

      return true;
    });
  }, [filters]);

  const totalCount = 1842;
  const filteredCount = filteredBookings.length;
  const totalPages = Math.ceil(filteredCount / filters.pageSize) || 1;

  const paginatedBookings = useMemo(() => {
    const startIndex = (filters.page - 1) * filters.pageSize;
    return filteredBookings.slice(startIndex, startIndex + filters.pageSize);
  }, [filteredBookings, filters.page, filters.pageSize]);

  const updateFilters = (newFilters: Partial<BookingReportFilterParams>) => {
    setFilters((prev) => ({
      ...prev,
      ...newFilters,
      page: 1,
    }));
  };

  const resetFilters = () => {
    setFilters({
      search: "",
      status: "All",
      bookingType: "All",
      userType: "All",
      paymentStatus: "All",
      hoste: "All",
      dateRange: "Last 30 Days (Jul 25 - Aug 23)",
      page: 1,
      pageSize: 7,
    });
  };

  const setPage = (page: number) => {
    setFilters((prev) => ({ ...prev, page }));
  };

  const viewBookingDetails = (bkg: BookingReportItem) => {
    setSelectedBooking(bkg);
    setIsDetailOpen(true);
  };

  return {
    kpiMetrics: BOOKING_REPORT_KPI_METRICS,
    volumeTrendsData: BOOKING_VOLUME_TRENDS_DATA,
    statusBreakdown: BOOKING_STATUS_BREAKDOWN_DATA,
    typePerformance: BOOKING_TYPE_PERFORMANCE_DATA,
    userCategories: BOOKING_USER_CATEGORIES_DATA,
    bookings: paginatedBookings,
    totalCount,
    currentPage: filters.page,
    totalPages,
    pageSize: filters.pageSize,
    filters,
    updateFilters,
    resetFilters,
    setPage,
    activeVolumeTab,
    setActiveVolumeTab,
    selectedBooking,
    isDetailOpen,
    setIsDetailOpen,
    viewBookingDetails,
    isExportOpen,
    setIsExportOpen,
  };
}
