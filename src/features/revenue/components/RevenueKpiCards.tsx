// features/revenue/components/RevenueKpiCards.tsx

"use client";

import React from "react";
import { RevenueKpis } from "../revenue.types";

interface RevenueKpiCardsProps {
  kpis: RevenueKpis;
  isLoading?: boolean;
}

export function RevenueKpiCards({ kpis, isLoading = false }: RevenueKpiCardsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/80 p-5 space-y-3 animate-pulse"
          >
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="h-7 w-28 bg-muted rounded" />
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    kpis.totalRevenue,
    kpis.revenueThisMonth,
    kpis.revenueLastMonth,
    kpis.revenueGrowth,
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {items.map((item) => (
        <div
          key={item.label}
          className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 flex flex-col justify-between hover:border-border transition-all"
        >
          <div className="space-y-1.5">
            <span className="text-xs font-medium text-muted-foreground">
              {item.label}
            </span>

            <div className="pt-0.5">
              <span
                className={`text-2xl font-bold tracking-tight ${
                  item.isHighlight ? "text-secondary" : "text-foreground"
                }`}
              >
                {item.value}
              </span>
            </div>
          </div>

          {item.subtext ? (
            <p className="text-[11px] text-muted-foreground mt-3 font-normal">
              {item.subtext}
            </p>
          ) : (
            <div className="h-4 mt-3" />
          )}
        </div>
      ))}
    </div>
  );
}
