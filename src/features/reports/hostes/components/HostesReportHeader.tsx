"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface HostesReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onExportClick: () => void;
}

const TIME_PILLS = ["Today", "7 Days", "30 Days", "This Month", "Custom"];

export const HostesReportHeader: React.FC<HostesReportHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onExportClick,
}) => {
  const [activeRange, setActiveRange] = useState(dateRange);

  const handleSelect = (option: string) => {
    setActiveRange(option);
    onDateRangeChange(option);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      {/* Left: Breadcrumbs & Title */}
      <div className="space-y-1">
        <div className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground">
          <Link
            href="/reports"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Reports
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">Hostés</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Hosté Users Report
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground">
          Monitor Hosté growth, activity, verification, bookings, and overall earnings performance.
        </p>
      </div>

      {/* Right: Pill Time Buttons & Export Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="inline-flex p-1 bg-muted/60 rounded-xl border border-border/60">
          {TIME_PILLS.map((pill) => (
            <button
              key={pill}
              type="button"
              onClick={() => handleSelect(pill)}
              className={`px-3 py-1 text-xs font-semibold rounded-lg transition-all cursor-pointer ${
                activeRange === pill
                  ? "bg-primary text-primary-foreground shadow-xs"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {pill}
            </button>
          ))}
        </div>

        <Button
          onClick={onExportClick}
          className="h-10 px-4 bg-secondary hover:bg-secondary/90 text-secondary-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};
