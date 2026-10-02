"use client";

import type { Profile } from "../types/profiles.types";

interface ProfileBookingHistoryCardProps {
  profile: Profile;
}

export function ProfileBookingHistoryCard({
  profile,
}: ProfileBookingHistoryCardProps) {
  const defaultHistory = [
    {
      event: "Wedding",
      client: "John O.",
      date: "Aug 15, 2026",
      status: "Completed" as const,
    },
    {
      event: "Corporate Event",
      client: "ABC Ltd",
      date: "Aug 10, 2026",
      status: "Completed" as const,
    },
  ];

  const bookingHistory = profile.bookingHistory?.length
    ? profile.bookingHistory
    : defaultHistory;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-3.5">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Booking History
      </h3>

      <div className="w-full text-xs">
        {/* Table Header */}
        <div className="grid grid-cols-4 pb-2 border-b border-border/60 text-muted-foreground font-medium">
          <div>Event</div>
          <div>Client</div>
          <div>Date</div>
          <div className="text-right">Status</div>
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-border/30">
          {bookingHistory.map((item, idx) => (
            <div key={idx} className="grid grid-cols-4 py-2.5 items-center">
              <span className="font-semibold text-foreground">{item.event}</span>
              <span className="text-muted-foreground">{item.client}</span>
              <span className="text-muted-foreground">{item.date}</span>
              <span className="text-right font-semibold text-secondary">
                {item.status}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
