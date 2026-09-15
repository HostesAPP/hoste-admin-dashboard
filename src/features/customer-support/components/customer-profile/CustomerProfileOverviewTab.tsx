// features/customer-support/components/customer-profile/CustomerProfileOverviewTab.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  CheckCircle2,
  MessageSquare,
  Clock,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CustomerProfileData } from "../../customer-support.types";

interface CustomerProfileOverviewTabProps {
  profile: CustomerProfileData;
  onTabChange?: (tab: string) => void;
}

export function CustomerProfileOverviewTab({
  profile,
  onTabChange,
}: CustomerProfileOverviewTabProps) {
  const [activeTab, setActiveTab] = useState("Overview");

  const tabs = [
    "Overview",
    "Bookings",
    "Payments",
    "Support history",
    "Notes",
    "Documents",
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case "booking":
        return (
          <div className="w-6 h-6 rounded-md bg-orange-50 dark:bg-orange-950/40 text-primary flex items-center justify-center shrink-0">
            <Calendar className="w-3.5 h-3.5" />
          </div>
        );
      case "payment":
        return (
          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      case "support":
        return (
          <div className="w-6 h-6 rounded-md bg-sky-50 dark:bg-sky-950/40 text-sky-600 flex items-center justify-center shrink-0">
            <MessageSquare className="w-3.5 h-3.5" />
          </div>
        );
      case "resolved":
        return (
          <div className="w-6 h-6 rounded-md bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-3.5 h-3.5" />
          </div>
        );
      default:
        return (
          <div className="w-6 h-6 rounded-md bg-muted text-muted-foreground flex items-center justify-center shrink-0">
            <Clock className="w-3.5 h-3.5" />
          </div>
        );
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Tabs Navigation Row */}
      <div className="flex items-center gap-8 border-b border-border/70 pb-3 overflow-x-auto scrollbar-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => {
                setActiveTab(tab);
                onTabChange?.(tab);
              }}
              className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors relative cursor-pointer pb-2 -mb-3 ${
                isActive
                  ? "text-primary border-b-2 border-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* Overview Container Card */}
      <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-6">
        {/* Section Heading */}
        <h3 className="text-xs font-bold text-foreground">Overview</h3>

        {/* 4 Mini Stat Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {/* 1. Account Status */}
          <div className="bg-background rounded-xl border border-border/80 p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <span className="text-[11px] font-medium text-muted-foreground text-center">
              Account Status
            </span>
            <div className="mt-2 text-center">
              <span className="inline-block text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2.5 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
                {profile.overviewStats.accountStatus}
              </span>
            </div>
          </div>

          {/* 2. Verification Status */}
          <div className="bg-background rounded-xl border border-border/80 p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 dark:bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground text-center">
              Verification Status
            </span>
            <div className="mt-2 text-center">
              <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-700 dark:text-emerald-400">
                <ShieldCheck className="w-3 h-3 text-emerald-600" />
                {profile.overviewStats.verificationStatus}
              </span>
            </div>
          </div>

          {/* 3. Customer Since */}
          <div className="bg-background rounded-xl border border-border/80 p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-emerald-700 dark:bg-emerald-500" />
            <span className="text-[11px] font-medium text-muted-foreground text-center">
              Customer Since
            </span>
            <div className="mt-2 text-center">
              <span className="text-xs font-semibold text-foreground">
                {profile.overviewStats.customerSince}
              </span>
            </div>
          </div>

          {/* 4. Last Active */}
          <div className="bg-background rounded-xl border border-border/80 p-3.5 shadow-2xs relative overflow-hidden flex flex-col justify-between">
            <div className="absolute top-0 left-0 right-0 h-1 bg-primary" />
            <span className="text-[11px] font-medium text-muted-foreground text-center">
              Last active
            </span>
            <div className="mt-2 text-center">
              <span className="text-xs font-semibold text-foreground">
                {profile.overviewStats.lastActive}
              </span>
            </div>
          </div>
        </div>

        {/* About Section */}
        <div className="space-y-1.5 pt-1">
          <h4 className="text-xs font-bold text-foreground">
            About {profile.customerName.split(" ")[0]}
          </h4>
          <p className="text-xs text-muted-foreground leading-relaxed">
            {profile.about}
          </p>
        </div>
      </div>

      {/* Bottom 2-Column Split: Recent Activity & Support Summary */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
        {/* Left: Recent Activity */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <h3 className="text-xs font-bold text-foreground mb-4">
              Recent Activity
            </h3>

            <div className="space-y-3.5">
              {profile.recentActivities.map((act) => (
                <div key={act.id} className="flex items-start gap-3 text-xs">
                  {getActivityIcon(act.type)}
                  <div className="flex flex-col">
                    <span className="font-semibold text-foreground text-[11px] sm:text-xs">
                      {act.title}
                    </span>
                    <span className="text-[10px] text-muted-foreground">
                      {act.timestamp}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 pt-2">
            <Button
              type="button"
              variant="outline"
              className="w-full h-9 rounded-xl text-xs font-semibold border-border/80 text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
            >
              View full activity log
            </Button>
          </div>
        </div>

        {/* Right: Support Summary */}
        <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between min-h-[360px]">
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-xs font-bold text-foreground">
                Support Summary
              </h3>
              <Link
                href="/support-tickets"
                className="text-[11px] font-semibold text-primary hover:underline"
              >
                View all Tickets
              </Link>
            </div>

            {/* 6 Colored Metric Boxes (2x3 grid) */}
            <div className="grid grid-cols-2 gap-3">
              {/* Total Tickets */}
              <div className="bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Total Tickets
                </span>
                <span className="text-lg font-bold text-foreground mt-1">
                  {profile.supportSummary.total}
                </span>
              </div>

              {/* Open */}
              <div className="bg-amber-50/80 dark:bg-amber-950/30 border border-amber-200/50 dark:border-amber-900/40 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-amber-800 dark:text-amber-300 font-medium">
                  Open
                </span>
                <span className="text-lg font-bold text-amber-900 dark:text-amber-200 mt-1">
                  {profile.supportSummary.open}
                </span>
              </div>

              {/* Under Review */}
              <div className="bg-sky-50/80 dark:bg-sky-950/30 border border-sky-200/50 dark:border-sky-900/40 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-sky-800 dark:text-sky-300 font-medium">
                  Under Review
                </span>
                <span className="text-lg font-bold text-sky-900 dark:text-sky-200 mt-1">
                  {profile.supportSummary.underReview}
                </span>
              </div>

              {/* Closed (1st) */}
              <div className="bg-rose-50/80 dark:bg-rose-950/30 border border-rose-200/50 dark:border-rose-900/40 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-rose-800 dark:text-rose-300 font-medium">
                  Closed
                </span>
                <span className="text-lg font-bold text-rose-900 dark:text-rose-200 mt-1">
                  {profile.supportSummary.closed}
                </span>
              </div>

              {/* Resolved */}
              <div className="bg-emerald-50/80 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-emerald-800 dark:text-emerald-300 font-medium">
                  Resolved
                </span>
                <span className="text-lg font-bold text-emerald-900 dark:text-emerald-200 mt-1">
                  {profile.supportSummary.resolved}
                </span>
              </div>

              {/* Closed (2nd) */}
              <div className="bg-muted/40 dark:bg-muted/20 border border-border/60 rounded-xl p-3 flex flex-col justify-between">
                <span className="text-[11px] text-muted-foreground font-medium">
                  Closed
                </span>
                <span className="text-lg font-bold text-foreground mt-1">
                  {profile.supportSummary.closedSecond}
                </span>
              </div>
            </div>
          </div>

          <div className="mt-6 pt-2">
            <Link href="/support-tickets" className="block w-full">
              <Button
                type="button"
                className="w-full h-9 rounded-xl text-xs font-semibold bg-primary/15 text-primary hover:bg-primary/25 transition-colors cursor-pointer border border-primary/20 shadow-none"
              >
                View all tickets
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
