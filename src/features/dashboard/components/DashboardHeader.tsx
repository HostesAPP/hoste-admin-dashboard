// features/dashboard/components/DashboardHeader.tsx

"use client";

import React, { useState } from "react";
import { Calendar, Bell, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
    <header className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          Dashboard Overview
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Welcome back, Admin. Here&apos;s what&apos;s happening today.
        </p>
      </div>

      {/* Right Controls: Date Filter + Notification + Admin User Pill */}
      <div className="flex items-center gap-3">
        {/* Date Filter Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              type="button"
              className="inline-flex items-center gap-2 h-9 px-3.5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-xs font-semibold text-foreground transition-colors shadow-2xs cursor-pointer"
            >
              <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
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
    </header>
  );
}
