"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { RevenueChartDataPoint, ChartMetricView } from "../types/reports.types";

interface RevenuePerformanceChartProps {
  data: RevenueChartDataPoint[];
  activeView: ChartMetricView;
  onViewChange: (view: ChartMetricView) => void;
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{
    value: number;
    name: string;
    payload: RevenueChartDataPoint;
  }>;
  label?: string;
}

const CustomChartTooltip: React.FC<CustomTooltipProps> = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const dataPoint = payload[0].payload;
    return (
      <div className="bg-[#1A1A1A] text-white px-3.5 py-2.5 rounded-xl shadow-lg border border-white/10 text-xs space-y-1">
        <p className="text-[11px] text-gray-300 font-medium">
          {dataPoint.label === "Today" ? "Aug 23, 2026" : `${dataPoint.label}, 2026`}
        </p>
        <p className="font-bold text-white">
          Rev: <span className="font-extrabold">{dataPoint.formattedRev}</span>
        </p>
        <p className="font-semibold text-primary">
          Comm: <span className="font-extrabold">{dataPoint.formattedComm}</span>
        </p>
      </div>
    );
  }
  return null;
};

export const RevenuePerformanceChart: React.FC<RevenuePerformanceChartProps> = ({
  data,
  activeView,
  onViewChange,
}) => {
  const formatYAxis = (value: number) => {
    if (value === 0) return "₦0";
    return `₦${value / 1000000}M`;
  };

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between h-full space-y-4">
      {/* Card Header: Title & Segmented Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <h2 className="text-base font-bold text-foreground">Revenue Performance</h2>

        {/* Metric View Segmented Control */}
        <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/60 self-start sm:self-auto">
          <button
            type="button"
            onClick={() => onViewChange("total")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === "total"
                ? "bg-secondary text-secondary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Total Revenue
          </button>
          <button
            type="button"
            onClick={() => onViewChange("commission")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === "commission"
                ? "bg-secondary text-secondary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Commission
          </button>
          <button
            type="button"
            onClick={() => onViewChange("earnings")}
            className={`px-3.5 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
              activeView === "earnings"
                ? "bg-secondary text-secondary-foreground shadow-xs"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Hosté Earnings
          </button>
        </div>
      </div>

      {/* Chart Area */}
      <div className="w-full h-64 pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={data}
            margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
          >
            <defs>
              {/* Secondary Green Gradient */}
              <linearGradient id="grossRevenueGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.25} />
                <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0} />
              </linearGradient>

              {/* Primary Orange Gradient */}
              <linearGradient id="commissionGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
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
              domain={[0, 80000000]}
              ticks={[0, 20000000, 40000000, 60000000, 80000000]}
            />

            <Tooltip
              content={<CustomChartTooltip />}
              cursor={{ stroke: "var(--secondary)", strokeWidth: 1.5, strokeDasharray: "4 4" }}
            />

            {/* Total Gross Revenue Area (Secondary Green) */}
            {(activeView === "total" || activeView === "earnings") && (
              <Area
                type="monotone"
                dataKey="grossRevenue"
                name="Total Gross Revenue"
                stroke="var(--secondary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#grossRevenueGradient)"
                activeDot={{ r: 5, fill: "var(--secondary)", stroke: "var(--card)", strokeWidth: 2 }}
              />
            )}

            {/* Hosté Commission Area (Primary Orange) */}
            {(activeView === "total" || activeView === "commission") && (
              <Area
                type="monotone"
                dataKey="commission"
                name="Hosté Commission (15%)"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#commissionGradient)"
                activeDot={{ r: 5, fill: "var(--primary)", stroke: "var(--card)", strokeWidth: 2 }}
              />
            )}
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Legend at Bottom */}
      <div className="flex items-center gap-6 pt-2 text-xs font-medium text-muted-foreground border-t border-border/40">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-secondary shrink-0" />
          <span>Total Gross Revenue</span>
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-primary shrink-0" />
          <span>Hosté Commission (15%)</span>
        </div>
      </div>
    </div>
  );
};
