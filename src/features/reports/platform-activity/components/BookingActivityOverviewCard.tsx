"use client";

import React from "react";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  Tooltip,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { BookingVelocityPoint } from "../types/platform-activity.types";

interface BookingActivityOverviewCardProps {
  velocityData: BookingVelocityPoint[];
}

export const BookingActivityOverviewCard: React.FC<
  BookingActivityOverviewCardProps
> = ({ velocityData }) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-3 px-6 pt-5">
        <CardTitle className="text-base font-bold text-foreground">
          Booking Activity Overview
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Lifecycle volume and status distribution of accommodation bookings
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-5 pt-2 space-y-4 flex-1 flex flex-col justify-between">
        {/* Status metric boxes */}
        <div className="grid grid-cols-5 gap-2">
          {/* Total */}
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
              Total
            </p>
            <p className="text-sm md:text-base font-bold text-foreground mt-0.5">6,120</p>
          </div>

          {/* Confirmed */}
          <div className="p-2.5 rounded-xl bg-muted/40 border border-border/80 text-center">
            <p className="text-[10px] text-muted-foreground uppercase font-semibold">
              Confirmed
            </p>
            <p className="text-sm md:text-base font-bold text-foreground mt-0.5">3,100</p>
          </div>

          {/* Completed */}
          <div className="p-2.5 rounded-xl bg-secondary/10 border border-secondary/20 text-center">
            <p className="text-[10px] text-secondary uppercase font-bold">
              Completed
            </p>
            <p className="text-sm md:text-base font-bold text-secondary mt-0.5">4,890</p>
          </div>

          {/* Pending */}
          <div className="p-2.5 rounded-xl bg-primary/10 border border-primary/20 text-center">
            <p className="text-[10px] text-primary uppercase font-bold">
              Pending
            </p>
            <p className="text-sm md:text-base font-bold text-primary mt-0.5">680</p>
          </div>

          {/* Cancelled */}
          <div className="p-2.5 rounded-xl bg-destructive/10 border border-destructive/20 text-center">
            <p className="text-[10px] text-destructive uppercase font-bold">
              Cancelled
            </p>
            <p className="text-sm md:text-base font-bold text-destructive mt-0.5">450</p>
          </div>
        </div>

        {/* Velocity Chart */}
        <div className="pt-2">
          <p className="text-[11px] font-semibold text-foreground mb-1">
            Booking Creation & Completion Velocity
          </p>
          <div className="h-18.75 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={velocityData} margin={{ top: 5, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id="velocityAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="var(--primary)" stopOpacity={0.0} />
                  </linearGradient>
                </defs>
                <Tooltip
                  content={({ active, payload }) => {
                    if (active && payload && payload.length) {
                      return (
                        <div className="bg-dark text-dark-foreground text-[10px] rounded-md px-2 py-1 shadow-md border border-white/10">
                          Velocity: {payload[0].value}
                        </div>
                      );
                    }
                    return null;
                  }}
                />
                <Area
                  type="monotone"
                  dataKey="velocity"
                  stroke="var(--primary)"
                  strokeWidth={2}
                  fillOpacity={1}
                  fill="url(#velocityAreaGrad)"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
