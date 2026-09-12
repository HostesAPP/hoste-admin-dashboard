"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type {
  GroupStatusItem,
  TopPerformingGroupItem,
  GroupDirectoryItem,
} from "../types/groups.types";

interface GroupStatusAndTopPerformersGridProps {
  statusData: GroupStatusItem[];
  topGroups: TopPerformingGroupItem[];
  groupDirectory?: GroupDirectoryItem[];
  onSelectGroup?: (group: GroupDirectoryItem) => void;
}

export const GroupStatusAndTopPerformersGrid: React.FC<
  GroupStatusAndTopPerformersGridProps
> = ({ statusData, topGroups, groupDirectory, onSelectGroup }) => {
  const totalGroups = 1248;

  const handleViewGroup = (groupName: string) => {
    if (onSelectGroup && groupDirectory) {
      const found = groupDirectory.find(
        (g) => g.groupName.toLowerCase().includes(groupName.toLowerCase().slice(0, 5))
      );
      if (found) {
        onSelectGroup(found);
      }
    }
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-stretch">
      {/* Left Card: Group Status Breakdown (5 cols) */}
      <Card className="lg:col-span-5 rounded-2xl border border-border shadow-xs bg-card flex flex-col justify-between">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Group Status Breakdown
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Current state distribution all groups
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 pt-1 px-6 pb-6 flex-1 flex flex-col justify-between items-center">
          {/* Donut Chart with Center Text */}
          <div className="relative w-48 h-48 flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={statusData}
                  cx="50%"
                  cy="50%"
                  innerRadius={55}
                  outerRadius={78}
                  paddingAngle={3}
                  dataKey="count"
                >
                  {statusData.map((entry) => (
                    <Cell key={entry.status} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      const data = payload[0].payload as GroupStatusItem;
                      return (
                        <div className="bg-zinc-900 text-white rounded-lg p-2 text-xs border border-zinc-700 shadow-md">
                          <p className="font-semibold">{data.label}</p>
                          <p style={{ color: data.color }} className="font-bold">
                            {data.count} groups ({data.percentage}%)
                          </p>
                        </div>
                      );
                    }
                    return null;
                  }}
                />
              </PieChart>
            </ResponsiveContainer>

            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
              <span className="text-2xl font-extrabold text-foreground tracking-tight">
                {totalGroups.toLocaleString()}
              </span>
              <span className="text-[9px] font-bold text-muted-foreground tracking-wider uppercase">
                TOTAL GROUPS
              </span>
            </div>
          </div>

          {/* 4-Item Legend Grid */}
          <div className="grid grid-cols-2 gap-x-6 gap-y-2 w-full pt-1 text-xs">
            {statusData.map((item) => (
              <div key={item.status} className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-full shrink-0"
                  style={{ backgroundColor: item.color }}
                />
                <span className="text-xs text-muted-foreground">
                  <span className="font-semibold text-foreground">{item.label}:</span>{" "}
                  {item.count} ({item.percentage}%)
                </span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Right Card: Top Performing Groups (7 cols) */}
      <Card className="lg:col-span-7 rounded-2xl border border-border shadow-xs bg-card flex flex-col justify-between">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Top Performing Groups
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Ranked by revenue generation and booking frequency
          </CardDescription>
        </CardHeader>

        <CardContent className="p-0 flex-1 flex flex-col justify-between">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-muted/30 text-muted-foreground text-[10px] font-bold tracking-wider uppercase border-y border-border/70 whitespace-nowrap">
                <tr>
                  <th className="py-2.5 px-4">RANK</th>
                  <th className="py-2.5 px-4">GROUP NAME</th>
                  <th className="py-2.5 px-4">LEADER</th>
                  <th className="py-2.5 px-3">MEMBERS</th>
                  <th className="py-2.5 px-3">BOOKINGS</th>
                  <th className="py-2.5 px-4">REVENUE (₦)</th>
                  <th className="py-2.5 px-4 text-right">ACTION</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/60">
                {topGroups.map((group) => {
                  const rankBadgeClass =
                    group.rank === 1
                      ? "bg-primary text-primary-foreground"
                      : group.rank === 2
                      ? "bg-zinc-800 text-white"
                      : group.rank === 3
                      ? "bg-secondary text-secondary-foreground"
                      : "bg-slate-600 text-white";

                  return (
                    <tr
                      key={group.id}
                      className="hover:bg-muted/20 transition-colors"
                    >
                      <td className="py-3 px-4">
                        <span
                          className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${rankBadgeClass}`}
                        >
                          {group.rank}
                        </span>
                      </td>
                      <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">
                        {group.groupName}
                      </td>
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {group.leader}
                      </td>
                      <td className="py-3 px-3 font-medium text-muted-foreground">
                        {group.members}
                      </td>
                      <td className="py-3 px-3 font-semibold text-foreground">
                        {group.bookings}
                      </td>
                      <td className="py-3 px-4 font-bold text-secondary whitespace-nowrap">
                        {group.revenue}
                      </td>
                      <td className="py-3 px-4 text-right whitespace-nowrap">
                        <button
                          type="button"
                          onClick={() => handleViewGroup(group.groupName)}
                          className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer"
                        >
                          View Group
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
