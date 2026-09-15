// features/support-tickets/components/SupportTicketsHeader.tsx

import React from "react";
import { Search, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Input } from "@/components/ui/input";

interface SupportTicketsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SupportTicketsHeader({
  searchQuery,
  onSearchChange,
}: SupportTicketsHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border/70 bg-card px-8 py-5">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Support Tickets
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Escalated issues from Lade AI to human support
        </p>
      </div>

      {/* Right Controls: Search, Notification Bell, Admin Profile */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            placeholder="Search Tickets..."
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            className="h-10 pl-9 pr-4 rounded-xl border-border/80 bg-muted/40 text-xs placeholder:text-muted-foreground/70 focus-visible:ring-primary"
          />
        </div>

        {/* Notification Bell */}
        <button
          type="button"
          className="relative p-2 rounded-xl text-muted-foreground hover:text-foreground hover:bg-muted/60 transition-colors cursor-pointer"
          aria-label="Notifications"
        >
          <Bell className="w-5 h-5" />
          <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-primary text-[10px] font-bold text-primary-foreground flex items-center justify-center shadow-xs">
            12
          </span>
        </button>

        {/* User Profile */}
        <div className="flex items-center gap-3 pl-2 border-l border-border/60">
          <Avatar className="w-9 h-9 border border-border">
            <AvatarImage src="/avatar-john.png" alt="John Admin" />
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-xs">
              JA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left leading-tight">
            <span className="font-bold text-xs text-foreground">John Admin</span>
            <span className="text-[11px] text-muted-foreground">Super Admin</span>
          </div>
        </div>
      </div>
    </header>
  );
}
