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
import { formatDate } from "@/lib/utils";
import type { Group } from "../../types/groups.types";

const DEFAULT_BOOKINGS = [
  {
    id: "bkg-1",
    referenceId: "BK-10482",
    brandCustomer: "Accra Events Ltd",
    date: "2026-08-25",
    amount: 250000,
    status: "Confirmed",
  },
  {
    id: "bkg-2",
    referenceId: "BK-10450",
    brandCustomer: "GoldCoast Hospitality",
    date: "2026-08-22",
    amount: 180000,
    status: "Completed",
  },
];

export const RecentGroupBookings = ({ group }: { group?: Group }) => {
  const backendBookings = Array.isArray(group?.engagements)
    ? (group.engagements as Array<{
        id: string;
        referenceId?: string;
        title?: string;
        customerName?: string;
        brandName?: string;
        startDate?: string;
        totalAmount?: number;
        status?: string;
      }>)
    : [];

  const bookings = backendBookings.length > 0 ? backendBookings : DEFAULT_BOOKINGS;

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
            {bookings.map((booking) => {
              const bookingRef =
                ("referenceId" in booking && booking.referenceId) ||
                booking.id ||
                "BK-10482";
              const brandCustomer =
                ("brandCustomer" in booking && booking.brandCustomer) ||
                ("brandName" in booking && booking.brandName) ||
                ("customerName" in booking && booking.customerName) ||
                ("title" in booking && booking.title) ||
                "Accra Events Ltd";
              const dateVal =
                ("date" in booking && booking.date) ||
                ("startDate" in booking && booking.startDate);
              const amountVal =
                ("amount" in booking && booking.amount) ??
                ("totalAmount" in booking && booking.totalAmount) ??
                250000;

              return (
                <TableRow
                  key={booking.id}
                  className="hover:bg-muted/30 border-b border-border/70"
                >
                  <TableCell className="py-3.5 px-5 font-bold text-xs text-primary">
                    {bookingRef}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs font-medium text-foreground">
                    {brandCustomer}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs text-muted-foreground">
                    {dateVal ? formatDate(dateVal) : "—"}
                  </TableCell>
                  <TableCell className="py-3.5 text-xs font-bold text-foreground">
                    ₦{amountVal.toLocaleString()}
                  </TableCell>
                  <TableCell className="py-3.5 text-right pr-6">
                    <StatusBadge status={booking.status || "Completed"} />
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
    </section>
  );
};
