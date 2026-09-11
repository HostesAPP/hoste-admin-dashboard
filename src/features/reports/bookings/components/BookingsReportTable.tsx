"use client";

import React from "react";
import { MoreHorizontal, Eye, User, Sparkles } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { BookingReportItem } from "../types/bookings.types";

interface BookingsReportTableProps {
  bookings: BookingReportItem[];
  onViewBooking: (bkg: BookingReportItem) => void;
}

export const BookingsReportTable: React.FC<BookingsReportTableProps> = ({
  bookings,
  onViewBooking,
}) => {
  const getBookingStatusBadge = (status: BookingReportItem["bookingStatus"]) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-blue-600" />
            Confirmed
          </span>
        );
      case "Completed":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Completed
          </span>
        );
      case "In Progress":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-purple-500/10 text-purple-600 border border-purple-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-purple-600" />
            In Progress
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Pending
          </span>
        );
      case "Cancelled":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  const getPaymentStatusBadge = (status: BookingReportItem["paymentStatus"]) => {
    switch (status) {
      case "Paid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-secondary/10 text-secondary border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
            Paid
          </span>
        );
      case "Partial":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-500/10 text-amber-600 border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-600" />
            Partial
          </span>
        );
      case "Unpaid":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-destructive/10 text-destructive border border-destructive/20">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive" />
            Unpaid
          </span>
        );
      case "Refunded":
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-primary/10 text-primary border border-primary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Refunded
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full overflow-x-auto rounded-xl border border-border/80 bg-card shadow-soft">
      <table className="w-full text-left border-collapse min-w-[1050px]">
        <thead>
          <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
            <th className="py-3.5 px-4">BOOKING ID</th>
            <th className="py-3.5 px-4">CUSTOMER / BRAND</th>
            <th className="py-3.5 px-4">HOSTÉ</th>
            <th className="py-3.5 px-4">BOOKING TYPE</th>
            <th className="py-3.5 px-4">EVENT DATE</th>
            <th className="py-3.5 px-4">AMOUNT (₦)</th>
            <th className="py-3.5 px-4">BOOKING STATUS</th>
            <th className="py-3.5 px-4">PAYMENT</th>
            <th className="py-3.5 px-4">CREATED</th>
            <th className="py-3.5 px-4 text-right">ACTION</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-border/60 text-xs">
          {bookings.length === 0 ? (
            <tr>
              <td colSpan={10} className="py-12 text-center text-muted-foreground">
                No booking records found matching your filters.
              </td>
            </tr>
          ) : (
            bookings.map((bkg) => (
              <tr key={bkg.id} className="hover:bg-muted/30 transition-colors">
                {/* BOOKING ID */}
                <td className="py-4 px-4 font-bold text-foreground whitespace-nowrap">
                  {bkg.bookingId}
                </td>

                {/* CUSTOMER / BRAND */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">
                      {bkg.customerName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {bkg.customerType}
                    </span>
                  </div>
                </td>

                {/* HOSTÉ */}
                <td className="py-4 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">
                      {bkg.hosteName}
                    </span>
                    <span className="text-[11px] text-muted-foreground">
                      {bkg.hosteRole}
                    </span>
                  </div>
                </td>

                {/* BOOKING TYPE */}
                <td className="py-4 px-4 font-medium text-foreground whitespace-nowrap">
                  {bkg.bookingType}
                </td>

                {/* EVENT DATE */}
                <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                  {bkg.eventDate}
                </td>

                {/* AMOUNT */}
                <td className="py-4 px-4 font-extrabold text-foreground whitespace-nowrap">
                  {bkg.amount}
                </td>

                {/* BOOKING STATUS */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {getBookingStatusBadge(bkg.bookingStatus)}
                </td>

                {/* PAYMENT */}
                <td className="py-4 px-4 whitespace-nowrap">
                  {getPaymentStatusBadge(bkg.paymentStatus)}
                </td>

                {/* CREATED */}
                <td className="py-4 px-4 text-muted-foreground whitespace-nowrap">
                  {bkg.createdDate}
                </td>

                {/* ACTION */}
                <td className="py-4 px-4 text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center justify-center">
                      <MoreHorizontal className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-48 rounded-xl">
                      <DropdownMenuItem
                        onClick={() => onViewBooking(bkg)}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Booking</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {}}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <User className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Customer</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {}}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <Sparkles className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Hosté Profile</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};
