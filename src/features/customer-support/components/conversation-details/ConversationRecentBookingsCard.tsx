// features/customer-support/components/conversation-details/ConversationRecentBookingsCard.tsx

import React from "react";
import Link from "next/link";
import { Calendar } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { CustomerBookingItem } from "../../customer-support.types";

interface ConversationRecentBookingsCardProps {
  bookings?: CustomerBookingItem[];
}

export function ConversationRecentBookingsCard({
  bookings = [],
}: ConversationRecentBookingsCardProps) {
  const displayBookings =
    bookings.length > 0
      ? bookings
      : [
          {
            id: "b-1",
            title: "Wedding Reception",
            date: "August 25, 2026",
          },
          {
            id: "b-2",
            title: "Birthday Party",
            date: "July 25, 2026",
          },
          {
            id: "b-3",
            title: "Wedding Reception",
            date: "July 30, 2026",
          },
        ];

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col">
      <h3 className="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-4">
        Recent Bookings
      </h3>

      {/* Booking List */}
      <div className="space-y-4 flex-1">
        {displayBookings.map((b) => (
          <div key={b.id} className="flex items-center gap-3">
            <Avatar className="w-8 h-8 rounded-full border border-border/60 shrink-0">
              {b.image && <AvatarImage src={b.image} alt={b.title} />}
              <AvatarFallback className="bg-muted text-muted-foreground text-[10px]">
                <Calendar className="w-3.5 h-3.5" />
              </AvatarFallback>
            </Avatar>

            <div className="flex flex-col">
              <span className="text-xs font-bold text-foreground hover:text-primary transition-colors cursor-pointer">
                {b.title}
              </span>
              <span className="text-[11px] text-muted-foreground">{b.date}</span>
            </div>
          </div>
        ))}
      </div>

      {/* View All Bookings Button */}
      <div className="mt-6 pt-2">
        <Link href="/bookings" className="block w-full">
          <Button
            type="button"
            className="w-full h-9 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
          >
            View all bookings
          </Button>
        </Link>
      </div>
    </div>
  );
}
