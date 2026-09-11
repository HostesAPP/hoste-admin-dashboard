"use client";

import React from "react";
import {
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Tooltip,
  AreaChart,
  Area,
} from "recharts";
import type {
  HosteVerificationBreakdownItem,
  HosteAccountStatusBlock,
  BookingPerformanceData,
  EarningsOverviewData,
} from "../types/hostes.types";

interface HostesAnalyticsGridProps {
  verificationData: HosteVerificationBreakdownItem[];
  accountStatusData: HosteAccountStatusBlock[];
  bookingPerformance: BookingPerformanceData;
  earningsOverview: EarningsOverviewData;
}

export const HostesAnalyticsGrid: React.FC<HostesAnalyticsGridProps> = ({
  verificationData,
  accountStatusData,
  bookingPerformance,
  earningsOverview,
}) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* 1. Verification Overview */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Verification Overview
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            KYC compliance, background checks, and identity verification status
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="relative w-36 h-36 shrink-0 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Tooltip
                  formatter={(val, name) => [`${Number(val).toLocaleString()} hostés`, String(name)]}
                  contentStyle={{
                    backgroundColor: "#1A1A1A",
                    borderRadius: "0.75rem",
                    border: "1px solid rgba(255,255,255,0.1)",
                    fontSize: "0.75rem",
                    color: "#FFFFFF",
                  }}
                  itemStyle={{ color: "#FFFFFF" }}
                />
                <Pie
                  data={verificationData}
                  dataKey="count"
                  nameKey="name"
                  innerRadius={44}
                  outerRadius={60}
                  paddingAngle={3}
                  stroke="none"
                >
                  {verificationData.map((entry) => (
                    <Cell key={entry.name} fill={entry.color} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-lg font-extrabold text-foreground tracking-tight">
                80%
              </span>
              <span className="text-[9px] font-bold text-muted-foreground uppercase">
                Verified
              </span>
            </div>
          </div>

          <div className="flex-1 space-y-2 w-full text-xs">
            {verificationData.map((item) => (
              <div
                key={item.name}
                className="flex items-center justify-between gap-2"
              >
                <div className="flex items-center gap-2">
                  <span
                    className="w-2 h-2 rounded-full shrink-0"
                    style={{ backgroundColor: item.color }}
                  />
                  <span className="font-semibold text-foreground">
                    {item.name}
                  </span>
                </div>
                <span className="text-muted-foreground font-medium text-right text-[11px]">
                  {item.count.toLocaleString()} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* 2. Hosté Account Status */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Hosté Account Status
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Administrative status and platform standing of host accounts
          </p>
        </div>

        <div className="grid grid-cols-2 gap-3">
          {accountStatusData.map((block) => (
            <div
              key={block.status}
              className="p-3.5 bg-muted/25 border border-border/70 rounded-xl flex items-center justify-between"
            >
              <div className="space-y-1">
                <span
                  className={`inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold border ${block.badgeClass}`}
                >
                  {block.label}
                </span>
                <div className="text-xl font-extrabold text-foreground">
                  {block.count.toLocaleString()}
                </div>
              </div>

              <span className="text-sm font-bold text-muted-foreground">
                {block.percentage}%
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* 3. Booking Performance */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Booking Performance
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Fulfillment efficiency and booking volume handled by Hostés
          </p>
        </div>

        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Total Bookings
            </span>
            <div className="text-base font-extrabold text-foreground mt-0.5">
              {bookingPerformance.totalBookings}
            </div>
          </div>

          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Confirmed Bookings
            </span>
            <div className="text-base font-extrabold text-foreground mt-0.5">
              {bookingPerformance.confirmedBookings}
            </div>
          </div>

          <div className="p-2.5 bg-secondary/10 border border-secondary/20 rounded-xl text-secondary">
            <span className="text-[10px] font-semibold">
              Completed Bookings
            </span>
            <div className="text-base font-extrabold text-secondary mt-0.5">
              {bookingPerformance.completedBookings}
            </div>
          </div>

          <div className="p-2.5 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive">
            <span className="text-[10px] font-semibold">
              Cancelled Bookings
            </span>
            <div className="text-base font-extrabold text-destructive mt-0.5">
              {bookingPerformance.cancelledBookings}
            </div>
          </div>

          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Avg Bookings / Hosté
            </span>
            <div className="text-base font-extrabold text-foreground mt-0.5">
              {bookingPerformance.avgBookingsPerHoste}
            </div>
          </div>

          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Completion Rate
            </span>
            <div className="text-base font-extrabold text-secondary mt-0.5">
              {bookingPerformance.completionRate}
            </div>
          </div>
        </div>

        {/* Velocity Mini Sparkline */}
        <div className="space-y-1 pt-1">
          <span className="text-[11px] font-semibold text-muted-foreground">
            Booking Performance Velocity over Time
          </span>
          <div className="w-full h-14">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={bookingPerformance.velocityPoints}>
                <defs>
                  <linearGradient id="velocityGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone"
                  dataKey="val"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  fill="url(#velocityGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* 4. Earnings Overview */}
      <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between space-y-4">
        <div>
          <h3 className="text-base font-bold text-foreground">
            Earnings Overview (NGN ₦)
          </h3>
          <p className="text-xs text-muted-foreground mt-0.5">
            Payout distribution and financial yields generated across booking types
          </p>
        </div>

        {/* 3 Top Stat Boxes */}
        <div className="grid grid-cols-3 gap-2.5 text-xs">
          <div className="p-2.5 bg-primary/5 border border-primary/30 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Total Hosté Earnings
            </span>
            <div className="text-sm sm:text-base font-extrabold text-primary mt-0.5">
              {earningsOverview.totalEarnings}
            </div>
          </div>

          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Avg Earnings / Hosté
            </span>
            <div className="text-sm sm:text-base font-extrabold text-foreground mt-0.5">
              {earningsOverview.avgEarningsPerHoste}
            </div>
          </div>

          <div className="p-2.5 bg-muted/30 border border-border/70 rounded-xl">
            <span className="text-[10px] text-muted-foreground font-semibold">
              Avg Booking Value
            </span>
            <div className="text-sm sm:text-base font-extrabold text-secondary mt-0.5">
              {earningsOverview.avgBookingValue}
            </div>
          </div>
        </div>

        {/* Earnings Breakdown by Booking Type */}
        <div className="space-y-2 pt-1 text-xs">
          <span className="text-[11px] font-bold text-foreground">
            Earnings Breakdown by Booking Type
          </span>
          <div className="space-y-2">
            {earningsOverview.breakdown.map((item) => (
              <div key={item.type} className="space-y-1">
                <div className="flex items-center justify-between text-[11px]">
                  <span className="text-muted-foreground font-medium">
                    {item.type}
                  </span>
                  <span className="font-bold text-foreground">
                    {item.amount}
                  </span>
                </div>
                <div className="w-full h-2 rounded-full bg-muted overflow-hidden">
                  <div
                    className={`h-full ${item.colorClass}`}
                    style={{ width: `${item.percentage}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
