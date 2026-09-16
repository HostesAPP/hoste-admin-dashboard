// features/revenue/components/FinancialInsightsCard.tsx

"use client";

import React from "react";
import { FinancialInsightsData } from "../revenue.types";

interface FinancialInsightsCardProps {
  insights: FinancialInsightsData;
}

export function FinancialInsightsCard({ insights }: FinancialInsightsCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-4">
      <h2 className="text-xs font-bold text-foreground">Financial Insights</h2>

      <div className="space-y-3.5 divide-y divide-border/40">
        {/* 1. Average Revenue per Booking */}
        <div className="space-y-1">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Average Revenue per Booking
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground block">
            {insights.averageRevenuePerBooking}
          </span>
        </div>

        {/* 2. Highest Revenue Day */}
        <div className="pt-3 space-y-1">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Highest Revenue Day
          </span>
          <span className="text-sm font-bold text-foreground block">
            {insights.highestRevenueDay.date} — {insights.highestRevenueDay.amount}
          </span>
        </div>

        {/* 3. Total Completed Bookings */}
        <div className="pt-3 space-y-1">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Total Completed Bookings
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground block">
            {insights.totalCompletedBookings}
          </span>
        </div>

        {/* 4. Cancelled Booking Value */}
        <div className="pt-3 space-y-1">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Cancelled Booking Value
          </span>
          <span className="text-xl font-bold tracking-tight text-foreground block">
            {insights.cancelledBookingValue}
          </span>
        </div>
      </div>
    </div>
  );
}
