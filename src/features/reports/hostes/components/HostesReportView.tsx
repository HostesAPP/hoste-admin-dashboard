"use client";

import React from "react";
import { useHostesReport } from "../hooks/useHostesReport";
import { HostesReportHeader } from "./HostesReportHeader";
import { HostesKpiCards } from "./HostesKpiCards";
import { HostesGrowthChart } from "./HostesGrowthChart";
import { HostesAnalyticsGrid } from "./HostesAnalyticsGrid";
import { TopPerformingHostesTable } from "./TopPerformingHostesTable";
import { HostesDirectoryTable } from "./HostesDirectoryTable";
import { HostesDetailsDialog } from "./HostesDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const HostesReportView: React.FC = () => {
  const {
    kpiMetrics,
    growthData,
    verificationData,
    accountStatusData,
    bookingPerformance,
    earningsOverview,
    topPerformers,
    hostesDirectory,
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
    selectedHoste,
    isDetailOpen,
    setIsDetailOpen,
    viewHosteDetails,
    isExportOpen,
    setIsExportOpen,
  } = useHostesReport();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4">
        {/* Header */}
        <HostesReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards */}
        <HostesKpiCards metrics={kpiMetrics} />

        {/* Hosté Growth & Activity Chart */}
        <HostesGrowthChart
          data={growthData}
          activeTab={activeGrowthTab}
          onTabChange={setActiveGrowthTab}
        />

        {/* 2x2 Analytics Grid */}
        <HostesAnalyticsGrid
          verificationData={verificationData}
          accountStatusData={accountStatusData}
          bookingPerformance={bookingPerformance}
          earningsOverview={earningsOverview}
        />

        {/* Top Performing Hostés */}
        <TopPerformingHostesTable topPerformers={topPerformers} />

        {/* Directory & Audit Table */}
        <HostesDirectoryTable
          directory={hostesDirectory}
          filters={filters}
          totalRecords={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          onPageChange={setPage}
          onViewHoste={viewHosteDetails}
        />

        {/* Details Dialog */}
        <HostesDetailsDialog
          hoste={selectedHoste}
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
