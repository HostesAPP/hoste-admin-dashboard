// features/support-tickets/components/SupportTicketsTabs.tsx

import React from "react";
import { TicketStatus, ALL_TICKET_TYPES } from "../types/support-tickets.types";
import { Filter, X } from "lucide-react";

interface SupportTicketsTabsProps {
  activeTab: TicketStatus | "All";
  onTabChange: (tab: TicketStatus | "All") => void;
  selectedType?: string;
  onTypeChange?: (type: string) => void;
  openCount?: number;
  inProgressCount?: number;
  resolvedCount?: number;
  totalCount?: number;
}

export function SupportTicketsTabs({
  activeTab,
  onTabChange,
  selectedType = "All",
  onTypeChange,
  openCount = 0,
  inProgressCount = 0,
  resolvedCount = 0,
  totalCount = 0,
}: SupportTicketsTabsProps) {
  const tabs: { label: string; value: TicketStatus | "All"; count: number }[] = [
    { label: "All Tickets", value: "All", count: totalCount || (openCount + inProgressCount + resolvedCount) },
    { label: "Open", value: "Open", count: openCount },
    { label: "In Progress", value: "In Progress", count: inProgressCount },
    { label: "Resolved", value: "Resolved", count: resolvedCount },
  ];

  return (
    <div className="flex flex-wrap items-center justify-between gap-4">
      {/* Status Tabs */}
      <div className="flex items-center gap-2">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.value;
          return (
            <button
              key={tab.value}
              type="button"
              onClick={() => onTabChange(tab.value)}
              className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold transition-all cursor-pointer ${
                isActive
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "border border-border/80 bg-card text-muted-foreground hover:text-foreground hover:bg-muted/40"
              }`}
            >
              <span>{tab.label}</span>
              <span
                className={`text-[11px] px-2 py-0.5 rounded-full font-bold ${
                  isActive
                    ? "bg-primary-foreground/20 text-primary-foreground"
                    : "bg-muted text-muted-foreground"
                }`}
              >
                {tab.count}
              </span>
            </button>
          );
        })}
      </div>

      {/* Category/Type Filter Dropdown */}
      {onTypeChange && (
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-2 border border-border/80 bg-card rounded-xl px-3 py-1.5 shadow-2xs">
            <Filter className="w-3.5 h-3.5 text-muted-foreground" />
            <span className="text-xs font-medium text-muted-foreground">Type:</span>
            <select
              value={selectedType}
              onChange={(e) => onTypeChange(e.target.value)}
              className="bg-transparent text-xs font-semibold text-foreground focus:outline-hidden cursor-pointer"
            >
              <option value="All">All Categories</option>
              {ALL_TICKET_TYPES.map((type) => (
                <option key={type} value={type}>
                  {type}
                </option>
              ))}
            </select>
            {selectedType !== "All" && (
              <button
                type="button"
                onClick={() => onTypeChange("All")}
                className="text-muted-foreground hover:text-foreground ml-1 p-0.5 rounded"
                title="Reset type filter"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
