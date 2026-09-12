"use client";

import React from "react";
import { PlatformActivityReportHeader } from "./PlatformActivityReportHeader";
import { PlatformActivityKpiCards } from "./PlatformActivityKpiCards";
import { PlatformActivityOverviewChart } from "./PlatformActivityOverviewChart";
import { PlatformActivityGrid } from "./PlatformActivityGrid";
import { RecentPlatformActivityTable } from "./RecentPlatformActivityTable";
import { PlatformActivityDetailsDialog } from "./PlatformActivityDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";
import { usePlatformActivityReport } from "../hooks/usePlatformActivityReport";

export const PlatformActivityReportView: React.FC = () => {
  const {
    filters,
    kpis,
    chartData,
    userBreakdown,
    engagementSparkline,
    bookingVelocityData,
    platformAreaData,
    logs,
    totalLogsCount,
    currentPage,
    totalPages,
    pageSize,
    selectedLog,
    isDetailsOpen,
    isExportOpen,
    setIsDetailsOpen,
    setIsExportOpen,
    handleFilterChange,
    handleResetFilters,
    setCurrentPage,
    handleViewLog,
  } = usePlatformActivityReport();

  return (
    <div className="space-y-6 pb-12 p-6">
      {/* Header */}
      <PlatformActivityReportHeader
        selectedRange={filters.timeRange}
        onRangeChange={(range) => handleFilterChange({ timeRange: range })}
        onExport={() => setIsExportOpen(true)}
      />

      {/* KPI Cards (6 items) */}
      <PlatformActivityKpiCards kpis={kpis} />

      {/* Platform Activity Overview (Area chart) */}
      <PlatformActivityOverviewChart
        data={chartData}
        selectedMetric={filters.metricTab}
        onSelectMetric={(tab) => handleFilterChange({ metricTab: tab })}
      />

      {/* Middle 2x2 Grid (User Breakdown, Engagement, Booking Velocity, Platform Area) */}
      <PlatformActivityGrid
        userBreakdown={userBreakdown}
        engagementSparkline={engagementSparkline}
        bookingVelocityData={bookingVelocityData}
        platformAreaData={platformAreaData}
      />

      {/* Recent Platform Activity Log Table */}
      <RecentPlatformActivityTable
        logs={logs}
        totalCount={totalLogsCount}
        currentPage={currentPage}
        totalPages={totalPages}
        pageSize={pageSize}
        filters={filters}
        onFilterChange={handleFilterChange}
        onResetFilters={handleResetFilters}
        onPageChange={setCurrentPage}
        onViewLog={handleViewLog}
      />

      {/* Activity Details Dialog */}
      <PlatformActivityDetailsDialog
        log={selectedLog}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />

      {/* Export Report Modal */}
      <ExportReportModal
        open={isExportOpen}
        onOpenChange={setIsExportOpen}
        transactions={REPORT_TRANSACTIONS}
      />
    </div>
  );
};
