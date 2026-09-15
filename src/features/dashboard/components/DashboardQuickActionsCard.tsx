// features/dashboard/components/DashboardQuickActionsCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Plus } from "lucide-react";

export function DashboardQuickActionsCard() {
  const actions = [
    { label: "Review Profiles", href: "/profiles?status=Pending" },
    { label: "View Bookings", href: "/bookings" },
    { label: "Manage Users", href: "/users" },
    { label: "Send Notification", href: "/notifications" },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 space-y-3">
      <h2 className="text-xs font-bold text-foreground">Quick Actions</h2>

      <div className="grid grid-cols-2 gap-2.5">
        {actions.map((act) => (
          <Link
            key={act.label}
            href={act.href}
            className="flex items-center justify-center gap-1.5 py-2.5 px-3 rounded-xl border border-border/80 hover:border-primary/50 hover:bg-muted/40 text-xs font-semibold text-foreground transition-all group"
          >
            <Plus className="w-3.5 h-3.5 text-primary group-hover:scale-110 transition-transform shrink-0" />
            <span className="truncate">{act.label}</span>
          </Link>
        ))}
      </div>
    </div>
  );
}
