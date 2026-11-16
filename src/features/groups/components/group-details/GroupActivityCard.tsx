"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Group } from "@/features/groups";

export const GroupActivityCard = ({ group }: { group?: Group }) => {
  const activities = Array.isArray(group?.activities)
    ? (group.activities as Array<{
        id: string;
        title: string;
        timestamp: string;
        dotColor?: string;
      }>)
    : [];

  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-bold text-foreground">Group Activity</h3>
        <Link
          href={`/groups/${group?.id || ""}/activity`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View Full Activity</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity Timeline */}
      <div className="py-4 space-y-4">
        {activities.length === 0 ? (
          <div className="py-8 text-center text-xs text-muted-foreground">
            No recent activity recorded for this group.
          </div>
        ) : (
          activities.map((item, idx) => (
            <div key={item.id} className="relative flex items-start gap-3">
              {/* Timeline vertical bar */}
              {idx !== activities.length - 1 && (
                <span className="absolute left-1.5 top-3 -bottom-4 w-0.5 bg-border -translate-x-1/2" />
              )}

              {/* Dot */}
              <span
                className={`relative z-10 w-3 h-3 rounded-full mt-1 shrink-0 ${
                  item.dotColor || "bg-primary"
                } ring-4 ring-card`}
              />

              {/* Content */}
              <div className="space-y-0.5 min-w-0 flex-1">
                <p className="text-xs font-semibold text-foreground leading-snug">
                  {item.title}
                </p>
                <span className="text-[11px] text-muted-foreground block">
                  {item.timestamp}
                </span>
              </div>
            </div>
          ))
        )}
      </div>
    </section>
  );
};
