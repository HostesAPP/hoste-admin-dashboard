"use client";

import React from "react";
import { useEventPlannersReport } from "../hooks/useEventPlannersReport";
import { EventPlannersReportHeader } from "./EventPlannersReportHeader";
import { EventPlannersFilterBar } from "./EventPlannersFilterBar";
import { EventPlannersKpiCards } from "./EventPlannersKpiCards";
import { EventPlannersGrowthChart } from "./EventPlannersGrowthChart";
import { EventPlannersBookingAndSpendingGrid } from "./EventPlannersBookingAndSpendingGrid";
import { TopPerformingEventPlanners } from "./TopPerformingEventPlanners";
import { EventPlannersDirectoryTable } from "./EventPlannersDirectoryTable";
import { EventPlannerDetailsDialog } from "./EventPlannerDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const EventPlannersReportView: React.FC = () => {
  const {
    kpiMetrics,
    growthData,
    bookingPerformance,
    spendingOverview,
    topPerformers,
    plannerDirectory,
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
    selectedPlanner,
    isDetailOpen,
    setIsDetailOpen,
    viewPlannerDetails,
    isExportOpen,
    setIsExportOpen,
  } = useEventPlannersReport();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4 max-w-[1600px] mx-auto w-full">
        {/* Header & Date Selector */}
        <EventPlannersReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* Filters Bar */}
        <EventPlannersFilterBar
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
        />

        {/* 6 KPI Cards */}
        <EventPlannersKpiCards metrics={kpiMetrics} />

        {/* Growth & Activity Cohort Chart */}
        <EventPlannersGrowthChart
          data={growthData}
          activeTab={activeGrowthTab}
          onTabChange={setActiveGrowthTab}
        />

        {/* 2-Column Grid: Booking & Event Performance (Left) + Spending Overview (Right) */}
        <EventPlannersBookingAndSpendingGrid
          bookingPerformance={bookingPerformance}
          spendingOverview={spendingOverview}
        />

        {/* Top Performing Event Planners */}
        <TopPerformingEventPlanners
          planners={topPerformers}
          plannerDirectory={plannerDirectory}
          onSelectPlanner={viewPlannerDetails}
        />

        {/* Event Planner Directory Table */}
        <EventPlannersDirectoryTable
          planners={plannerDirectory}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          filters={filters}
          onPageChange={setPage}
          onViewDetails={viewPlannerDetails}
        />

        {/* Details Dialog */}
        <EventPlannerDetailsDialog
          planner={selectedPlanner}
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
