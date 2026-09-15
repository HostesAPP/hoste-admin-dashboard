// features/revenue/components/details/RevenueDetailsHeader.tsx

"use client";

import React from "react";
import Link from "next/link";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function RevenueDetailsHeader() {
  return (
    <header className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2">
      {/* Breadcrumb & Subtitle */}
      <div>
        <nav className="flex items-center gap-2 text-sm font-bold text-foreground">
          <Link
            href="/"
            className="text-muted-foreground hover:text-foreground transition-colors font-semibold cursor-pointer"
          >
            Dashboard
          </Link>
          <span className="text-muted-foreground font-normal">/</span>
          <Link
            href="/revenue"
            className="text-muted-foreground hover:text-foreground transition-colors font-semibold cursor-pointer"
          >
            Total Revenue
          </Link>
          <span className="text-muted-foreground font-normal">/</span>
          <span className="text-foreground font-bold">Revenue Details</span>
        </nav>
        <p className="text-xs text-muted-foreground mt-1">
          Transaction overview and financial breakdown
        </p>
      </div>

      {/* Right Section: Search Bar + Notifications + User Profile */}
      <div className="flex items-center gap-3">
        {/* Search Bar */}
        <div className="relative w-48 sm:w-64">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground pointer-events-none" />
          <input
            type="text"
            placeholder="Search anything..."
            className="w-full h-9 pl-8 pr-3 text-xs rounded-xl border border-border/80 bg-card placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary/40 text-foreground"
          />
        </div>

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
