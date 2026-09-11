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
  ReferenceLine,
  ReferenceDot,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type {
  PlatformActivityChartPoint,
  PlatformActivityMetricTab,
} from "../types/platform-activity.types";

interface PlatformActivityOverviewChartProps {
  data: PlatformActivityChartPoint[];
  selectedMetric: PlatformActivityMetricTab;
  onSelectMetric: (metric: PlatformActivityMetricTab) => void;
}

const METRIC_TABS: PlatformActivityMetricTab[] = [
  "Active Users",
  "New Users",
  "Bookings",
  "Transactions",
];

export const PlatformActivityOverviewChart: React.FC<
  PlatformActivityOverviewChartProps
> = ({ data, selectedMetric, onSelectMetric }) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card overflow-hidden">
      <CardHeader className="pb-2 px-6 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Platform Activity Overview
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground mt-0.5">
              Real-time volume and activity intensity across selected performance parameters
            </CardDescription>
          </div>

          {/* Segmented Metric Selector */}
          <div className="inline-flex items-center gap-1 p-1 bg-muted/40 rounded-xl border border-border/80">
            {METRIC_TABS.map((tab) => (
              <button
                key={tab}
                type="button"
                onClick={() => onSelectMetric(tab)}
                className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                  selectedMetric === tab
                    ? "text-primary font-bold bg-background shadow-xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-3">
        <div className="h-[290px] w-full relative">
          {/* Static Pin Callout as in design screenshot */}
          {selectedMetric === "Active Users" && (
            <div
              className="absolute z-10 -translate-x-1/2 pointer-events-none hidden md:block"
              style={{ left: "64.5%", top: "8%" }}
            >
              <div className="bg-dark text-dark-foreground text-xs rounded-xl px-3.5 py-1.5 shadow-2xl border border-white/10 text-center">
                <p className="text-[10px] text-muted-foreground font-medium leading-none">Aug 18, 2026</p>
                <p className="font-bold text-xs text-dark-foreground mt-1 leading-tight">1,820 Active Users</p>
              </div>
            </div>
          )}

          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 35, right: 15, left: -15, bottom: 0 }}
            >
              <defs>
                <linearGradient id="activityOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
                opacity={0.5}
              />
              <XAxis
                dataKey="label"
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                dy={6}
              />
              <YAxis
                tickLine={false}
                axisLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                tickFormatter={(val) => val.toLocaleString()}
                dx={-4}
                domain={[0, 2000]}
                ticks={[0, 500, 1000, 1500, 2000]}
              />
              <Tooltip
                content={({ active, payload, label }) => {
                  if (active && payload && payload.length) {
                    const current = payload.find((p) => p.dataKey === "currentPeriod");
                    return (
                      <div className="bg-dark text-dark-foreground text-xs rounded-xl px-3.5 py-2 shadow-2xl border border-white/10 text-center">
                        <p className="text-[10px] text-muted-foreground font-medium mb-0.5">{label}, 2026</p>
                        <p className="font-bold text-sm text-dark-foreground">
                          {current ? (current.value as number).toLocaleString() : 0} {selectedMetric}
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />

              {/* Vertical guideline at Aug 20 */}
              {selectedMetric === "Active Users" && (
                <>
                  <ReferenceLine
                    x="Aug 20"
                    stroke="var(--primary)"
                    strokeDasharray="3 3"
                    strokeWidth={1.5}
                    opacity={0.7}
                  />
                  <ReferenceDot
                    x="Aug 20"
                    y={1820}
                    r={5}
                    fill="var(--primary)"
                    stroke="var(--card)"
                    strokeWidth={2}
                  />
                </>
              )}

              {/* Previous Period Baseline (Dashed Green) */}
              <Area
                type="monotone"
                dataKey="previousPeriod"
                stroke="var(--secondary)"
                strokeWidth={2}
                strokeDasharray="4 4"
                fill="none"
              />
              {/* Current Period (Solid Orange with Gradient Fill) */}
              <Area
                type="monotone"
                dataKey="currentPeriod"
                stroke="var(--primary)"
                strokeWidth={2.8}
                fillOpacity={1}
                fill="url(#activityOrangeGrad)"
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center justify-center gap-6 pt-3 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary inline-block" />
            <span className="font-medium text-foreground">Current Period {selectedMetric}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary inline-block" />
            <span>Previous Period Baseline</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
