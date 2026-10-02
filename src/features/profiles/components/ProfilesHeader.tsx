"use client";

import { Search, Bell } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface ProfilesHeaderProps {
  searchQuery: string;
  onSearchChange: (val: string) => void;
}

export function ProfilesHeader({
  searchQuery,
  onSearchChange,
}: ProfilesHeaderProps) {
  return (
    <div className="flex items-center justify-between gap-4 py-4 px-8 border-b border-border/60 bg-card">
      {/* Title & Subtitle */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">
          Profiles
        </h1>
        <p className="text-xs text-muted-foreground mt-0.5">
          Host profile approvals &amp; account management
        </p>
      </div>

      {/* Right Controls: Search, Notification Bell, Admin Profile */}
      <div className="flex items-center gap-6">
        {/* Search Input */}
        <div className="relative w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <Input
            type="search"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search by name, email, profile ..."
            className="pl-9 pr-4 h-9 text-xs rounded-full bg-muted/40 border-border/70 focus-visible:ring-primary focus-visible:ring-1 transition-colors"
          />
        </div>

        {/* Notification Bell with Badge */}
        <div className="relative p-2 rounded-full hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-1 right-1 flex items-center justify-center min-w-4 h-4 px-1 rounded-full bg-primary text-primary-foreground text-[10px] font-bold leading-none ring-2 ring-card">
            12
          </span>
        </div>

        {/* Admin Profile */}
        <div className="flex items-center gap-3">
          <Avatar className="w-9 h-9 border border-border/60">
            <AvatarImage src="/avatar-admin.png" alt="John Admin" />
            <AvatarFallback className="text-xs font-semibold bg-primary/10 text-primary">
              JA
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col text-left">
            <span className="text-xs font-semibold text-foreground leading-tight">
              John Admin
            </span>
            <span className="text-[11px] text-muted-foreground leading-tight">
              Super Admin
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
