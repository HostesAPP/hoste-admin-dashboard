"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import {
  ResponsiveContainer,
  ComposedChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import type {
  CustomerGrowthPoint,
  CustomerGrowthTab,
} from "../types/customers.types";

interface CustomersGrowthChartProps {
  data: CustomerGrowthPoint[];
  activeTab: CustomerGrowthTab;
  onTabChange: (tab: CustomerGrowthTab) => void;
}

const TABS: CustomerGrowthTab[] = [
  "Total Customers",
  "New Customers",
  "Active Customers",
  "Inactive Customers",
];

export const CustomersGrowthChart: React.FC<CustomersGrowthChartProps> = ({
  data,
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Customer Growth &amp; Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Real-time user cohort trends over selected timeframe
          </CardDescription>
        </div>

        {/* Tab Pills */}
        <div className="flex items-center gap-1 bg-muted/40 p-1 rounded-xl border border-border/60 overflow-x-auto">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => onTabChange(tab)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all cursor-pointer ${
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

      <CardContent className="pt-2 pb-5 space-y-4">
        <div className="h-64 sm:h-72 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart
              data={data}
              margin={{ top: 15, right: 15, left: -20, bottom: 0 }}
            >
              <defs>
                <linearGradient id="customerOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF5A22" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF5A22" stopOpacity={0.0} />
                </linearGradient>
                <linearGradient id="customerGreenGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#006837" stopOpacity={0.2} />
                  <stop offset="95%" stopColor="#006837" stopOpacity={0.0} />
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
                domain={[0, 20000]}
                ticks={[0, 5000, 10000, 15000, 20000]}
                tickFormatter={(val) => (val >= 1000 ? `${(val / 1000).toFixed(0)}k` : `${val}`)}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as CustomerGrowthPoint;
                    return (
                      <div className="bg-zinc-900 text-white rounded-xl p-3 shadow-xl text-xs space-y-1.5 border border-zinc-700 min-w-40">
                        <p className="text-[11px] font-semibold text-zinc-400">
                          {pt.label ? `${pt.label}, 2026` : "Aug 19, 2026"}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                          <span className="font-semibold text-zinc-300">Total:</span>
                          <span className="font-bold text-white ml-auto">
                            {pt.totalCumulative.toLocaleString()}
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-secondary inline-block shrink-0" />
                          <span className="font-semibold text-zinc-300">Active:</span>
                          <span className="font-bold text-white ml-auto">
                            {pt.activeCustomers.toLocaleString()}
                          </span>
                        </div>
                        {pt.newRegistrations && (
                          <div className="flex items-center gap-1.5 pt-0.5 border-t border-zinc-800 text-[10px]">
                            <span className="w-2 h-2 rounded bg-amber-400/80 inline-block shrink-0" />
                            <span className="text-zinc-400">New Registrations:</span>
                            <span className="font-bold text-amber-300 ml-auto">
                              +{pt.newRegistrations}
                            </span>
                          </div>
                        )}
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="monotone"
                dataKey="totalCumulative"
                name="Total Customers"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#customerOrangeGrad)"
              />
              <Area
                type="monotone"
                dataKey="activeCustomers"
                name="Active Customers"
                stroke="var(--secondary)"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#customerGreenGrad)"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-medium text-foreground">Total Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="font-medium text-foreground">Active Customers</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-2 rounded-xs bg-amber-500/40 border border-amber-500/60" />
            <span className="font-medium text-foreground">New Registrations Volume</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
