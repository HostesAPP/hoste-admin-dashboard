"use client";

import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis } from "recharts";
import type { PayoutChartPoint } from "../payouts.types";

export function PayoutOverviewChart({ data }: { data: PayoutChartPoint[] }) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="flex justify-between">
        <div>
          <h2 className="text-sm font-bold">Payout Overview</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Referral payout activity over the selected period.
          </p>
        </div>
        <div className="flex items-start gap-4 text-[11px] text-muted-foreground">
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-success" />
            Paid
          </span>
          <span className="flex items-center gap-1.5">
            <span className="size-2.5 rounded-sm bg-primary" />
            Pending
          </span>
        </div>
      </div>
      <div className="mt-3 h-24 w-full">
        {data.length ? (
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              margin={{ left: 0, right: 20, top: 5, bottom: 0 }}
              barSize={8}
            >
              <XAxis
                dataKey="date"
                axisLine={false}
                tickLine={false}
                tick={{ fill: "var(--muted-foreground)", fontSize: 10 }}
                tickFormatter={(value: string) =>
                  new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", {
                    month: "short",
                    day: "numeric",
                    timeZone: "UTC",
                  })
                }
              />
              <Tooltip
                contentStyle={{
                  background: "var(--card)",
                  borderColor: "var(--border)",
                  borderRadius: 6,
                  fontSize: 11,
                }}
                formatter={(value, name) => [
                  `₦${Number(value).toLocaleString()}`,
                  name,
                ]}
                cursor={{ fill: "var(--muted)", opacity: 0.4 }}
              />
              <Bar
                dataKey="paid"
                name="Paid"
                stackId="payout"
                fill="var(--success)"
                radius={[0, 0, 2, 2]}
                isAnimationActive={false}
              />
              <Bar
                dataKey="pending"
                name="Pending"
                stackId="payout"
                fill="var(--primary)"
                radius={[2, 2, 0, 0]}
                isAnimationActive={false}
              />
            </BarChart>
          </ResponsiveContainer>
        ) : (
          <p className="flex h-full items-center justify-center text-xs text-muted-foreground">
            No payout activity for this period.
          </p>
        )}
      </div>
    </section>
  );
}
