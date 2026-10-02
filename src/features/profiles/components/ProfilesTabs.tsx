"use client";

import { cn } from "@/lib/utils";
import type { ProfileTab } from "../types/profiles.types";

interface ProfilesTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  tabCounts: {
    pending: string;
    approved: string;
    rejected: string;
    suspended: string;
    deactivated: string;
  };
}

export function ProfilesTabs({
  activeTab,
  onTabChange,
  tabCounts,
}: ProfilesTabsProps) {
  const tabs: { key: ProfileTab; label: string; count: string }[] = [
    {
      key: "pending",
      label: "Pending Approval",
      count: tabCounts.pending,
    },
    {
      key: "approved",
      label: "Approved",
      count: tabCounts.approved,
    },
    {
      key: "rejected",
      label: "Rejected",
      count: tabCounts.rejected,
    },
    {
      key: "suspended",
      label: "Suspended",
      count: tabCounts.suspended,
    },
    {
      key: "deactivated",
      label: "Deactivated",
      count: tabCounts.deactivated,
    },
  ];

  return (
    <div className="flex items-center gap-3 overflow-x-auto pb-1">
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <button
            key={tab.key}
            type="button"
            onClick={() => onTabChange(tab.key)}
            className={cn(
              "text-xs font-medium px-4 py-2 rounded-xl transition-all duration-150 cursor-pointer whitespace-nowrap",
              isActive
                ? "text-primary border border-primary bg-card shadow-xs font-semibold"
                : "text-muted-foreground hover:text-foreground hover:bg-muted/40"
            )}
          >
            {tab.label} ({tab.count})
          </button>
        );
      })}
    </div>
  );
}
