"use client";

import { useId, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type {
  ReferralMetric,
  ReferralPerformancePoint,
} from "../referrals.overview.types";

const METRICS: { value: ReferralMetric; label: string }[] = [
  { value: "referrals", label: "Referrals" },
  { value: "registrations", label: "Registrations" },
  { value: "successful", label: "Successful (₦1k)" },
  { value: "rewards", label: "Rewards" },
];

export function ReferralPerformanceChart({
  data,
}: {
  data: ReferralPerformancePoint[];
}) {
  const [metric, setMetric] = useState<ReferralMetric>("successful");
  const gradientId = useId().replaceAll(":", "");
  return (
    <section className="min-w-0 rounded-lg border border-border bg-card p-5">
      <div className="flex items-center justify-between gap-2">
        <h2 className="text-sm font-bold">Referral Performance</h2>
        <div
          className="flex rounded-md bg-muted/70 p-1"
          role="group"
          aria-label="Performance metric"
        >
          {METRICS.map((item) => (
            <button
              key={item.value}
              type="button"
              aria-pressed={metric === item.value}
              onClick={() => setMetric(item.value)}
              className={`rounded px-2 py-1.5 text-[9px] font-medium ${metric === item.value ? "bg-card text-primary shadow-xs" : "text-muted-foreground hover:text-foreground"}`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
      <div className="mt-5 h-[255px] w-full">
        {data.length === 0 ? (
          <p className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No performance data for this period.
          </p>
        ) : (
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart
              data={data}
              margin={{ top: 12, right: 12, bottom: 10, left: -30 }}
            >
              <defs>
                <linearGradient id={gradientId} x1="0" y1="0" x2="0" y2="1">
                  <stop
                    offset="0%"
                    stopColor="var(--primary)"
                    stopOpacity={0.15}
                  />
                  <stop
                    offset="100%"
                    stopColor="var(--primary)"
                    stopOpacity={0}
                  />
                </linearGradient>
              </defs>
              <CartesianGrid
                vertical={false}
                stroke="var(--border)"
                strokeDasharray="4 4"
              />
              <XAxis
                dataKey="date"
                tickFormatter={(date: string) =>
                  new Date(`${date}T00:00:00Z`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "2-digit",
                    timeZone: "UTC",
                  })
                }
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
                minTickGap={22}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 10, fill: "var(--muted-foreground)" }}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(value) => [
                  value,
                  METRICS.find((item) => item.value === metric)?.label,
                ]}
              />
              <Area
                type="monotone"
                dataKey={metric}
                stroke="var(--primary)"
                strokeWidth={2.5}
                fill={`url(#${gradientId})`}
                dot={data.length === 1}
                isAnimationActive={false}
              />
            </AreaChart>
          </ResponsiveContainer>
        )}
      </div>
    </section>
  );
}
