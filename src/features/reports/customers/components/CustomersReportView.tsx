"use client";

import React from "react";
import { useCustomersReport } from "../hooks/useCustomersReport";
import { CustomersReportHeader } from "./CustomersReportHeader";
import { CustomersFilterBar } from "./CustomersFilterBar";
import { CustomersKpiCards } from "./CustomersKpiCards";
import { CustomersGrowthChart } from "./CustomersGrowthChart";
import { CustomersBookingAndSpendingGrid } from "./CustomersBookingAndSpendingGrid";
import { TopCustomers } from "./TopCustomers";
import { CustomersDirectoryTable } from "./CustomersDirectoryTable";
import { CustomerDetailsDialog } from "./CustomerDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const CustomersReportView: React.FC = () => {
  const {
    kpiMetrics,
    growthData,
    bookingPerformance,
    spendingOverview,
    topCustomers,
    customerDirectory,
    totalCount,
    currentPage,
    totalPages,
    pageSize,
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
  } = useCustomersReport();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4 max-w-[1600px] mx-auto w-full">
        {/* Header & Date Selector */}
        <CustomersReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* Filters Bar */}
        <CustomersFilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        {/* 6 KPI Cards */}
        <CustomersKpiCards metrics={kpiMetrics} />

        {/* Growth & Activity Cohort Chart */}
        <CustomersGrowthChart
          data={growthData}
          activeTab={activeGrowthTab}
          onTabChange={setActiveGrowthTab}
        />

        {/* 2-Column Grid: Booking Performance (Left) + Spending Overview (Right) */}
        <CustomersBookingAndSpendingGrid
          bookingPerformance={bookingPerformance}
          spendingOverview={spendingOverview}
        />

        {/* Top Customers */}
        <TopCustomers
          customers={topCustomers}
          customerDirectory={customerDirectory}
          onSelectCustomer={viewCustomerDetails}
        />

        {/* Customer Directory Table */}
        <CustomersDirectoryTable
          customers={customerDirectory}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          filters={filters}
          onPageChange={setPage}
          onViewDetails={viewCustomerDetails}
        />

        {/* Details Dialog */}
        <CustomerDetailsDialog
          customer={selectedCustomer}
          isOpen={isDetailOpen}
          onOpenChange={setIsDetailOpen}
        />

        {/* Export Report Modal */}
        <ExportReportModal
          open={isExportOpen}
          onOpenChange={setIsExportOpen}
          transactions={REPORT_TRANSACTIONS}
        />
      </main>
    </div>
  );
};
