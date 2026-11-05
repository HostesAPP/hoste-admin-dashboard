"use client";

import { cn } from "@/lib/utils";
import type { ProfileTab, ProfileCounts } from "../types/profiles.types";

interface ProfilesTabsProps {
  activeTab: ProfileTab;
  onTabChange: (tab: ProfileTab) => void;
  tabCounts: ProfileCounts | {
    pending: number | string;
    approved: number | string;
    rejected: number | string;
    suspended: number | string;
    deactivated: number | string;
  };
}

export function ProfilesTabs({
  activeTab,
  onTabChange,
  tabCounts,
}: ProfilesTabsProps) {
  const formatCount = (count: number | string) => {
    if (typeof count === "number") {
      return count < 10 && count >= 0 ? `0${count}` : `${count}`;
    }
    return count;
  };

  const tabs: { key: ProfileTab; label: string; count: number | string }[] = [
    {
      key: "pending",
      label: "Pending Approval",
      count: formatCount(tabCounts.pending),
    },
    {
      key: "approved",
      label: "Approved",
      count: formatCount(tabCounts.approved),
    },
    {
      key: "rejected",
      label: "Rejected",
      count: formatCount(tabCounts.rejected),
    },
    {
      key: "suspended",
      label: "Suspended",
      count: formatCount(tabCounts.suspended),
    },
    {
      key: "deactivated",
      label: "Deactivated",
      count: formatCount(tabCounts.deactivated),
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
