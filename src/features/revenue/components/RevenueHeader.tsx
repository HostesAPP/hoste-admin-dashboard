// features/revenue/components/RevenueHeader.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ChevronRight, ChevronDown, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface RevenueHeaderProps {
  dateRange?: string;
  onDateRangeChange?: (range: string) => void;
}

export function RevenueHeader({
  dateRange = "This Month",
  onDateRangeChange,
}: RevenueHeaderProps) {
  const [selectedRange, setSelectedRange] = useState(dateRange);

  const handleSelect = (range: string) => {
    setSelectedRange(range);
    onDateRangeChange?.(range);
  };

  return (
    <header className="space-y-3 pb-1">
      {/* Top Breadcrumb & User Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        {/* Breadcrumb + Subtitle */}
        <div>
          <nav className="flex items-center gap-1.5 text-xs text-muted-foreground font-medium">
            <Link
              href="/"
              className="hover:text-foreground transition-colors cursor-pointer"
            >
              Overview
            </Link>
            <ChevronRight className="w-3.5 h-3.5 text-muted-foreground/60" />
            <span className="text-foreground font-semibold">Total Revenue</span>
          </nav>
          <p className="text-xs text-muted-foreground mt-1">
            Track platform revenue, trends, and financial performance.
          </p>
        </div>

        {/* Right Section: Notification + Admin Profile */}
        <div className="flex items-center gap-3">
          {/* Notifications Bell */}
          <button
            type="button"
            aria-label="Notifications"
            className="relative w-9 h-9 rounded-xl border border-border/80 bg-card hover:bg-muted/50 flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors shadow-2xs cursor-pointer"
          >
            <Bell className="w-4 h-4" />
            <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold flex items-center justify-center leading-none shadow-2xs">
              12
            </span>
          </button>

          {/* Admin Profile Pill */}
          <div className="flex items-center gap-2.5 pl-1">
            <Avatar className="w-8 h-8 rounded-full border border-border/80">
              <AvatarImage src="/avatars/admin.jpg" alt="John Admin" />
              <AvatarFallback className="bg-secondary/15 text-secondary text-xs font-bold">
                JA
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left">
              <span className="text-xs font-bold text-foreground leading-tight">
                John Admin
              </span>
              <span className="text-[10px] text-muted-foreground font-medium">
                Super Admin
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Title & Date Range Dropdown Row */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-1">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Revenue Overview
        </h1>

        {/* Date Range Selector */}
        <div className="flex items-center gap-2">
          <span className="text-xs font-medium text-muted-foreground">
            Date Range
          </span>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-xs font-semibold text-foreground transition-colors shadow-2xs cursor-pointer min-w-[120px] justify-between"
              >
                <span>{selectedRange}</span>
                <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
              </button>
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
        </div>
      </div>
    </header>
  );
}
