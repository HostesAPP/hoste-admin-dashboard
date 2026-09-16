// features/revenue/components/RevenuePerformanceChartCard.tsx

"use client";

import React, { useState } from "react";
import {
  ResponsiveContainer,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import { RevenueTimeframe, RevenuePerformancePoint } from "../revenue.types";

interface RevenuePerformanceChartCardProps {
  totalRevenue: string;
  growthText: string;
  chartData: Record<RevenueTimeframe, RevenuePerformancePoint[]>;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: RevenuePerformancePoint;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-card text-foreground px-3.5 py-2 rounded-xl shadow-lg border border-border text-xs space-y-1">
        <p className="text-[11px] text-muted-foreground font-medium">{point.date}, 2026</p>
        <p className="font-bold text-secondary">
          Revenue: <span className="font-extrabold">{point.formattedRev}</span>
        </p>
      </div>
    );
  }
  return null;
};

interface CustomizedDotProps {
  cx?: number;
  cy?: number;
  payload?: RevenuePerformancePoint;
}

const CustomizedPeakDot: React.FC<CustomizedDotProps> = ({ cx, cy, payload }) => {
  if (payload?.isPeak && cx && cy) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={4.5} fill="var(--secondary)" stroke="var(--card)" strokeWidth={2} />
      </g>
    );
  }
  return null;
};

export function RevenuePerformanceChartCard({
  totalRevenue,
  growthText,
  chartData,
}: RevenuePerformanceChartCardProps) {
  const [timeframe, setTimeframe] = useState<RevenueTimeframe>("Weekly");

  const currentData = chartData[timeframe] || chartData.Weekly;

  const formatYAxis = (val: number) => {
    if (val === 0) return "₦0";
    if (val === 4850000) return "₦4,850,000";
    if (val === 3600000) return "₦3,600,000";
    if (val === 2400000) return "₦2,400,000";
    if (val === 1200000) return "₦1,200,000";
    if (val >= 1000000) return `₦${(val / 1000000).toFixed(1)}M`;
    return `₦${val.toLocaleString()}`;
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full">
      {/* Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <h2 className="text-xs font-bold text-foreground">Revenue Performance</h2>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {totalRevenue}
            </span>
            <span className="text-xs font-semibold text-secondary">
              {growthText}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5 font-normal">
            compared with the previous period
          </p>
        </div>

        {/* Timeframe Switcher */}
        <div className="inline-flex items-center p-1 rounded-xl bg-muted/60 border border-border/60 self-start sm:self-auto">
          {(["Daily", "Weekly", "Monthly"] as RevenueTimeframe[]).map((tab) => {
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
          <LineChart
            data={currentData}
            margin={{ top: 10, right: 10, left: 10, bottom: 0 }}
          >
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
              orientation="left"
              tickFormatter={formatYAxis}
              tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              domain={[0, 4850000]}
              ticks={[1200000, 2400000, 3600000, 4850000]}
              dx={-5}
            />

            <Tooltip content={<CustomTooltip />} />

            <Line
              type="linear"
              dataKey="revenue"
              stroke="var(--secondary)"
              strokeWidth={2.5}
              dot={<CustomizedPeakDot />}
              activeDot={{
                r: 5,
                fill: "var(--secondary)",
                stroke: "var(--card)",
                strokeWidth: 2,
              }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
