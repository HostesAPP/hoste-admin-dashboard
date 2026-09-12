"use client";

import React from "react";
import Link from "next/link";
import { Download, ChevronRight } from "lucide-react";
import type { ActivityTimeRange } from "../types/platform-activity.types";

interface PlatformActivityReportHeaderProps {
  selectedRange: ActivityTimeRange;
  onRangeChange: (range: ActivityTimeRange) => void;
  onExport: () => void;
}

const TIME_RANGES: ActivityTimeRange[] = [
  "Today",
  "7 Days",
  "30 Days",
  "This Month",
  "Custom",
];

export const PlatformActivityReportHeader: React.FC<
  PlatformActivityReportHeaderProps
> = ({ selectedRange, onRangeChange, onExport }) => {
  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
      {/* Title & Breadcrumb */}
      <div>
        <nav className="flex items-center gap-1.5 text-xs text-muted-foreground mb-1.5">
          <Link
            href="/reports"
            className="hover:text-foreground transition-colors font-medium"
          >
            Reports
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
          <span className="text-primary font-semibold">Platform Activity</span>
        </nav>
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-foreground">
          Platform Activity
        </h1>
        <p className="text-xs md:text-sm text-muted-foreground mt-0.5">
          Monitor platform usage, engagement, and real-time activity trends across all Hosté modules.
        </p>
      </div>

      {/* Date Range Tabs & Export CTA */}
      <div className="flex flex-wrap items-center gap-2.5">
        <div className="inline-flex items-center p-1 bg-muted/60 rounded-xl border border-border">
          {TIME_RANGES.map((range) => (
            <button
              key={range}
              type="button"
              onClick={() => onRangeChange(range)}
              className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                selectedRange === range
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/50"
              }`}
            >
              {range}
            </button>
          ))}
        </div>

        <button
          type="button"
          onClick={onExport}
          className="inline-flex items-center gap-2 px-3.5 py-2 text-xs font-semibold rounded-xl bg-secondary text-secondary-foreground hover:bg-secondary/90 transition-colors shadow-xs cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Report</span>
        </button>
      </div>
    </div>
  );
};
