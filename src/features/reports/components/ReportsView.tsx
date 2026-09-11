"use client";

import React from "react";
import { useReports } from "../hooks/useReports";
import { ReportsHeader } from "./ReportsHeader";
import { ReportsKpiCards } from "./ReportsKpiCards";
import { RevenuePerformanceChart } from "./RevenuePerformanceChart";
import { PaymentBreakdownCard } from "./PaymentBreakdownCard";
import { ReportsFilterBar } from "./ReportsFilterBar";
import { ReportsTransactionsTable } from "./ReportsTransactionsTable";
import { ReportsPagination } from "./ReportsPagination";
import { TransactionDetailsDialog } from "./TransactionDetailsDialog";
import { ExportReportModal } from "./ExportReportModal";

export const ReportsView: React.FC = () => {
  const {
    kpiMetrics,
    chartData,
    paymentBreakdown,
    bookingTypeBreakdown,
    transactions,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
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
  } = useReports();

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalCount);

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4">
        {/* Page Header */}
        <ReportsHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards */}
        <ReportsKpiCards metrics={kpiMetrics} />

        {/* Middle Charts & Analytics Section */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Revenue Performance Chart (2 cols on large screens) */}
          <div className="lg:col-span-2">
            <RevenuePerformanceChart
              data={chartData}
              activeView={chartView}
              onViewChange={setChartView}
            />
          </div>

          {/* Payment Status Breakdown & Booking Type (1 col) */}
          <div className="lg:col-span-1">
            <PaymentBreakdownCard
              statusBreakdown={paymentBreakdown}
              bookingTypeBreakdown={bookingTypeBreakdown}
            />
          </div>
        </div>

        {/* Filter Bar */}
        <ReportsFilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        {/* Transactions Table & Pagination Container */}
        <div className="space-y-3">
          <ReportsTransactionsTable
            transactions={transactions}
            onViewDetails={viewTransactionDetails}
          />

          <ReportsPagination
            currentPage={currentPage}
            totalTransactions={totalCount}
            startRange={startRange}
            endRange={Math.min(endRange, startRange + transactions.length - 1)}
            totalPages={totalPages}
            onPageChange={setPage}
          />
        </div>

        {/* Transaction Detail Dialog */}
        <TransactionDetailsDialog
          transaction={selectedTxn}
          open={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />

        {/* Export Report Modal */}
        <ExportReportModal
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          transactions={transactions}
        />
      </main>
    </div>
  );
};
