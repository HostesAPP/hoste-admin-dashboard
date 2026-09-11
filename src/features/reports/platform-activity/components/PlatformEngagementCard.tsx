"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { EngagementTrendPoint } from "../types/platform-activity.types";

interface PlatformEngagementCardProps {
  sparklineData: EngagementTrendPoint[];
}

export const PlatformEngagementCard: React.FC<PlatformEngagementCardProps> = ({
  sparklineData,
}) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-3 px-6 pt-5">
        <CardTitle className=" font-bold text-foreground">
          Platform Engagement
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Key retention, sticky usage, and active session metrics
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-1 space-y-3.5 flex-1 flex flex-col justify-between">
        {/* Top 3 Metric Boxes */}
        <div className="grid grid-cols-3 gap-2.5">
          {/* DAU (Primary Brand Highlight) */}
          <div className="p-2.5 rounded-xl border border-primary/20 bg-primary/5 text-center">
            <p className="text-[10px] font-medium text-primary">
              Daily Active Users
            </p>
            <p className="font-bold text-primary mt-0.5">
              2,840 DAU
            </p>
          </div>

          {/* WAU */}
          <div className="p-2.5 rounded-xl border border-border/80 bg-muted/30 text-center">
            <p className="text-[10px] font-medium text-muted-foreground">
              Weekly Active Users
            </p>
            <p className="font-bold text-foreground mt-0.5">
              8,920 WAU
            </p>
          </div>

          {/* MAU */}
          <div className="p-2.5 rounded-xl border border-border/80 bg-muted/30 text-center">
            <p className="text-[10px] font-medium text-muted-foreground">
              Monthly Active Users
            </p>
            <p className="text-secondary font-bold mt-0.5">
              14,280 MAU
            </p>
          </div>
        </div>

        {/* Middle Session Statistics */}
        <div className="flex flex-wrap items-center justify-between text-xs py-2 px-3 rounded-xl bg-muted/30 border border-border/70 text-muted-foreground">
          <span>
            Avg Session Activity: <strong className="text-foreground">14.2 mins / session</strong>
          </span>
          <span className="hidden sm:inline-block text-border">|</span>
          <span>
            Returning Users: <strong className="text-secondary font-bold">68.4%</strong>
          </span>
          <span className="hidden sm:inline-block text-border">|</span>
          <span>
            New Rate: <strong className="text-destructive font-bold">31.6%</strong>
          </span>
        </div>

        {/* Bottom Sparkline */}
        <div className="pt-1">
          <p className="text-[11px] font-semibold text-foreground mb-1">
            30-Day Engagement Trend <span className="text-muted-foreground font-normal">(DAU/WAU Ratio: 19.8%)</span>
          </p>
          <div className="w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparklineData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="engagementAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--secondary)" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="var(--secondary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark text-dark-foreground text-[10px] rounded-md px-2 py-1 shadow-md border border-white/10">
                          Ratio: {payload[0].value}%
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="value"
                  stroke="var(--secondary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#engagementAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
