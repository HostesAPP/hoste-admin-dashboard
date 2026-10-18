"use client";

import React from "react";
import Link from "next/link";
import { Bell } from "lucide-react";
import { CurrentUserTopNav } from "@/features/profiles";

interface PageHeaderLayoutProps {
  title: string;
  description: string;
  children?: React.ReactNode;
}

export const PageHeaderLayout = ({ title, description, children }: PageHeaderLayoutProps) => {
  return (
    <div className="flex items-center justify-between mb-6 border-b border-border px-6 py-3.5 bg-card/40">
      {/* Header  */}
      <div>
        <h1 className="text-xl font-bold tracking-tight text-foreground">{title}</h1>
        <p className="text-xs text-muted-foreground mt-0.5">{description}</p>
      </div>

      {/* Actions (search, filters, buttons) */}
      <div className="flex items-center gap-3">
        {children}
      </div>

      {/* Notification icon and Authenticated User Profile */}
      <div className="flex items-center gap-4">
        <Link
          href="/notifications"
          className="p-2 hover:bg-muted rounded-xl text-muted-foreground hover:text-foreground cursor-pointer transition-colors duration-200"
          aria-label="Notifications"
        >
          <Bell className="w-4 h-4" />
        </Link>
        <CurrentUserTopNav />
      </div>
    </div>
  );
};