"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { UserActivityBreakdownItem } from "../types/platform-activity.types";

interface UserActivityBreakdownCardProps {
  items: UserActivityBreakdownItem[];
}

export const UserActivityBreakdownCard: React.FC<UserActivityBreakdownCardProps> = ({
  items,
}) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full">
      <CardHeader className="pb-3 px-6 pt-5">
        <CardTitle className="text-base font-bold text-foreground">
          User Activity Breakdown
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Activity rates and user distribution across major Hosté roles
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 space-y-">
        {items.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-4 py-1"
          >
            {/* Left Info */}
            <div className="min-w-[130px]">
              <p className="text-xs font-bold text-foreground">{item.roleName}</p>
              <p className="text-[11px] text-muted-foreground mt-0.5">
                Total: {item.totalUsers.toLocaleString()} | New: {item.newUsers.toLocaleString()}
              </p>
            </div>

            {/* Right Progress & Percentage */}
            <div className="flex items-center gap-3.5 flex-1 justify-end max-w-[260px]">
              <span className="text-xs font-bold text-foreground whitespace-nowrap">
                {item.activeUsers.toLocaleString()} Active
              </span>

              {/* Progress Bar Track */}
              <div className="w-24 sm:w-28 h-2 rounded-full bg-muted/70 overflow-hidden relative">
                <div
                  className={`h-full rounded-full transition-all ${item.barColor === "orange" ? "bg-primary" : "bg-secondary"
                    }`}
                  style={{ width: `${item.activePercentage}%` }}
                />
              </div>

              <span
                className={`text-xs font-bold w-8 text-right ${item.barColor === "orange" ? "text-primary" : "text-secondary"
                  }`}
              >
                {item.activePercentage}%
              </span>
            </div>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
