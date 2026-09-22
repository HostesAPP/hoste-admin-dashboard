// features/dashboard/components/DashboardRecentBookingsTable.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { DashboardRecentBooking } from "../dashboard.types";

interface DashboardRecentBookingsTableProps {
  bookings: DashboardRecentBooking[];
  isLoading?: boolean;
}

export function DashboardRecentBookingsTable({
  bookings,
  isLoading = false,
}: DashboardRecentBookingsTableProps) {
  const getStatusBadge = (status: DashboardRecentBooking["status"]) => {
    switch (status) {
      case "Confirmed":
        return "bg-secondary/10 text-secondary border border-secondary/20";
      case "Pending":
        return "bg-yellow-500/10 text-yellow-600 dark:text-yellow-400 border border-yellow-500/30";
      case "Completed":
        return "bg-muted text-muted-foreground border border-border/80";
      case "Cancelled":
        return "bg-destructive/10 text-destructive border border-destructive/20";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-foreground">Recent Bookings</h2>
        <Link
          href="/bookings"
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all"
        >
          <span>View All</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] text-muted-foreground border-b border-border/60">
              <th className="pb-3 font-semibold tracking-wider">BOOKING ID</th>
              <th className="pb-3 font-semibold tracking-wider">CUSTOMER</th>
              <th className="pb-3 font-semibold tracking-wider">HOSTÉ</th>
              <th className="pb-3 font-semibold tracking-wider">EVENT DATE</th>
              <th className="pb-3 font-semibold tracking-wider">AMOUNT</th>
              <th className="pb-3 font-semibold tracking-wider text-right">STATUS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {isLoading ? (
              [1, 2, 3, 4, 5].map((i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-3.5"><div className="h-3.5 w-20 bg-muted rounded" /></td>
                  <td className="py-3.5"><div className="h-3.5 w-28 bg-muted rounded" /></td>
                  <td className="py-3.5"><div className="h-3.5 w-24 bg-muted rounded" /></td>
                  <td className="py-3.5"><div className="h-3.5 w-20 bg-muted rounded" /></td>
                  <td className="py-3.5"><div className="h-3.5 w-16 bg-muted rounded" /></td>
                  <td className="py-3.5 text-right"><div className="h-5 w-16 bg-muted rounded-full ml-auto" /></td>
                </tr>
              ))
            ) : bookings.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center text-xs text-muted-foreground">
                  No recent bookings found.
                </td>
              </tr>
            ) : (
              bookings.map((booking) => (
                <tr
                  key={booking.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  <td className="py-3.5 font-bold text-foreground">
                    <Link
                      href={`/bookings/${booking.bookingCode}`}
                      className="hover:text-primary transition-colors"
                    >
                      {booking.bookingCode}
                    </Link>
                  </td>
                  <td className="py-3.5 font-bold text-foreground">
                    {booking.customerName}
                  </td>
                  <td className="py-3.5 text-muted-foreground font-medium">
                    {booking.hosteName}
                  </td>
                  <td className="py-3.5 text-muted-foreground">
                    {booking.eventDate}
                  </td>
                  <td className="py-3.5 font-bold text-foreground">
                    {booking.amount}
                  </td>
                  <td className="py-3.5 text-right">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold ${getStatusBadge(
                        booking.status
                      )}`}
                    >
                      {booking.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
