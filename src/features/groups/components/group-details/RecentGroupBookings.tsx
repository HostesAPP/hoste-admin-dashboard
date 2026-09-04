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
import { ArrowRight } from "lucide-react";
import { StatusBadge } from "@/components/shared";
import type { Group } from "@/features/groups";

const SAMPLE_BOOKINGS = [
  {
    id: "BK-10482",
    customer: "Accra Events Ltd",
    date: "Aug 28, 2026",
    amount: "250,000",
    status: "Confirmed",
  },
  {
    id: "BK-10450",
    customer: "GoldCoast Hospitality",
    date: "Aug 22, 2026",
    amount: "180,000",
    status: "Completed",
  },
];

export const RecentGroupBookings = ({ group }: { group?: Group }) => {
  return (
    <section className="rounded-xl border border-border bg-card shadow-xs overflow-hidden">
      {/* Header */}
      <div className="p-5 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          Recent Group Bookings
        </h3>
        <Link
          href={`/bookings`}
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
                Brand / Customer
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
            {SAMPLE_BOOKINGS.map((booking) => (
              <TableRow key={booking.id} className="hover:bg-muted/30 border-b border-border/70">
                <TableCell className="py-3.5 px-5 font-bold text-xs text-primary">
                  {booking.id}
                </TableCell>
                <TableCell className="py-3.5 text-xs font-medium text-foreground">
                  {booking.customer}
                </TableCell>
                <TableCell className="py-3.5 text-xs text-muted-foreground">
                  {booking.date}
                </TableCell>
                <TableCell className="py-3.5 text-xs font-bold text-foreground">
                  ₦{booking.amount}
                </TableCell>
                <TableCell className="py-3.5 text-right pr-6">
                  <StatusBadge status={booking.status} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
