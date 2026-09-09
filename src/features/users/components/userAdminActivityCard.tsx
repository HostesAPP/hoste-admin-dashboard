"use client";

import type { User } from "../types/users.types";

interface UserAdminActivityCardProps {
  user: User;
}

export function UserAdminActivityCard({ user }: UserAdminActivityCardProps) {
  const activity = user.adminActivity || {
    profilesReviewed: 248,
    usersManaged: 96,
    bookingsManaged: 184,
    reportsGenerated: 27,
  };

  return (
    <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between h-full">
      <div>
        <h3 className="text-sm font-bold text-foreground mb-4">
          Administrative Activity
        </h3>

        <div className="space-y-4 text-xs">
          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Profiles Reviewed</span>
            <span className="text-base sm:text-lg font-bold text-foreground">
              {activity.profilesReviewed.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Users Managed</span>
            <span className="text-base sm:text-lg font-bold text-foreground">
              {activity.usersManaged.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Bookings Managed</span>
            <span className="text-base sm:text-lg font-bold text-foreground">
              {activity.bookingsManaged.toLocaleString()}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-muted-foreground">Reports Generated</span>
            <span className="text-base sm:text-lg font-bold text-foreground">
              {activity.reportsGenerated.toLocaleString()}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
