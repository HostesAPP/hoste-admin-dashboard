// features/revenue/components/details/BookingInformationCard.tsx

"use client";

import React from "react";
import { RevenueBookingInformation } from "../../revenue.types";

interface BookingInformationCardProps {
  booking: RevenueBookingInformation;
}

export function BookingInformationCard({ booking }: BookingInformationCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-5">
      <h2 className="text-xs font-bold text-foreground tracking-tight">
        Booking Information
      </h2>

      <div className="grid grid-cols-2 gap-y-4 gap-x-6 text-xs">
        {/* Row 1 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Brand Name
          </span>
          <span className="font-bold text-foreground block truncate">
            {booking.brandName}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Hoste Name
          </span>
          <span className="font-bold text-foreground block truncate">
            {booking.hosteName}
          </span>
        </div>

        {/* Row 2 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Booking Type
          </span>
          <span className="font-bold text-foreground block">
            {booking.bookingType}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Event Name
          </span>
          <span className="font-bold text-foreground block truncate">
            {booking.eventName}
          </span>
        </div>

        {/* Row 3 */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Event Date
          </span>
          <span className="font-bold text-foreground block">
            {booking.eventDate}
          </span>
        </div>

        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Event Location
          </span>
          <span className="font-bold text-foreground block leading-snug">
            {booking.eventLocation}
          </span>
        </div>
      </div>
    </div>
  );
}
