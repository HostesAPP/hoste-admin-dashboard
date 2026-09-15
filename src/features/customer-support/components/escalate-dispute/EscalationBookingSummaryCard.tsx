// features/customer-support/components/escalate-dispute/EscalationBookingSummaryCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Calendar, Tag } from "lucide-react";
import { DisputeBookingDetails } from "../../customer-support.types";

interface EscalationBookingSummaryCardProps {
  booking?: DisputeBookingDetails;
}

export function EscalationBookingSummaryCard({
  booking = {
    id: "bk-1",
    title: "Wedding Reception",
    status: "Completed",
    hostName: "Grace Alex",
    bookingCode: "BK-2026-7842",
    eventDate: "Jul 28, 2026",
    amount: "120,000",
  },
}: EscalationBookingSummaryCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground">Booking Summary</h3>
        <Link
          href={`/bookings/${booking.bookingCode}`}
          className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline transition-all"
        >
          <span>View Details</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      <div className="flex items-center gap-3.5">
        <div className="w-14 h-11 rounded-lg bg-muted/80 border border-border/60 flex items-center justify-center overflow-hidden shrink-0">
          <img
            src="/events/wedding-banner.jpg"
            alt={booking.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              // Graceful fallback to colored icon placeholder if local image is missing
              (e.target as HTMLElement).style.display = "none";
            }}
          />
          <Calendar className="w-5 h-5 text-primary/70" />
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-semibold text-xs text-foreground truncate">
              {booking.title}
            </span>
            <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-secondary/10 text-secondary">
              {booking.status}
            </span>
          </div>
          <p className="text-[11px] text-muted-foreground mt-0.5">
            Hoste: {booking.hostName}
          </p>
        </div>
      </div>

      <div className="pt-2 border-t border-border/60 divide-y divide-border/40 text-xs">
        <div className="py-1.5 flex items-center justify-between">
          <span className="text-muted-foreground">Booking ID:</span>
          <span className="font-semibold text-foreground">{booking.bookingCode}</span>
        </div>
        <div className="py-1.5 flex items-center justify-between">
          <span className="text-muted-foreground">Event Date:</span>
          <span className="font-medium text-foreground">{booking.eventDate}</span>
        </div>
        <div className="py-1.5 flex items-center justify-between">
          <span className="text-muted-foreground">Amount:</span>
          <span className="font-semibold text-foreground">{booking.amount}</span>
        </div>
      </div>
    </div>
  );
}
