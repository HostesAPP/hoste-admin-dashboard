"use client";

import Link from "next/link";
import { ArrowLeft, Calendar, MapPin, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface UserBreadcrumbBarProps {
  userCode: string;
  roleTitle?: string;
  onExport?: () => void;
}

export function UserBreadcrumbBar({
  userCode,
  roleTitle = "Admin Details",
  onExport,
}: UserBreadcrumbBarProps) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      {/* Left: Breadcrumbs & Back Link */}
      <div className="flex flex-col gap-1.5">
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
          <Link href="/users" className="hover:text-foreground transition-colors">
            Users
          </Link>
          <span>/</span>
          <span className="font-mono">{userCode}</span>
          <span>/</span>
          <span className="text-foreground font-medium">{roleTitle}</span>
        </div>

        <Link
          href="/users"
          className="inline-flex items-center gap-1.5 text-xs font-semibold text-foreground hover:text-primary transition-colors mt-0.5"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Back to Users</span>
        </Link>
      </div>

      {/* Right: Date, Location & Export Button */}
      <div className="flex items-center gap-4 self-start sm:self-auto">
        <div className="hidden md:flex items-center gap-4 text-xs text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Friday, August 21, 2026</span>
          </div>
          <div className="flex items-center gap-1.5">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground" />
            <span>Nigeria</span>
          </div>
        </div>

        <Button
          onClick={onExport}
          className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm px-4 py-2 rounded-lg shadow-xs transition-colors gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Export Users</span>
        </Button>
      </div>
    </div>
  );
}
