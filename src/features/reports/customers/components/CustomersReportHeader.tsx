"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface CustomersReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onExportClick: () => void;
}

const DATE_PILLS = ["Today", "7 Days", "30 Days", "This Month", "Custom"];

export const CustomersReportHeader: React.FC<CustomersReportHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onExportClick,
}) => {
  const [selectedPill, setSelectedPill] = useState(dateRange || "This Month");

  const handlePillClick = (pill: string) => {
    setSelectedPill(pill);
    onDateRangeChange(pill);
  };

  return (
    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-1">
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
          <Link
            href="/reports"
            className="hover:text-foreground hover:underline transition-colors"
          >
            Reports Dashboard
          </Link>
          <span>/</span>
          <span className="text-primary font-semibold">Customers</span>
        </div>

        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Customer Report
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground">
          Monitor customer growth, activity, bookings, and spending across the Hosté platform.
        </p>
      </div>

      {/* Right: Date Range Pills & Export Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="flex items-center bg-card border border-border rounded-xl p-1 shadow-2xs">
          {DATE_PILLS.map((pill) => {
            const isActive = selectedPill === pill;
            return (
              <button
                key={pill}
                type="button"
                onClick={() => handlePillClick(pill)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all cursor-pointer ${
                  isActive
                    ? "border border-primary text-primary font-semibold bg-primary/5 shadow-2xs"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {pill}
              </button>
            );
          })}
        </div>

        <Button
          onClick={onExportClick}
          className="h-9 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};
