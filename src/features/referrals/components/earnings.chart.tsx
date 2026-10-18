"use client";
import {
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import type { EarningsData } from "../types/earnings.types";

export function EarningsChart({ data }: { data: EarningsData["chart"] }) {
  return (
    <section className="border-y border-border bg-card px-5 py-4">
      <div className="flex justify-between">
        <div>
          <h2 className="text-sm font-bold">Earnings Overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Referral earnings generated and paid over time.
          </p>
        </div>
        <div className="space-y-1 text-[10px] text-muted-foreground">
          <p className="flex items-center gap-2">
            Earned <span className="size-2 rounded-sm bg-primary" />
          </p>
          <p className="flex items-center gap-2">
            Paid <span className="size-2 rounded-sm bg-success" />
          </p>
        </div>
      </div>
      <div className="mt-3 h-32">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <LineChart
              data={data}
              margin={{ left: -16, right: 10, top: 8, bottom: 0 }}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                minTickGap={100}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                tickFormatter={(value: string) =>
                  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })
                }
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                ticks={[10000, 30000, 50000]}
                domain={[0, 50000]}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                tickFormatter={(value: number) => `₦${value / 1000}k`}
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  fontSize: 11,
                }}
                formatter={(value, name) => [
                  `₦${Number(value).toLocaleString()}`,
                  name,
                ]}
              />
              <Line
                dataKey="earned"
                name="Earned"
                stroke="var(--primary)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
              <Line
                dataKey="paid"
                name="Paid"
                stroke="var(--success)"
                strokeWidth={2}
                dot={false}
                isAnimationActive={false}
              />
            </LineChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No earnings activity for this period.
          </p>
        )}
      </div>
    </section>
  );
}
