// features/customer-support/components/customer-profile/CustomerProfileHeader.tsx

import React from "react";
import Link from "next/link";
import { ChevronLeft, Bell } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

interface CustomerProfileHeaderProps {
  backHref?: string;
}

export function CustomerProfileHeader({
  backHref = "/customer-support",
}: CustomerProfileHeaderProps) {
  return (
    <header className="flex items-center justify-between border-b border-border/70 bg-card px-8 py-5">
      {/* Left Back Navigation */}
      <div className="flex items-center gap-4">
        <Link
          href={backHref}
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Back</span>
        </Link>
      </div>

      {/* Center Title & Subtitle */}
      <div className="text-center">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Customer Profile
        </h1>
        <p className="text-xs sm:text-sm text-muted-foreground mt-0.5">
          Manage customer conversations and resolve issues
        </p>
      </div>

      {/* Right Controls: Notification Bell, Admin Profile */}
      <div className="flex items-center gap-6">
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
