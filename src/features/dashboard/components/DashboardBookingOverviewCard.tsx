// features/dashboard/components/DashboardBookingOverviewCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { BookingPipelineBreakdown } from "../dashboard.types";

interface DashboardBookingOverviewCardProps {
  pipeline: BookingPipelineBreakdown;
  isLoading?: boolean;
}

export function DashboardBookingOverviewCard({
  pipeline,
  isLoading = false,
}: DashboardBookingOverviewCardProps) {
  if (isLoading) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-5 animate-pulse">
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <div className="h-3.5 w-28 bg-muted rounded" />
            <div className="h-3.5 w-24 bg-muted rounded" />
          </div>
          <div className="space-y-1 pt-1">
            <div className="h-3 w-20 bg-muted rounded" />
            <div className="h-7 w-28 bg-muted rounded-lg" />
          </div>
        </div>
        <div className="h-3 w-full bg-muted/70 rounded-full" />
        <div className="space-y-3 pt-2 border-t border-border/60">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-2.5 h-2.5 rounded-full bg-muted" />
                <div className="h-3.5 w-24 bg-muted rounded" />
              </div>
              <div className="h-3.5 w-14 bg-muted rounded" />
            </div>
          ))}
        </div>
      </div>
    );
  }
  const categories = [
    {
      label: "Confirmed",
      count: pipeline.confirmed.count,
      percentage: pipeline.confirmed.percentage,
      dotColor: "bg-secondary",
      barColor: "bg-secondary",
    },
    {
      label: "Completed",
      count: pipeline.completed.count,
      percentage: pipeline.completed.percentage,
      dotColor: "bg-foreground",
      barColor: "bg-foreground",
    },
    {
      label: "Ongoing",
      count: pipeline.ongoing.count,
      percentage: pipeline.ongoing.percentage,
      dotColor: "bg-primary",
      barColor: "bg-primary",
    },
    {
      label: "Pending Review",
      count: pipeline.pendingReview.count,
      percentage: pipeline.pendingReview.percentage,
      dotColor: "bg-yellow-500",
      barColor: "bg-yellow-500",
    },
    {
      label: "Cancelled",
      count: pipeline.cancelled.count,
      percentage: pipeline.cancelled.percentage,
      dotColor: "bg-destructive",
      barColor: "bg-destructive",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-5">
      {/* Header */}
      <div>
        <div className="flex items-center justify-between">
          <h2 className="text-xs font-bold text-foreground">Booking Overview</h2>
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all"
          >
            <span>View All Bookings</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="mt-2">
          <span className="text-[11px] text-muted-foreground block font-medium">
            Total Pipeline
          </span>
          <div className="flex items-baseline gap-1 mt-0.5">
            <span className="text-2xl font-bold tracking-tight text-foreground">
              {pipeline.totalBookings.toLocaleString()}
            </span>
            <span className="text-xs text-muted-foreground font-medium">
              Bookings
            </span>
          </div>
        </div>
      </div>

      {/* Segmented Horizontal Progress Bar */}
      <div className="w-full h-3 rounded-full bg-muted/60 overflow-hidden flex gap-0.5 p-0.5 border border-border/40">
        {categories.map((cat) => (
          <div
            key={cat.label}
            style={{ width: `${cat.percentage}%` }}
            className={`h-full rounded-full ${cat.barColor} transition-all duration-500`}
            title={`${cat.label}: ${cat.count} (${cat.percentage}%)`}
          />
        ))}
      </div>

      {/* Breakdown List */}
      <div className="space-y-2 pt-1 border-t border-border/60">
        {categories.map((cat) => (
          <div
            key={cat.label}
            className="flex items-center justify-between text-xs py-0.5"
          >
            <div className="flex items-center gap-2">
              <span className={`w-2.5 h-2.5 rounded-full ${cat.dotColor} shrink-0`} />
              <span className="text-foreground font-medium">{cat.label}</span>
            </div>

            <span className="font-semibold text-foreground">
              {cat.count}{" "}
              <span className="text-muted-foreground font-normal">
                ({cat.percentage}%)
              </span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
