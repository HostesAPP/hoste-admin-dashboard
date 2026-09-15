// features/dashboard/components/DashboardActionRequiredSection.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { ActionRequiredItem } from "../dashboard.types";

interface DashboardActionRequiredSectionProps {
  items: ActionRequiredItem[];
}

export function DashboardActionRequiredSection({
  items,
}: DashboardActionRequiredSectionProps) {
  return (
    <section className="space-y-3">
      {/* Title */}
      <div className="flex items-center gap-2">
        <h2 className="text-xs font-bold text-foreground">Action Required</h2>
        <span className="text-xs text-muted-foreground font-normal">
          — {items.length} administrative items require your immediate review
        </span>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {items.map((item) => {
          const isPrimary = item.badgeVariant === "primary";
          return (
            <div
              key={item.id}
              className="bg-card rounded-2xl border border-border/80 shadow-xs p-4 flex items-center justify-between gap-3 hover:border-border transition-all group"
            >
              {/* Left Badge + Text */}
              <div className="flex items-center gap-3.5 min-w-0">
                <div
                  className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm shrink-0 shadow-2xs ${
                    isPrimary
                      ? "bg-primary text-primary-foreground"
                      : "bg-foreground text-background"
                  }`}
                >
                  {item.count}
                </div>

                <div className="min-w-0">
                  <h3 className="text-xs font-bold text-foreground truncate">
                    {item.title}
                  </h3>
                  <p className="text-[11px] text-muted-foreground truncate mt-0.5">
                    {item.description}
                  </p>
                </div>
              </div>

              {/* Action Link */}
              <Link
                href={item.actionHref}
                className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline shrink-0 group-hover:translate-x-0.5 transition-transform"
              >
                <span>{item.actionText}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}
