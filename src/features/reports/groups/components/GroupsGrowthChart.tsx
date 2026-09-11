"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
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
import type { GroupGrowthPoint, GroupGrowthTab } from "../types/groups.types";

interface GroupsGrowthChartProps {
  data: GroupGrowthPoint[];
  activeTab: GroupGrowthTab;
  onTabChange: (tab: GroupGrowthTab) => void;
}

const TABS: GroupGrowthTab[] = [
  "Total Groups",
  "New Groups",
  "Active Groups",
  "Inactive Groups",
];

export const GroupsGrowthChart: React.FC<GroupsGrowthChartProps> = ({
  data,
  activeTab,
  onTabChange,
}) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card">
      <CardHeader className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 gap-3">
        <div>
          <CardTitle className="text-base font-bold text-foreground">
            Group Growth &amp; Activity
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground mt-0.5">
            Track group registration and active engagement trends over time
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
                <linearGradient id="groupOrangeGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#EF5A22" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="#EF5A22" stopOpacity={0.0} />
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
                domain={[0, 200]}
                ticks={[0, 50, 100, 150, 200]}
              />
              <Tooltip
                content={({ active, payload }) => {
                  if (active && payload && payload.length) {
                    const pt = payload[0].payload as GroupGrowthPoint;
                    return (
                      <div className="bg-zinc-900 text-white rounded-xl p-3 shadow-xl text-xs space-y-1.5 border border-zinc-700 min-w-36">
                        <p className="text-[11px] font-semibold text-zinc-400">
                          {pt.label ? `${pt.label}, 2026` : "Aug 14, 2026"}
                        </p>
                        <div className="flex items-center gap-1.5">
                          <span className="w-2 h-2 rounded-full bg-primary inline-block shrink-0" />
                          <span className="font-bold text-white">
                            {pt.newGroupsCreated} New Groups
                          </span>
                        </div>
                        <div className="flex items-center gap-1.5 text-zinc-300 text-[11px]">
                          <span className="w-2 h-2 rounded-full bg-secondary inline-block shrink-0" />
                          <span>Active: {pt.activeBookingGroups} Groups</span>
                        </div>
                      </div>
                    );
                  }
                  return null;
                }}
              />
              <Area
                type="natural"
                dataKey="newGroupsCreated"
                name="New Groups Created"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#groupOrangeGrad)"
              />
              <Line
                type="natural"
                dataKey="activeBookingGroups"
                name="Active Booking Groups"
                stroke="var(--secondary)"
                strokeWidth={2}
                strokeDasharray="3 3"
                dot={false}
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>

        {/* Legend */}
        <div className="flex flex-wrap items-center gap-6 pt-1 text-xs text-muted-foreground">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-primary" />
            <span className="font-medium text-foreground">New Groups Created</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-secondary" />
            <span className="font-medium text-foreground">Active Booking Groups</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
