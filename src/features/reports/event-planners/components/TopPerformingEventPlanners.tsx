"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowRight } from "lucide-react";
import type {
  TopPerformingEventPlannerItem,
  EventPlannerDirectoryItem,
} from "../types/event-planners.types";

interface TopPerformingEventPlannersProps {
  planners: TopPerformingEventPlannerItem[];
  onViewProfile?: (plannerId: string) => void;
  plannerDirectory?: EventPlannerDirectoryItem[];
  onSelectPlanner?: (planner: EventPlannerDirectoryItem) => void;
}

export const TopPerformingEventPlanners: React.FC<TopPerformingEventPlannersProps> = ({
  planners,
  plannerDirectory,
  onSelectPlanner,
}) => {
  const handleProfileClick = (id: string, name: string) => {
    if (onSelectPlanner && plannerDirectory) {
      const found = plannerDirectory.find((p) => p.name === name || p.id === id);
      if (found) {
        onSelectPlanner(found);
      }
    }
  };

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-bold text-foreground">
          Top Performing Event Planners
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground">
          Highest-value and most efficient event management partners
        </CardDescription>
      </CardHeader>

      <CardContent className="pt-1">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {planners.map((planner) => (
            <div
              key={planner.id}
              className={`p-4 rounded-2xl border transition-all flex flex-col justify-between ${
                planner.isHighlighted
                  ? "border-primary/50 bg-primary/[0.02] shadow-2xs"
                  : "border-border/70 bg-card hover:border-border shadow-2xs"
              }`}
            >
              {/* Header with Rank & Avatar */}
              <div className="flex items-center gap-3">
                {/* Rank Badge */}
                <span
                  className={`w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold shrink-0 ${
                    planner.rank === 1
                      ? "bg-primary text-primary-foreground"
                      : "bg-zinc-800 text-white"
                  }`}
                >
                  #{planner.rank}
                </span>

                {/* Avatar */}
                <div
                  className={`w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${planner.avatarBg}`}
                >
                  {planner.initial}
                </div>

                {/* Name & Contact */}
                <div className="min-w-0 flex-1">
                  <h4 className="text-sm font-bold text-foreground truncate">
                    {planner.name}
                  </h4>
                  <p className="text-[11px] text-muted-foreground truncate">
                    {planner.contactPerson} • {planner.location}
                  </p>
                </div>
              </div>

              {/* 3 Metrics Row */}
              <div className="grid grid-cols-3 gap-2 py-3.5 my-3 border-y border-border/60 text-xs">
                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Total Spending
                  </p>
                  <p className="font-bold text-secondary text-xs sm:text-[13px] mt-0.5 truncate">
                    {planner.totalSpending}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Bookings (Comp.)
                  </p>
                  <p className="font-bold text-foreground text-xs sm:text-[13px] mt-0.5">
                    {planner.bookings}{" "}
                    <span className="text-secondary font-semibold">
                      ({planner.completedBookings})
                    </span>
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-muted-foreground font-medium">
                    Comp. Rate
                  </p>
                  <p className="font-bold text-secondary text-xs sm:text-[13px] mt-0.5">
                    {planner.completionRate}
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="flex items-center justify-between text-xs pt-0.5">
                <span className="text-[11px] text-muted-foreground">
                  {planner.lastActivity}
                </span>
                <button
                  type="button"
                  onClick={() => handleProfileClick(planner.id, planner.name)}
                  className="inline-flex items-center gap-1 font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer text-xs"
                >
                  <span>View Profile</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
