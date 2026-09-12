"use client";

import React from "react";
import { useReportsOverview } from "../hooks/useReportsOverview";
import { ReportsOverviewHeader } from "./ReportsOverviewHeader";
import { ReportsOverviewKpiCards } from "./ReportsOverviewKpiCards";
import { PlatformPerformanceChart } from "./PlatformPerformanceChart";
import { UserDistributionCard } from "./UserDistributionCard";
import { ReportCategoriesGrid } from "./ReportCategoriesGrid";
import { RecentReportsTable } from "./RecentReportsTable";
import { ExportReportModal } from "../../components/ExportReportModal";
import { REPORT_TRANSACTIONS } from "../../data/reports.data";

export const ReportsOverviewView: React.FC = () => {
  const {
    kpiMetrics,
    performanceData,
    userDistribution,
    categoryCards,
    recentReports,
    dateRange,
    setDateRange,
    activeTab,
    setActiveTab,
    isExportOpen,
    setIsExportOpen,
    handleDownloadReport,
  } = useReportsOverview();

  return (
    <div className="flex flex-col min-h-screen bg-background pb-12">
      <main className="px-6 space-y-6 pt-4">
        {/* Header */}
        <ReportsOverviewHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          onExportClick={() => setIsExportOpen(true)}
        />

        {/* 6 KPI Cards */}
        <ReportsOverviewKpiCards metrics={kpiMetrics} />

        {/* Middle Section: Platform Performance & User Distribution */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-stretch">
          {/* Platform Performance (2 cols) */}
          <div className="lg:col-span-2">
            <PlatformPerformanceChart
              data={performanceData}
              activeTab={activeTab}
              onTabChange={setActiveTab}
            />
          </div>

          {/* User Distribution Donut Card (1 col) */}
          <div className="lg:col-span-1">
            <UserDistributionCard data={userDistribution} />
          </div>
        </div>

        {/* 8 Report Categories Grid */}
        <ReportCategoriesGrid categories={categoryCards} />

        {/* Recently Generated Reports Table */}
        <RecentReportsTable
          reports={recentReports}
          onDownload={handleDownloadReport}
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
