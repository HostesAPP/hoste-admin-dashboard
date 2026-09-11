"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ArrowUpRight } from "lucide-react";
import type {
  GroupMembershipOverviewData,
  GroupBookingAndRevenueData,
} from "../types/groups.types";

interface GroupMembershipAndRevenueGridProps {
  membershipOverview: GroupMembershipOverviewData;
  bookingRevenueData: GroupBookingAndRevenueData;
}

export const GroupMembershipAndRevenueGrid: React.FC<
  GroupMembershipAndRevenueGridProps
> = ({ membershipOverview, bookingRevenueData }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
      {/* Left Card: Group Membership Overview */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card flex flex-col justify-between">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Group Membership Overview
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Size distribution and member density per group
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1 px-6 pb-6 flex-1 flex flex-col justify-between">
          {/* 4 Metric Boxes */}
          <div className="grid grid-cols-4 gap-2.5">
            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Total Members
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-1">
                {membershipOverview.totalMembers.toLocaleString()}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Avg Members/Group
              </p>
              <p className="text-lg sm:text-xl font-bold text-primary mt-1">
                {membershipOverview.avgMembersPerGroup}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Smallest Group
              </p>
              <p className="text-lg sm:text-xl font-bold text-foreground mt-1">
                {membershipOverview.smallestGroup}
              </p>
            </div>

            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Largest Group
              </p>
              <p className="text-lg sm:text-xl font-bold text-secondary mt-1">
                {membershipOverview.largestGroup}
              </p>
            </div>
          </div>

          {/* Distribution by Group Size */}
          <div className="space-y-2.5 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Distribution by Group Size
            </p>

            <div className="space-y-2 text-xs">
              {membershipOverview.distribution.map((item) => (
                <div key={item.range} className="flex items-center gap-3">
                  <span className="w-24 text-[11px] font-medium text-muted-foreground shrink-0">
                    {item.range}
                  </span>
                  <div className="flex-1 h-3 rounded-full bg-muted/60 overflow-hidden">
                    <div
                      className="h-full rounded-full transition-all"
                      style={{
                        width: `${item.percentage}%`,
                        backgroundColor: item.barColor,
                      }}
                    />
                  </div>
                  <span className="w-16 text-right text-[11px] font-bold text-foreground shrink-0">
                    {item.percentage}% <span className="font-normal text-muted-foreground">({item.count})</span>
                  </span>
                </div>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Right Card: Booking Performance & Revenue (₦) */}
      <Card className="rounded-2xl border border-border shadow-xs bg-card flex flex-col justify-between">
        <CardHeader className="pb-2 pt-5 px-6">
          <CardTitle className="text-base font-bold text-foreground">
            Booking Performance &amp; Revenue (₦)
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            Financial metrics and conversion breakdown
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-4 pt-1 px-6 pb-6 flex-1 flex flex-col justify-between">
          {/* Top 3 Metric Boxes */}
          <div className="grid grid-cols-3 gap-2.5">
            {/* Box 1: Total Group Revenue (Orange Border) */}
            <div className="p-3 rounded-xl border border-primary bg-card">
              <p className="text-[10px] font-bold text-primary uppercase tracking-wider">
                Total Group Revenue
              </p>
              <p className="text-base sm:text-lg font-bold text-primary mt-0.5">
                {bookingRevenueData.totalGroupRevenue}
              </p>
              <p className="text-[10px] font-semibold text-secondary flex items-center gap-0.5 mt-0.5">
                <ArrowUpRight className="w-3 h-3" />
                {bookingRevenueData.revenueGrowth}
              </p>
            </div>

            {/* Box 2: Avg Revenue / Group */}
            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Avg Revenue / Group
              </p>
              <p className="text-base sm:text-lg font-bold text-foreground mt-0.5">
                {bookingRevenueData.avgRevenuePerGroup}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Across active groups
              </p>
            </div>

            {/* Box 3: Avg Booking Value */}
            <div className="p-3 rounded-xl border border-border/70 bg-muted/20">
              <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">
                Avg Booking Value
              </p>
              <p className="text-base sm:text-lg font-bold text-secondary mt-0.5">
                {bookingRevenueData.avgBookingValue}
              </p>
              <p className="text-[10px] text-muted-foreground mt-0.5">
                Per completed stay
              </p>
            </div>
          </div>

          {/* Middle: Booking Status Breakdown */}
          <div className="space-y-2 pt-1">
            <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Booking Status Breakdown
            </p>

            <div className="grid grid-cols-4 gap-2">
              <div className="p-2.5 rounded-xl border border-border/70 bg-muted/20 text-center">
                <p className="text-[10px] text-muted-foreground font-medium">Total Bookings</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {bookingRevenueData.totalBookings.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-border/70 bg-muted/20 text-center">
                <p className="text-[10px] text-muted-foreground font-medium">Confirmed</p>
                <p className="text-sm font-bold text-foreground mt-0.5">
                  {bookingRevenueData.confirmedBookings.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-emerald-500/20 bg-emerald-500/10 text-center">
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400 font-medium">Completed</p>
                <p className="text-sm font-bold text-emerald-700 dark:text-emerald-400 mt-0.5">
                  {bookingRevenueData.completedBookings.toLocaleString()}
                </p>
              </div>

              <div className="p-2.5 rounded-xl border border-rose-500/20 bg-rose-500/10 text-center">
                <p className="text-[10px] text-rose-700 dark:text-rose-400 font-medium">Cancelled</p>
                <p className="text-sm font-bold text-rose-700 dark:text-rose-400 mt-0.5">
                  {bookingRevenueData.cancelledBookings.toLocaleString()}
                </p>
              </div>
            </div>
          </div>

          {/* Footer Note */}
          <p className="text-xs text-muted-foreground pt-1">
            Average Bookings per Group:{" "}
            <span className="font-bold text-foreground">
              {bookingRevenueData.avgBookingsPerGroup}
            </span>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
