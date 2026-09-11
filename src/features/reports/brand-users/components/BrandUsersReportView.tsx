"use client";

import React from "react";
import { useBrandUsersReport } from "../hooks/useBrandUsersReport";
import { BrandUsersReportHeader } from "./BrandUsersReportHeader";
import { BrandUsersKpiCards } from "./BrandUsersKpiCards";
import { BrandUsersGrowthChart } from "./BrandUsersGrowthChart";
import { BrandAccountStatusCard } from "./BrandAccountStatusCard";
import { BrandBookingAndSpendingGrid } from "./BrandBookingAndSpendingGrid";
import { TopPerformingBrandsTable } from "./TopPerformingBrandsTable";
import { BrandUsersDirectoryTable } from "./BrandUsersDirectoryTable";
import { BrandUserDetailsDialog } from "./BrandUserDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const BrandUsersReportView: React.FC = () => {
  const {
    kpiMetrics,
    growthData,
    accountStatusData,
    bookingPerformance,
    spendingBreakdown,
    topPerformers,
    brandDirectory,
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
    selectedBrand,
    isDetailOpen,
    setIsDetailOpen,
    viewBrandDetails,
    isExportOpen,
    setIsExportOpen,
  } = useBrandUsersReport();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4">
        {/* Top Header */}
        <BrandUsersReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards in 1 Row */}
        <BrandUsersKpiCards metrics={kpiMetrics} />

        {/* Row: Growth & Activity Chart (Left) + Account Status Breakdown (Right) */}
        <div className="grid grid-cols-12 gap-4 items-stretch">
          <div className="col-span-8">
            <BrandUsersGrowthChart
              data={growthData}
              activeTab={activeGrowthTab}
              onTabChange={setActiveGrowthTab}
            />
          </div>
          <div className="col-span-4">
            <BrandAccountStatusCard data={accountStatusData} />
          </div>
        </div>

        {/* Row: Booking Performance (Left) + Spending & Revenue Breakdown (Right) */}
        <BrandBookingAndSpendingGrid
          bookingPerformance={bookingPerformance}
          spendingBreakdown={spendingBreakdown}
        />

        {/* Top Performing Brands */}
        <TopPerformingBrandsTable brands={topPerformers} />

        {/* Brand Directory Table */}
        <BrandUsersDirectoryTable
          brands={brandDirectory}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          onPageChange={setPage}
          onViewDetails={viewBrandDetails}
        />

        {/* Detail Dialog */}
        <BrandUserDetailsDialog
          brand={selectedBrand}
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
