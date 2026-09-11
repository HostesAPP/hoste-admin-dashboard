"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from "recharts";
import type {
  BookingPerformanceData,
  SpendingOverviewData,
} from "../types/event-planners.types";

interface EventPlannersBookingAndSpendingGridProps {
  bookingPerformance: BookingPerformanceData;
  spendingOverview: SpendingOverviewData;
}

export const EventPlannersBookingAndSpendingGrid: React.FC<
  EventPlannersBookingAndSpendingGridProps
> = ({ bookingPerformance, spendingOverview }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* Left Card: Booking & Event Performance */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card py-0 flex flex-col justify-between">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Booking &amp; Event Performance
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4 pt-1 px-6 pb-2 flex-1 flex flex-col justify-between">
          {/* Row 1: Top 3 Metric Boxes */}
          <div className="grid grid-cols-3 gap-3">
            {/* Box 1: Confirmed */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                CONFIRMED
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {bookingPerformance.confirmed.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-secondary">
                  ({bookingPerformance.confirmedPercentage}%)
                </span>
              </div>
            </div>

            {/* Box 2: Avg Events / Planner (Orange title) */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                AVG EVENTS / PLANNER
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-1">
                {bookingPerformance.avgEventsPerPlanner}
              </p>
            </div>

            {/* Box 3: Avg Bookings / Planner (Orange title) */}
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                AVG BOOKINGS / PLANNER
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-1">
                {bookingPerformance.avgBookingsPerPlanner}
              </p>
            </div>
          </div>

          {/* Row 2: 2 Metric Boxes with Orange Borders */}
          <div className="grid grid-cols-2 gap-3">
            {/* Completed Events */}
            <div className="p-3.5 rounded-xl border border-primary bg-card">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                COMPLETED EVENTS
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg sm:text-xl font-bold text-foreground">
                  {bookingPerformance.completedEvents.toLocaleString()}
                </span>
                <span className="text-xs font-bold text-secondary">
                  ({bookingPerformance.completedPercentage}%)
                </span>
              </div>
            </div>

            {/* Cancelled */}
            <div className="p-3.5 rounded-xl border border-primary bg-card">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                CANCELLED
              </p>
              <div className="flex items-baseline gap-1.5 mt-1">
                <span className="text-lg sm:text-xl font-bold text-primary">
                  {bookingPerformance.cancelled.toLocaleString()}
                </span>
                <span className="text-xs font-semibold text-muted-foreground">
                  ({bookingPerformance.cancelledPercentage}%)
                </span>
              </div>
            </div>
          </div>

          {/* Weekly Trends Section: Bar Chart (Left) + Legend (Right) */}
          <div className="pt-2 space-y-2">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              BOOKING &amp; EVENT ACTIVITY TRENDS (WEEKLY)
            </p>

            <div className="flex items-center justify-between gap-4">
              {/* Left: Bar Chart */}
              <div className="h-32 flex-1 max-w-[65%]">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={bookingPerformance.weeklyTrends}
                    barGap={3}
                    margin={{ top: 10, right: 0, left: -25, bottom: 0 }}
                  >
                    <XAxis
                      dataKey="week"
                      axisLine={false}
                      tickLine={false}
                      tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                    />
                    <YAxis hide />
                    <Tooltip
                      content={({ active, payload }) => {
                        if (active && payload && payload.length) {
                          return (
                            <div className="bg-zinc-900 text-white rounded-lg p-2 text-xs border border-zinc-700 shadow-md">
                              <p className="font-semibold">{payload[0]?.payload?.week}</p>
                              <p className="text-primary font-medium">
                                Bookings: {payload[0]?.value}
                              </p>
                              <p className="text-secondary font-medium">
                                Completed: {payload[1]?.value}
                              </p>
                            </div>
                          );
                        }
                        return null;
                      }}
                    />
                    <Bar
                      dataKey="totalBookings"
                      fill="#EF5A22"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={16}
                    />
                    <Bar
                      dataKey="completedEvents"
                      fill="#006837"
                      radius={[3, 3, 0, 0]}
                      maxBarSize={16}
                    />
                  </BarChart>
                </ResponsiveContainer>
              </div>

              {/* Right: Vertical Legend */}
              <div className="space-y-2.5 pr-4 shrink-0">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-primary" />
                  <span className="text-xs font-medium text-foreground">
                    Total Bookings
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
                  <span className="text-xs font-medium text-foreground">
                    Completed Events
                  </span>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Card: Spending Overview & Account Status */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card flex flex-col">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Spending Overview &amp; Account Status
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 px-6 flex-1 flex flex-col">
          {/* Top 2 Average Metric Boxes */}
          <div className="grid grid-cols-2 gap-3">
            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                AVG SPEND / PLANNER
              </p>
              <p className="text-xl sm:text-2xl font-bold text-secondary mt-1">
                {spendingOverview.avgSpendPerPlanner}
              </p>
            </div>

            <div className="p-3.5 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                AVG BOOKING VALUE
              </p>
              <p className="text-xl sm:text-2xl font-bold text-secondary mt-1">
                {spendingOverview.avgBookingValue}
              </p>
            </div>
          </div>

          {/* Bottom Area: 2 Columns Side-by-Side (Spending Breakdown Left + Account Status Right) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 items-start pt-1">
            {/* Left Column: Spending Breakdown by Type */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                SPENDING BREAKDOWN BY TYPE
              </p>

              {/* Stacked Multi-Segment Progress Bar */}
              <div className="h-4 w-full rounded-md flex overflow-hidden bg-muted">
                {spendingOverview.spendingBreakdown.map((item) => (
                  <div
                    key={item.type}
                    style={{
                      width: `${item.percentage}%`,
                      backgroundColor: item.dotColor,
                    }}
                    className="h-full transition-all"
                    title={`${item.type}: ${item.percentage}%`}
                  />
                ))}
              </div>

              {/* Legend List */}
              <div className="space-y-1.5 pt-0.5 text-xs">
                {spendingOverview.spendingBreakdown.map((item) => (
                  <div key={item.type} className="flex items-center gap-1.5">
                    <span className="text-muted-foreground">•</span>
                    <span className="text-muted-foreground text-[11px]">
                      {item.type}:{" "}
                      <span className="font-bold text-foreground">
                        {item.percentage}%
                      </span>{" "}
                      <span className="text-muted-foreground">({item.amount})</span>
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Right Column: Account Status Breakdown */}
            <div className="space-y-2.5">
              <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                ACCOUNT STATUS BREAKDOWN
              </p>

              <div className="grid grid-cols-2 gap-2">
                {/* Active */}
                <div className="px-2.5 py-2 rounded-lg bg-emerald-500/10 text-emerald-700 dark:text-emerald-400 border border-emerald-500/20 text-xs font-semibold flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span>Active: 1,120</span>
                  </div>
                  <div className="text-right text-[11px] font-bold">
                    75.6%
                  </div>
                </div>

                {/* Pending */}
                <div className="px-2.5 py-2 rounded-lg bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20 text-xs font-semibold flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span>Pending: 180</span>
                  </div>
                  <div className="text-right text-[11px] font-bold">
                    12.2%
                  </div>
                </div>

                {/* Suspended */}
                <div className="px-2.5 py-2 rounded-lg bg-rose-500/10 text-rose-700 dark:text-rose-400 border border-rose-500/20 text-xs font-semibold flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span>Suspended: 32</span>
                  </div>
                  <div className="text-right text-[11px] font-bold">
                    2.2%
                  </div>
                </div>

                {/* Inactive */}
                <div className="px-2.5 py-2 rounded-lg bg-slate-500/10 text-slate-700 dark:text-slate-400 border border-slate-500/20 text-xs font-semibold flex flex-col justify-between">
                  <div className="flex items-center justify-between">
                    <span>Inactive: 148</span>
                  </div>
                  <div className="text-right text-[11px] font-bold">
                    10.0%
                  </div>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
