"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import type { Group } from "@/features/groups";

const ACTIVITIES = [
  {
    id: "act-1",
    title: "Kofi Asante added a new member (Ama Mensah).",
    timestamp: "Aug 20, 2026 — 2:34 PM",
    dotColor: "bg-primary",
  },
  {
    id: "act-2",
    title: "Ama Mensah joined the group.",
    timestamp: "Aug 19, 2026 — 6:15 PM",
    dotColor: "bg-sky-500",
  },
  {
    id: "act-3",
    title: "Group profile information updated.",
    timestamp: "Aug 18, 2026 — 11:25 AM",
    dotColor: "bg-success",
  },
  {
    id: "act-4",
    title: "Group created by Kofi Asante.",
    timestamp: "Aug 10, 2026 — 11:30 AM",
    dotColor: "bg-muted-foreground",
  },
];

export const GroupActivityCard = ({ group }: { group?: Group }) => {
  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border">
        <h3 className="text-base font-bold text-foreground">Group Activity</h3>
        <Link
          href={`/groups/${group?.id || "GRP-001"}/activity`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View Full Activity</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Activity Timeline */}
      <div className="py-4 space-y-4">
        {ACTIVITIES.map((item, idx) => (
          <div key={item.id} className="relative flex items-start gap-3">
            {/* Timeline vertical bar */}
            {idx !== ACTIVITIES.length - 1 && (
              <span className="absolute left-1.5 top-3 -bottom-4 w-0.5 bg-border -translate-x-1/2" />
            )}

            {/* Dot */}
            <span
              className={`relative z-10 w-3 h-3 rounded-full mt-1 shrink-0 ${item.dotColor} ring-4 ring-card`}
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
        ))}
      </div>

      {/* Bottom spacer / note */}
      <div className="pt-2 text-right">
        <span className="text-[11px] text-muted-foreground">
          Real-time platform activity log
        </span>
      </div>
    </section>
  );
};
