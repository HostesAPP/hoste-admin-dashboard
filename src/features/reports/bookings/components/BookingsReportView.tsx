"use client";

import React from "react";
import { useBookingsReport } from "../hooks/useBookingsReport";
import { BookingsReportHeader } from "./BookingsReportHeader";
import { BookingsKpiCards } from "./BookingsKpiCards";
import { BookingVolumeTrendsChart } from "./BookingVolumeTrendsChart";
import { BookingStatusBreakdownCard } from "./BookingStatusBreakdownCard";
import { BookingUserCategoryCards } from "./BookingUserCategoryCards";
import { BookingsFilterBar } from "./BookingsFilterBar";
import { BookingsReportTable } from "./BookingsReportTable";
import { BookingsPagination } from "./BookingsPagination";
import { BookingDetailsDialog } from "./BookingDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const BookingsReportView: React.FC = () => {
  const {
    kpiMetrics,
    volumeTrendsData,
    statusBreakdown,
    typePerformance,
    userCategories,
    bookings,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
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
  } = useBookingsReport();

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4">
        {/* Header */}
        <BookingsReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards */}
        <BookingsKpiCards metrics={kpiMetrics} />

        {/* Middle Section: Booking Volume Trends & Status Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Booking Volume Trends Chart (2 cols) */}
          <div className="lg:col-span-2">
            <BookingVolumeTrendsChart
              data={volumeTrendsData}
              activeTab={activeVolumeTab}
              onTabChange={setActiveVolumeTab}
            />
          </div>

          {/* Booking Status Breakdown (1 col) */}
          <div className="lg:col-span-1">
            <BookingStatusBreakdownCard
              statusBreakdown={statusBreakdown}
              typePerformance={typePerformance}
            />
          </div>
        </div>

        {/* Booking Volume by User Category (4 Cards in a Row) */}
        <BookingUserCategoryCards categories={userCategories} />

        {/* Filter Bar */}
        <BookingsFilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        {/* Bookings Table & Pagination */}
        <div className="space-y-3">
          <BookingsReportTable
            bookings={bookings}
            onViewBooking={viewBookingDetails}
          />

          <BookingsPagination
            currentPage={currentPage}
            totalRecords={totalCount}
            startRange={startRange}
            endRange={Math.min(endRange, startRange + bookings.length - 1)}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* Booking Details Dialog */}
        <BookingDetailsDialog
          booking={selectedBooking}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />

        {/* Export Modal */}
        <ExportReportModal
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          transactions={REPORT_TRANSACTIONS}
        />
      </main>
    </div>
  );
};
