// features/dashboard/components/DashboardKpiCards.tsx

"use client";

import React from "react";
import { DashboardKpiData } from "../dashboard.types";

interface DashboardKpiCardsProps {
  kpis?: DashboardKpiData;
  isLoading?: boolean;
}

export function DashboardKpiCards({ kpis, isLoading = false }: DashboardKpiCardsProps) {
  if (isLoading || !kpis) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="bg-card rounded-2xl border border-border/80 p-5 space-y-3 animate-pulse"
          >
            <div className="h-3 w-24 bg-muted rounded" />
            <div className="flex items-center justify-between">
              <div className="h-7 w-28 bg-muted rounded" />
              <div className="h-5 w-14 bg-muted rounded-full" />
            </div>
            <div className="h-2.5 w-32 bg-muted rounded" />
          </div>
        ))}
      </div>
    );
  }

  const items = [
    kpis.totalUsers ? { ...kpis.totalUsers, href: "/users" } : null,
    kpis.totalHostes ? { ...kpis.totalHostes, href: "/profiles" } : null,
    kpis.totalBookings ? { ...kpis.totalBookings, href: "/bookings" } : null,
    kpis.platformRevenue ? { ...kpis.platformRevenue, href: "/revenue" } : null,
  ].filter((item): item is NonNullable<typeof item> => item !== null);

  if (items.length === 0) return null;

  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${
        items.length === 3 ? "lg:grid-cols-3" : "lg:grid-cols-4"
      } gap-4`}
    >
      {items.map((item) => (
        <a
          key={item.label}
          href={item.href}
          className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 flex flex-col justify-between hover:border-primary/40 hover:shadow-sm transition-all cursor-pointer"
        >
          <div className="space-y-1">
            <span className="text-xs font-medium text-muted-foreground">
              {item.label}
            </span>

            <div className="flex items-baseline justify-between gap-2 pt-1">
              <span className="text-2xl font-bold tracking-tight text-foreground">
                {item.value}
              </span>

              <span
                className={`inline-flex items-center px-2 py-0.5 rounded-md text-xs font-semibold border ${
                  item.changePositive
                    ? "bg-secondary/10 text-secondary border-secondary/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {item.changeText}
              </span>
            </div>
          </div>

          <p className="text-[11px] text-muted-foreground mt-3 font-normal">
            {item.subtext}
          </p>
        </a>
      ))}
    </div>
  );
}
