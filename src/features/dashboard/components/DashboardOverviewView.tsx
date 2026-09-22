// features/dashboard/components/DashboardOverviewView.tsx

"use client";

import React, { useState } from "react";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardKpiCards } from "./DashboardKpiCards";
import { DashboardRevenueChartCard } from "./DashboardRevenueChartCard";
import { DashboardBookingOverviewCard } from "./DashboardBookingOverviewCard";
import { DashboardActionRequiredSection } from "./DashboardActionRequiredSection";
import { DashboardRecentBookingsTable } from "./DashboardRecentBookingsTable";
import { DashboardQuickActionsCard } from "./DashboardQuickActionsCard";
import { DashboardRecentActivityCard } from "./DashboardRecentActivityCard";
import { useDashboardOverview } from "../hooks/dashboard.hooks";
import { MOCK_DASHBOARD_OVERVIEW_DATA } from "../data/dashboard.data";

export function DashboardOverviewView() {
  const [dateRange, setDateRange] = useState("This Month");
  const {
    data: dashboardData = MOCK_DASHBOARD_OVERVIEW_DATA,
    isLoading,
    isError,
    refetch,
  } = useDashboardOverview();

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Full width container without max-width restriction */}
      {/* Top Header */}
      <DashboardHeader
        dateRange={dateRange}
        onDateRangeChange={setDateRange}
      />

      <div className="w-full px-6 space-y-6 pb-8">
        {/* Error notification banner if query failed */}
        {isError && (
          <div className="bg-destructive/10 border border-destructive/20 rounded-2xl p-4 flex items-center justify-between gap-4 text-xs">
            <span className="text-destructive font-medium">
              Failed to load live dashboard metrics. Showing cached preview.
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

        {/* 1. KPI Metric Cards */}
        <section>
          <DashboardKpiCards kpis={dashboardData.kpis} isLoading={isLoading} />
        </section>

        {/* 2. Charts & Pipeline Row (2 Columns: ~66% Revenue Chart, ~33% Booking Overview) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-stretch">
          <div className="lg:col-span-8">
            <DashboardRevenueChartCard
              totalRevenue={dashboardData.revenueOverview.totalRevenue}
              growthText={dashboardData.revenueOverview.growthText}
              chartData={dashboardData.revenueOverview.chartData}
              isLoading={isLoading}
            />
          </div>

          <div className="lg:col-span-4">
            <DashboardBookingOverviewCard
              pipeline={dashboardData.bookingPipeline}
              isLoading={isLoading}
            />
          </div>
        </section>

        {/* 3. Action Required 3-Card Banner */}
        <DashboardActionRequiredSection
          items={dashboardData.actionsRequired}
          isLoading={isLoading}
        />

        {/* 4. Bottom Row: Recent Bookings Table (~66%) + Quick Actions & Recent Activity (~33%) */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Table (~66%) */}
          <div className="lg:col-span-8">
            <DashboardRecentBookingsTable
              bookings={dashboardData.recentBookings}
              isLoading={isLoading}
            />
          </div>

          {/* Right Column (~33%) */}
          <div className="lg:col-span-4 space-y-5">
            <DashboardQuickActionsCard />
            <DashboardRecentActivityCard
              activities={dashboardData.recentActivities}
              isLoading={isLoading}
            />
          </div>
        </section>
      </div>
    </div>
  );
}
