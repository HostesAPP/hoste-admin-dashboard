"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type { BrandGrowthPoint, BrandGrowthTab } from "../types/brand-users.types";

interface BrandUsersGrowthChartProps {
  data: BrandGrowthPoint[];
  activeTab: BrandGrowthTab;
  onTabChange: (tab: BrandGrowthTab) => void;
}

const TABS: BrandGrowthTab[] = ["Total Brands", "New Brands", "Active Brands", "Inactive"];

export const BrandUsersGrowthChart: React.FC<BrandUsersGrowthChartProps> = ({
  data,
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full flex flex-col justify-between">
      <CardHeader className="flex flex-row items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Brand User Growth &amp; Activity
          </CardTitle>
        </div>

        {/* Pill Selector */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>
      </CardHeader>

      <CardContent className="pt-2 pb-4 space-y-4 flex-1 flex flex-col justify-between">
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <defs>
                <linearGradient id="brandOrangeGrad" x1="0" y1="0" x2="0" y2="1">
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
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                domain={[0, 500]}
                ticks={[0, 125, 250, 375, 500]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const dataPoint = payload[0].payload as BrandGrowthPoint;
                    return (
                      <div className="bg-zinc-900 text-white rounded-xl p-2.5 shadow-lg text-xs space-y-1 border border-zinc-700 min-w-32.5">
                        <p className="text-[11px] font-medium text-zinc-400">
                          Aug 15, 2026
                        </p>
                        <p className="font-bold text-primary flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block" />
                          Total: {dataPoint.totalCumulative} Brands
                        </p>
                        <p className="font-semibold text-blue-400 flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-blue-400 inline-block" />
                          Active: {dataPoint.activeBooking} Brands
                        </p>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="totalCumulative"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#brandOrangeGrad)"
              />
              <Line
                type="monotone"
                dataKey="activeBooking"
                stroke="#3B82F6"
                strokeWidth={2}
                strokeDasharray="4 4"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex items-center gap-6 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-medium text-foreground">Total Cumulative Brands</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
            <span className="font-medium text-foreground">Active Booking Brands</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
