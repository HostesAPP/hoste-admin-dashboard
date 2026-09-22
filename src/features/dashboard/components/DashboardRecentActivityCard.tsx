// features/dashboard/components/DashboardRecentActivityCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardRecentActivityItem } from "../dashboard.types";

interface DashboardRecentActivityCardProps {
  activities: DashboardRecentActivityItem[];
  isLoading?: boolean;
}

export function DashboardRecentActivityCard({
  activities,
  isLoading = false,
}: DashboardRecentActivityCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-foreground">Recent Activity</h2>
        <Link
          href="/reports/platform-activity"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all"
        >
          <span>View Activity</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Activity Timeline List */}
      <div className="space-y-3.5 divide-y divide-border/40">
        {isLoading ? (
          [1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className={`flex items-start gap-3 ${i > 1 ? "pt-3" : ""} animate-pulse`}
            >
              <div className="w-2.5 h-2.5 rounded-full bg-muted shrink-0 mt-1" />
              <div className="flex-1 space-y-1.5 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <div className="h-3.5 w-28 bg-muted rounded" />
                  <div className="h-2.5 w-12 bg-muted rounded" />
                </div>
                <div className="h-3 w-4/5 bg-muted rounded" />
              </div>
            </div>
          ))
        ) : activities.length === 0 ? (
          <div className="py-6 text-center text-xs text-muted-foreground">
            No recent activity recorded.
          </div>
        ) : (
          activities.map((act, index) => (
            <div
              key={act.id}
              className={`flex items-start gap-3 ${index > 0 ? "pt-3" : ""}`}
            >
              {/* Orange Hollow Circle indicator matching design */}
              <span className="w-2.5 h-2.5 rounded-full border-2 border-primary bg-background shrink-0 mt-1" />

              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-bold text-foreground truncate">
                    {act.title}
                  </span>
                  <span className="text-[10px] text-muted-foreground shrink-0">
                    {act.timestamp}
                  </span>
                </div>
                <p className="text-[11px] text-muted-foreground mt-0.5 leading-snug">
                  {act.description}
                </p>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
