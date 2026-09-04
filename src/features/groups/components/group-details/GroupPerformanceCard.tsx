"use client";

import type { Group } from "@/features/groups";

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

        {/* SVG Area Chart */}
        <div className="relative w-full h-36 pt-2">
          <svg
            className="w-full h-full overflow-visible"
            viewBox="0 0 400 120"
            preserveAspectRatio="none"
          >
            <defs>
              <linearGradient id="performanceGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#EF5A22" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#EF5A22" stopOpacity="0.0" />
              </linearGradient>
            </defs>

            {/* Grid lines */}
            <line
              x1="0"
              y1="100"
              x2="400"
              y2="100"
              stroke="currentColor"
              className="text-border"
              strokeDasharray="3 3"
            />
            <line
              x1="0"
              y1="60"
              x2="400"
              y2="60"
              stroke="currentColor"
              className="text-border"
              strokeDasharray="3 3"
            />

            {/* Area fill */}
            <path
              d="M 0,90 Q 60,85 100,70 T 200,80 T 300,55 T 400,20 L 400,100 L 0,100 Z"
              fill="url(#performanceGradient)"
            />

            {/* Orange line curve */}
            <path
              d="M 0,90 Q 60,85 100,70 T 200,80 T 300,55 T 400,20"
              fill="none"
              stroke="#EF5A22"
              strokeWidth="3"
              strokeLinecap="round"
            />

            {/* Final point marker */}
            <circle cx="400" cy="20" r="4" fill="#EF5A22" className="ring-4 ring-primary/20" />
          </svg>

          {/* Month labels */}
          <div className="flex justify-between text-[11px] text-muted-foreground pt-2">
            <span>Mar</span>
            <span>Apr</span>
            <span>May</span>
            <span>Jun</span>
            <span>Jul</span>
            <span className="font-bold text-foreground">Aug</span>
          </div>
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
