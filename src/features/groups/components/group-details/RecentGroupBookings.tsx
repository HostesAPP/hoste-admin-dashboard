"use client";

import React from "react";
import Link from "next/link";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ArrowRight, Calendar } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import { formatDate } from "@/lib/utils";
import type { Group } from "../../types/groups.types";

export const RecentGroupBookings = ({ group }: { group?: Group }) => {
  // If the group object contains real bookings/engagements from the backend
  const bookings = Array.isArray(group?.engagements)
    ? (group.engagements as Array<{
        id: string;
        referenceId?: string;
        title?: string;
        startDate?: string;
        totalAmount?: number;
        status?: string;
      }>)
    : [];

  return (
    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          Recent Group Bookings
        </h3>
        <Link
          href={`/engagements?groupId=${group?.id || ""}`}
          className="text-xs font-semibold text-primary hover:underline inline-flex items-center gap-1"
        >
          <span>View All Bookings</span>
          <ArrowRight className="w-3 h-3" />
        </Link>
      </div>

      {/* Bookings Table */}
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/30 hover:bg-muted/30 border-b border-border">
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3 px-5">
                Booking ID
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Title / Details
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Date
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3">
                Amount
              </TableHead>
              <TableHead className="font-semibold text-xs text-muted-foreground uppercase tracking-wider py-3 text-right pr-6">
                Status
              </TableHead>
            </TableRow>
          </TableHeader>

          <TableBody>
            {bookings.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-8 text-center text-muted-foreground">
                  <div className="flex flex-col items-center justify-center gap-1.5">
                    <Calendar className="w-5 h-5 text-muted-foreground/60" />
                    <p className="text-xs font-medium">No recent bookings recorded for this group</p>
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              bookings.map((booking) => (
                <TableRow key={booking.id} className="hover:bg-muted/30 border-b border-border/70">
                  <TableCell className="py-3.5 px-5 font-bold text-xs text-primary">
                    {booking.referenceId || booking.id}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs font-medium text-foreground">
                    {booking.title || "Group Engagement"}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {booking.startDate ? formatDate(booking.startDate) : "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs font-bold text-foreground">
                    {booking.totalAmount != null ? `₦${booking.totalAmount.toLocaleString()}` : "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-right pr-6">
                    <StatusBadge status={booking.status || "Accepted"} />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
