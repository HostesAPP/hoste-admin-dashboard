// features/dashboard/components/DashboardHeader.tsx

"use client";

import React, { useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { PageHeaderLayout } from "@/components/shared";

interface DashboardHeaderProps {
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function DashboardHeader({
  dateRange = "This Month",
  onDateRangeChange,
}: DashboardHeaderProps) {
  const [selectedRange, setSelectedRange] = useState(dateRange);

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <PageHeaderLayout title="Dashboard Overview" description="Welcome back, Admin. Here's what's happening today.">
      {/* Date Filter Dropdown */}
      <DropdownMenu>
        <DropdownMenuTrigger className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-xs font-semibold text-foreground transition-colors shadow-2xs cursor-pointer">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
          <span>{selectedRange}</span>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="rounded-xl border-border">
          <DropdownMenuItem onClick={() => handleSelect("Today")}>
            Today
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("This Week")}>
            This Week
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("This Month")}>
            This Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("Last Month")}>
            Last Month
          </DropdownMenuItem>
          <DropdownMenuItem onClick={() => handleSelect("This Year")}>
            This Year
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </PageHeaderLayout>
  );
}
