"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ResponsiveContainer, LineChart, Line } from "recharts";
import type {
  BrandBookingPerformanceData,
  BrandSpendingBreakdownData,
} from "../types/brand-users.types";

interface BrandBookingAndSpendingGridProps {
  bookingPerformance: BrandBookingPerformanceData;
  spendingBreakdown: BrandSpendingBreakdownData;
}

export const BrandBookingAndSpendingGrid: React.FC<BrandBookingAndSpendingGridProps> = ({
  bookingPerformance,
  spendingBreakdown,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Booking Performance Card */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Booking Performance
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Brand User booking volumes and status distribution
          </p>
        </CardHeader>
        <CardContent className="space-y-4 pt-1">
          {/* 4 Metric Columns */}
          <div className="grid grid-cols-4 gap-2">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                TOTAL BOOKINGS
              </p>
              <p className="text-xl sm:text-2xl font-bold text-foreground">
                {bookingPerformance.totalBookings}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                CONFIRMED
              </p>
              <p className="text-xl sm:text-2xl font-bold text-blue-600">
                {bookingPerformance.confirmed}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                COMPLETED
              </p>
              <p className="text-xl sm:text-2xl font-bold text-secondary">
                {bookingPerformance.completed}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                CANCELLED
              </p>
              <p className="text-xl sm:text-2xl font-bold text-destructive mt-0.5">
                {bookingPerformance.cancelled}
              </p>
            </div>
          </div>

          {/* Average Bookings Banner */}
          <div className="flex items-center justify-between p-3 rounded-xl bg-muted/30 border border-border/70 text-xs">
            <div className="flex items-center gap-1">
              <span className="text-muted-foreground font-medium">
                Average Bookings per Brand User:
              </span>
              <span className="font-bold text-primary">
                1.61 Bookings / Month
              </span>
            </div>
            <span className="font-semibold text-secondary">
              ↑ 0.2 vs prev 30d
            </span>
          </div>

          {/* Booking Trend Visual */}
          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs text-muted-foreground whitespace-nowrap">
              Booking Trend Visual:
            </span>
            <div className="h-9 flex-1">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={bookingPerformance.trendPoints}>
                  <Line
                    type="monotone"
                    dataKey="val"
                    stroke="var(--primary)"
                    strokeWidth={2.5}
                    dot={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Spending & Revenue Breakdown Card */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card">
        <CardHeader className="pb-3">
          <CardTitle className="text-base font-bold text-foreground">
            Spending &amp; Revenue Breakdown
          </CardTitle>
          <p className="text-xs text-muted-foreground">
            Financial contribution by Hosté booking type
          </p>
        </CardHeader>
        <CardContent className="space-y-2">
          {/* Top 2 Big Numbers */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                TOTAL SPENDING
              </p>
              <p className="text-xl sm:text-2xl font-bold text-secondary">
                {spendingBreakdown.totalSpending}
              </p>
            </div>
            <div>
              <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider">
                PLATFORM REVENUE (COMMISSION)
              </p>
              <p className="text-xl sm:text-2xl font-bold text-primary">
                {spendingBreakdown.platformRevenue}
              </p>
            </div>
          </div>

          {/* 3 Rows of Breakdown */}
          <div className="divide-y divide-border/60 text-xs whitespace-nowrap">
            {spendingBreakdown.breakdown.map((item) => (
              <div
                key={item.type}
                className="py-2 flex items-center justify-between gap-2 whitespace-nowrap"
              >
                <span className="font-semibold text-foreground min-w-37.5">
                  {item.type}
                </span>
                <span className="text-muted-foreground text-center flex-1">
                  {item.bookingsCount} Bookings
                </span>
                <span className="font-bold text-foreground text-right min-w-22.5">
                  {item.amount}
                </span>
                <span className="text-muted-foreground text-right min-w-11.25">
                  {item.percentage}%
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
