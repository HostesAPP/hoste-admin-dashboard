"use client";

import type { Profile } from "../types/profiles.types";

interface ProfileAboutCardProps {
  profile: Profile;
}

export function ProfileAboutCard({ profile }: ProfileAboutCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-3">
      <h3 className="text-sm font-bold text-foreground tracking-tight">About</h3>

      <p className="text-xs text-muted-foreground leading-relaxed">
        {profile.aboutText ||
          `“Professional event host with experience in weddings, corporate events and private functions. Passionate about creating welcoming and memorable experiences for guests.”`}
      </p>
    </div>
  );
}
