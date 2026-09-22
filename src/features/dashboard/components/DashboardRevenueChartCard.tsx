// features/dashboard/components/DashboardRevenueChartCard.tsx

"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { DashboardTimeframe, RevenueChartPoint } from "../dashboard.types";

interface DashboardRevenueChartCardProps {
  totalRevenue: string;
  growthText: string;
  chartData: Record<DashboardTimeframe, RevenueChartPoint[]>;
  isLoading?: boolean;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: RevenueChartPoint;
  }>;
}

const CustomRevenueTooltip: React.FC<CustomTooltipProps> = ({
  active,
  payload,
}) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-card text-foreground px-3.5 py-2 rounded-xl shadow-lg border border-border text-xs space-y-1">
        <p className="text-[11px] text-muted-foreground font-medium">{point.date}, 2026</p>
        <p className="font-bold text-primary">
          Revenue: <span className="font-extrabold">{point.formattedRev}</span>
        </p>
      </div>
    );
  }
  return null;
};

export function DashboardRevenueChartCard({
  totalRevenue,
  growthText,
  chartData,
  isLoading = false,
}: DashboardRevenueChartCardProps) {
  const [timeframe, setTimeframe] = useState<DashboardTimeframe>("Monthly");

  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-6 animate-pulse">
        <div className="flex items-center justify-between">
          <div className="space-y-2">
            <div className="h-3.5 w-28 bg-muted rounded" />
            <div className="flex items-center gap-2">
              <div className="h-7 w-36 bg-muted rounded-lg" />
              <div className="h-4 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="h-8 w-44 bg-muted rounded-xl" />
        </div>
        <div className="w-full h-64 sm:h-72 bg-muted/40 rounded-xl" />
      </div>
    );
  }

  const currentData = chartData[timeframe] || chartData.Monthly;

  const formatYAxis = (val: number) => {
    if (val === 0) return "₦0";
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    if (val >= 1000) return `₦${(val / 1000).toFixed(0)}K`;
    return `₦${val}`;
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full">
      {/* Top Header & Timeframe Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold text-foreground">Revenue Overview</h2>
          <div className="flex items-baseline gap-2.5 mt-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {totalRevenue}
            </span>
            <span className="text-xs font-semibold text-secondary">
              {growthText}
            </span>
          </div>
        </div>

        {/* Segmented Pill Tabs: Daily / Weekly / Monthly */}
        <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto">
          {(["Daily", "Weekly", "Monthly"] as DashboardTimeframe[]).map((tab) => {
            const isActive = timeframe === tab;
            return (
              <button
                key={tab}
                type="button"
                onClick={() => setTimeframe(tab)}
                className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  isActive
                    ? "bg-foreground text-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 sm:h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={currentData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.18} />
                <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
              </linearGradient>
            </defs>

            <CartesianGrid
              strokeDasharray="3 3"
              vertical={false}
              stroke="var(--border)"
              opacity={0.6}
            />

            <XAxis
              dataKey="date"
              axisLine={false}
              tickLine={false}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              orientation="right"
              tickFormatter={formatYAxis}
              tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              domain={[0, 6000000]}
              ticks={[1500000, 3000000, 4500000, 6000000]}
              dx={5}
            />

            <Tooltip content={<CustomRevenueTooltip />} />

            <Area
              type="monotone"
              dataKey="revenue"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#revenueFill)"
              dot={{
                r: 3.5,
                fill: "var(--primary)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
              activeDot={{
                r: 6,
                fill: "var(--primary)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
