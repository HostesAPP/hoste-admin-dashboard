"use client";

import type { Profile } from "../types/profiles.types";

interface ProfileAvailabilityCardProps {
  profile: Profile;
}

export function ProfileAvailabilityCard({
  profile,
}: ProfileAvailabilityCardProps) {
  const availability = profile.availability || {
    status: "Available",
    days: "Monday – Saturday",
    hours: "8:00 AM – 8:00 PM",
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-3.5">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Availability
      </h3>

      <div className="space-y-2.5 text-xs">
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Availability Status</span>
          <span className="font-semibold text-secondary">
            {availability.status}
          </span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Available Days</span>
          <span className="text-foreground">{availability.days}</span>
        </div>

        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Working Hours</span>
          <span className="text-foreground">{availability.hours}</span>
        </div>
      </div>
    </div>
  );
}
