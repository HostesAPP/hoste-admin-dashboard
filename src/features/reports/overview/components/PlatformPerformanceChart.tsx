"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { PlatformPerformancePoint, PerformanceMetricTab } from "../types/overview.types";

interface PlatformPerformanceChartProps {
  data: PlatformPerformancePoint[];
  activeTab: PerformanceMetricTab;
  onTabChange: (tab: PerformanceMetricTab) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: PlatformPerformancePoint;
  }>;
}

const CustomTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const point = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-white/10 text-xs space-y-0.5 text-center">
        <p className="text-[11px] text-gray-300 font-medium">
          {point.label === "Aug 15" ? "Aug 12, 2026" : `${point.label}, 2026`}
        </p>
        <p className="text-sm font-extrabold text-white">
          {point.formattedCurrent}
        </p>
      </div>
    );
  }
  return null;
};

const TABS: PerformanceMetricTab[] = ["Revenue", "Bookings", "New Users", "Active Users"];

export const PlatformPerformanceChart: React.FC<PlatformPerformanceChartProps> = ({
  data,
  activeTab,
  onTabChange,
}) => {
  const formatYAxis = (val: number) => {
    if (val === 0) return "$0";
    return `$${val / 1000}k`;
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between h-full space-y-4">
      {/* Header & Segmented Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground">
          Platform Performance
        </h2>

        <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/60 self-start sm:self-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
                }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Chart Canvas */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              <linearGradient id="currentPeriodGrad" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.2} />
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
              dataKey="label"
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              dy={10}
            />

            <YAxis
              axisLine={false}
              tickLine={false}
              tick={{ fill: "var(--muted-foreground)", fontSize: 11 }}
              tickFormatter={formatYAxis}
              domain={[0, 100000]}
              ticks={[0, 25000, 50000, 75000, 100000]}
            />

            <Tooltip
              content={<CustomTooltip />}
              cursor={{ stroke: "var(--primary)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
            />

            {/* Current Period (Solid Orange Area) */}
            <Area
              type="monotone"
              dataKey="currentPeriod"
              name="Current Period"
              stroke="var(--primary)"
              strokeWidth={2.5}
              fillOpacity={1}
              fill="url(#currentPeriodGrad)"
              activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
            />

            {/* Previous Period (Dashed Green Line) */}
            <Line
              type="monotone"
              dataKey="previousPeriod"
              name="Previous Period"
              stroke="var(--secondary)"
              strokeWidth={2}
              strokeDasharray="4 4"
              dot={false}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex items-center gap-6 pt-2 text-xs font-medium text-muted-foreground border-t border-border/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
          <span>Current Period</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-4 h-0.5 border-t-2 border-dashed border-secondary shrink-0" />
          <span>Previous Period</span>
        </div>
      </div>
    </div>
  );
};
