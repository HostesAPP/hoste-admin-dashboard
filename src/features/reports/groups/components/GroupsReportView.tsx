"use client";

import React from "react";
import { useGroupsReport } from "../hooks/useGroupsReport";
import { GroupsReportHeader } from "./GroupsReportHeader";
import { GroupsKpiCards } from "./GroupsKpiCards";
import { GroupsGrowthChart } from "./GroupsGrowthChart";
import { GroupMembershipAndRevenueGrid } from "./GroupMembershipAndRevenueGrid";
import { GroupStatusAndTopPerformersGrid } from "./GroupStatusAndTopPerformersGrid";
import { AllGroupsDirectoryTable } from "./AllGroupsDirectoryTable";
import { GroupDetailsDialog } from "./GroupDetailsDialog";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const GroupsReportView: React.FC = () => {
  const {
    kpiMetrics,
    growthData,
    membershipOverview,
    bookingRevenueData,
    groupStatusData,
    topPerformingGroups,
    groupDirectory,
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
    selectedGroup,
    isDetailOpen,
    setIsDetailOpen,
    viewGroupDetails,
    isExportOpen,
    setIsExportOpen,
  } = useGroupsReport();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4 max-w-[1600px] mx-auto w-full">
        {/* Header & Date Selector */}
        <GroupsReportHeader
          dateRange={filters.dateRange}
          onDateRangeChange={(dateRange) => updateFilters({ dateRange })}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards */}
        <GroupsKpiCards metrics={kpiMetrics} />

        {/* Group Growth & Activity Chart */}
        <GroupsGrowthChart
          data={growthData}
          activeTab={activeGrowthTab}
          onTabChange={setActiveGrowthTab}
        />

        {/* Row 1: Membership Overview (Left) + Booking & Revenue (Right) */}
        <GroupMembershipAndRevenueGrid
          membershipOverview={membershipOverview}
          bookingRevenueData={bookingRevenueData}
        />

        {/* Row 2: Status Donut Chart (Left) + Top Performing Groups (Right) */}
        <GroupStatusAndTopPerformersGrid
          statusData={groupStatusData}
          topGroups={topPerformingGroups}
          groupDirectory={groupDirectory}
          onSelectGroup={viewGroupDetails}
        />

        {/* All Groups Directory Table */}
        <AllGroupsDirectoryTable
          groups={groupDirectory}
          totalCount={totalCount}
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          filters={filters}
          onFilterChange={updateFilters}
          onResetFilters={resetFilters}
          onPageChange={setPage}
          onViewGroup={viewGroupDetails}
        />

        {/* Details Dialog */}
        <GroupDetailsDialog
          group={selectedGroup}
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
