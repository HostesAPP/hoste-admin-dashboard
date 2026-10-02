"use client";

import type { Profile } from "../types/profiles.types";

interface ProfilePersonalInfoCardProps {
  profile: Profile;
}

export function ProfilePersonalInfoCard({ profile }: ProfilePersonalInfoCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-4">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Personal Information
      </h3>

      <div className="grid grid-cols-2 gap-x-8 gap-y-3.5 text-xs">
        {/* Row 1 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Full Name</span>
          <span className="font-bold text-foreground">{profile.displayName}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Profession</span>
          <span className="text-foreground">
            {profile.profession || profile.categoryRole || "Professional Hosté"}
          </span>
        </div>

        {/* Row 2 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Email</span>
          <span className="text-foreground">{profile.email}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Location</span>
          <span className="text-foreground">
            {profile.city}, {profile.country}
          </span>
        </div>

        {/* Row 3 */}
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Phone</span>
          <span className="text-foreground">{profile.phone}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-muted-foreground">Date Joined</span>
          <span className="text-foreground">
            {profile.memberSince || "August 18, 2026"}
          </span>
        </div>
      </div>
    </div>
  );
}
