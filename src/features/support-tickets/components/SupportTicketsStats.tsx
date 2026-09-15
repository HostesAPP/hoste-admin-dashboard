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
      value: stats?.openCount ?? 24,
      accentBorder: "border-t-2 border-t-primary",
    },
    {
      label: "In Progress",
      value: stats?.inProgressCount ?? 12,
      accentBorder: "border-t-2 border-t-amber-500",
    },
    {
      label: "Resolved (All Time)",
      value: stats?.resolvedCount ?? 340,
      accentBorder: "border-t-2 border-t-emerald-600",
    },
    {
      label: "Avg. Resolution",
      value: stats?.avgResolutionTime ?? "1.8 hrs",
      accentBorder: "border-t-2 border-t-primary",
    },
  ];

  return (
    <div className="grid grid-cols-4 gap-5">
      {cards.map((card, idx) => (
        <div
          key={idx}
          className={`bg-card rounded-lg p-5 border border-border/80 shadow-xs flex flex-col justify-between relative overflow-hidden ${card.accentBorder}`}
        >
          <span className="text-xs font-medium text-muted-foreground">
            {card.label}
          </span>
          <div className="mt-3">
            {isLoading ? (
              <div className="h-8 w-16 bg-muted animate-pulse rounded" />
            ) : (
              <span className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
                {card.value}
              </span>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
