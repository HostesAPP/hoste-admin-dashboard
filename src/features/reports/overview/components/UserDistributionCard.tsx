"use client";

import React from "react";
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip } from "recharts";
import type { UserDistributionItem } from "../types/overview.types";

interface UserDistributionCardProps {
  data: UserDistributionItem[];
  totalUsers?: number;
}

export const UserDistributionCard: React.FC<UserDistributionCardProps> = ({
  data,
  totalUsers = 9482,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div>
        <h2 className="text-base font-bold text-foreground">
          User & Business Distribution
        </h2>
        <p className="text-xs text-muted-foreground mt-0.5">
          Breakdown of {totalUsers.toLocaleString()} total platform users
        </p>
      </div>

      {/* Donut Chart and Legend Row */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-4 py-1">
        {/* Donut Chart with Center Text */}
        <div className="relative w-44 h-44 shrink-0 flex items-center justify-center">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Tooltip
                formatter={(val, name) => [`${Number(val).toLocaleString()} users`, String(name)]}
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
                data={data}
                dataKey="count"
                nameKey="name"
                innerRadius={50}
                outerRadius={68}
                paddingAngle={3}
                stroke="none"
              >
                {data.map((entry) => (
                  <Cell key={entry.name} fill={entry.color} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>

          {/* Center Info Text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-lg font-extrabold text-foreground tracking-tight">
              {totalUsers.toLocaleString()}
            </span>
            <span className="text-[10px] font-medium text-muted-foreground">
              Total Users
            </span>
          </div>
        </div>

        {/* Legend List */}
        <div className="flex-1 space-y-2.5 w-full text-xs">
          {data.map((item) => (
            <div
              key={item.name}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2.5 h-2.5 rounded-xs shrink-0"
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
  );
};
