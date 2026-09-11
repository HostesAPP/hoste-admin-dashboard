"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Calendar, ChevronDown, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface BrandUsersReportHeaderProps {
  dateRange: string;
  onDateRangeChange: (range: string) => void;
  onExportClick: () => void;
}

const DATE_RANGE_OPTIONS = [
  "Today",
  "Last 7 Days",
  "Last 30 Days (Jul 25 - Aug 23)",
  "This Month",
  "Last 90 Days",
  "Year to Date (2026)",
];

export const BrandUsersReportHeader: React.FC<BrandUsersReportHeaderProps> = ({
  dateRange,
  onDateRangeChange,
  onExportClick,
}) => {
  const [selectedRange, setSelectedRange] = useState(dateRange);

  const handleSelect = (option: string) => {
    setSelectedRange(option);
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
          <span className="text-primary font-semibold">Brand Users</span>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Brand Users Report
        </h1>

        <p className="text-xs sm:text-sm text-muted-foreground">
          Monitor Brand User growth, activity, bookings, and spending
        </p>
      </div>

      {/* Right: Date Range & Export Button */}
      <div className="flex items-center gap-3 shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger className="h-10 px-3.5 bg-card hover:bg-muted/50 border border-border text-foreground font-medium text-xs sm:text-sm flex items-center gap-2 rounded-xl shadow-xs cursor-pointer transition-colors">
            <Calendar className="w-4 h-4 text-muted-foreground" />
            <span>{selectedRange}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-60 rounded-xl">
            {DATE_RANGE_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => handleSelect(option)}
                className={`cursor-pointer text-xs ${
                  selectedRange === option ? "font-semibold text-primary bg-primary/10" : ""
                }`}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        <Button
          onClick={onExportClick}
          className="h-10 px-4 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm flex items-center gap-2 rounded-xl shadow-xs cursor-pointer transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Export Report</span>
        </Button>
      </div>
    </div>
  );
};
