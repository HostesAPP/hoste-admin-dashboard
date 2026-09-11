"use client";

import type { Group } from "@/features/groups";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";

interface PerformanceDataPoint {
  month: string;
  bookings: number;
}

const DEFAULT_PERFORMANCE_DATA: PerformanceDataPoint[] = [
  { month: "Mar", bookings: 12 },
  { month: "Apr", bookings: 18 },
  { month: "May", bookings: 26 },
  { month: "Jun", bookings: 22 },
  { month: "Jul", bookings: 38 },
  { month: "Aug", bookings: 54 },
];

interface CustomTooltipProps {
  active?: boolean;
  payload?: Array<{ value: number | string }>;
  label?: string;
}

const CustomTooltip = ({ active, payload, label }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="rounded-lg border border-border bg-popover px-2.5 py-1.5 text-xs shadow-md">
        <p className="font-semibold text-foreground">{label}</p>
        <p className="text-muted-foreground">
          <span className="font-semibold text-primary">{payload[0].value}</span> bookings
        </p>
      </div>
    );
  }
  return null;
};

export const GroupPerformanceCard = ({ group }: { group?: Group }) => {
  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-foreground">Group Performance</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Activity and fulfillment metrics over time
        </p>
      </div>

      {/* Chart Section */}
      <div className="py-4 space-y-2">
        <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
          Bookings Over Last 6 Months
        </span>

        {/* Recharts Area Chart */}
        <div className="w-full h-36 pt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={DEFAULT_PERFORMANCE_DATA}
              margin={{ top: 8, right: 8, left: 8, bottom: 0 }}
            >
              <defs>
                <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="100%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                vertical={false}
                stroke="var(--border)"
              />
              <XAxis
                dataKey="month"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: "var(--muted-foreground)" }}
                dy={4}
              />
              <YAxis hide domain={["dataMin - 10", "dataMax + 10"]} />
              <Tooltip content={<CustomTooltip />} cursor={{ stroke: "var(--border)", strokeDasharray: "3 3" }} />
              <Area
                type="monotone"
                dataKey="bookings"
                stroke="var(--primary)"
                strokeWidth={2.5}
                fillOpacity={1}
                fill="url(#performanceGradient)"
                dot={false}
                activeDot={{
                  r: 5,
                  fill: "var(--primary)",
                  stroke: "var(--card)",
                  strokeWidth: 2,
                }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Bottom 3 Summary Metrics */}
      <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border text-xs">
        <div>
          <span className="text-muted-foreground block text-[11px]">
            Completed Bookings
          </span>
          <span className="font-bold text-base text-foreground mt-0.5 block">
            328
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">
            Cancelled Bookings
          </span>
          <span className="font-bold text-base text-destructive mt-0.5 block">
            14 (4.0%)
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block text-[11px]">
            Joined This Month
          </span>
          <span className="font-bold text-base text-success mt-0.5 block">
            +18 members
          </span>
        </div>
      </div>
    </section>
  );
};
