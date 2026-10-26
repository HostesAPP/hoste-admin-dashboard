// features/support-tickets/components/SupportTicketsStats.tsx

import React from "react";
import { SupportTicketStats } from "../types/support-tickets.types";

interface SupportTicketsStatsProps {
  stats?: SupportTicketStats;
  isLoading?: boolean;
}

export function SupportTicketsStats({
  stats,
  isLoading = false,
}: SupportTicketsStatsProps) {
  const cards = [
    {
      label: "Open Tickets",
      value: stats?.openCount ?? 0,
      accentBorder: "border-t-2 border-t-primary",
      badgeColor: "bg-primary/10 text-primary",
    },
    {
      label: "In Progress",
      value: stats?.inProgressCount ?? 0,
      accentBorder: "border-t-2 border-t-amber-500",
      badgeColor: "bg-amber-500/10 text-amber-600 dark:text-amber-400",
    },
    {
      label: "Resolved (All Time)",
      value: stats?.resolvedCount ?? 0,
      accentBorder: "border-t-2 border-t-secondary",
      badgeColor: "bg-secondary/10 text-secondary",
    },
    {
      label: "Avg. Resolution",
      value: stats?.avgResolutionTime ?? "1.8 hrs",
      accentBorder: "border-t-2 border-t-primary/70",
      badgeColor: "bg-primary/10 text-primary",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-card rounded-2xl p-5 border border-border shadow-xs flex flex-col justify-between relative overflow-hidden transition-all hover:border-border/80 ${card.accentBorder}`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
              {card.label}
            </span>
          </div>
          <div className="mt-4">
            {isLoading ? (
              <div className="h-9 w-20 bg-muted animate-pulse rounded-lg" />
            ) : (
              <span className="text-2xl sm:text-3xl font-extrabold tracking-tight text-foreground">
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
