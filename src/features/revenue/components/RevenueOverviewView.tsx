// features/revenue/components/RevenueOverviewView.tsx

"use client";

import React, { useState } from "react";
import { RevenueHeader } from "./RevenueHeader";
import { RevenueKpiCards } from "./RevenueKpiCards";
import { RevenuePerformanceChartCard } from "./RevenuePerformanceChartCard";
import { RevenueBySourceCard } from "./RevenueBySourceCard";
import { RecentTransactionsTableCard } from "./RecentTransactionsTableCard";
import { FinancialInsightsCard } from "./FinancialInsightsCard";
import { useRevenueOverview } from "../hooks/revenue.hooks";
import { MOCK_REVENUE_OVERVIEW_DATA } from "../data/revenue.data";

export function RevenueOverviewView() {
  const [dateRange, setDateRange] = useState("This Month");
  const {
    data: revenueData = MOCK_REVENUE_OVERVIEW_DATA,
    isLoading,
    isError,
    refetch,
  } = useRevenueOverview();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Full width container without max-width restriction */}
      <div className="w-full p-6 sm:p-8 space-y-6">
        {/* Top Header & Breadcrumbs */}
        <RevenueHeader
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
        />

        {/* Error Notification Banner */}
        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
            <span className="text-destructive font-medium">
              Failed to load live revenue metrics. Showing cached preview.
            </span>
            <button
              type="button"
              onClick={() => refetch()}
              className="px-3 py-1 bg-destructive text-destructive-foreground rounded-lg font-semibold hover:bg-destructive/90 transition-colors"
            >
              Retry
            </button>
          </div>
        )}

        {/* 1. Top KPI Summary Cards */}
        <section>
          <RevenueKpiCards kpis={revenueData.kpis} isLoading={isLoading} />
        </section>

        {/* 2. Charts Row (2 Columns: ~66% Revenue Performance Chart, ~33% Revenue by Source) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <RevenuePerformanceChartCard
              totalRevenue={revenueData.performance.totalRevenue}
              growthText={revenueData.performance.growthText}
              chartData={revenueData.performance.chartData}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-4">
            <RevenueBySourceCard
              sources={revenueData.sources}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* 3. Bottom Row: Recent Transactions Table (~66%) + Financial Insights (~33%) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          <div className="lg:col-span-8">
            <RecentTransactionsTableCard
              transactions={revenueData.transactions}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-4">
            <FinancialInsightsCard
              insights={revenueData.insights}
              isLoading={isLoading}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
