// features/support-tickets/components/SupportTicketsTabs.tsx

import React from "react";
import { TicketStatus } from "../types/support-tickets.types";

interface SupportTicketsTabsProps {
  activeTab: TicketStatus | "All";
  onTabChange: (tab: TicketStatus | "All") => void;
  openCount?: number;
  inProgressCount?: number;
  resolvedCount?: number;
}

export function SupportTicketsTabs({
  activeTab,
  onTabChange,
  openCount = 24,
  inProgressCount = 12,
  resolvedCount = 340,
}: SupportTicketsTabsProps) {
  const tabs: { label: string; value: TicketStatus | "All"; count: number }[] = [
    { label: "Open", value: "Open", count: openCount },
    { label: "In Progress", value: "In Progress", count: inProgressCount },
    { label: "Resolved", value: "Resolved", count: resolvedCount },
  ];

  return (
    <div className="flex items-center gap-2.5">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.value;
        return (
          <button
            key={tab.value}
            type="button"
            onClick={() => onTabChange(tab.value)}
            className={`px-5 py-2.5 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
              isActive
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
            }`}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}
