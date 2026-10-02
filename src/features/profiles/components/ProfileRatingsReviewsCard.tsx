"use client";

import { Star } from "lucide-react";
import type { Profile } from "../types/profiles.types";

interface ProfileRatingsReviewsCardProps {
  profile: Profile;
}

export function ProfileRatingsReviewsCard({
  profile,
}: ProfileRatingsReviewsCardProps) {
  const ratingScore = profile.rating?.toFixed(1) || "4.8";
  const reviewsCount = profile.reviewsCount || 128;
  const recentReview =
    profile.recentReviewText ||
    `“Almost event experience in weddings Customer Service and Public Speaking.”`;

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-soft p-6 space-y-3.5">
      <h3 className="text-sm font-bold text-foreground tracking-tight">
        Ratings &amp; Reviews
      </h3>

      <div className="flex items-center justify-between">
        <div className="text-2xl font-bold tracking-tight text-foreground">
          {ratingScore} <span className="text-sm text-muted-foreground font-normal">/ 5.0</span>
        </div>

        <div className="flex flex-col items-end gap-0.5">
          <div className="flex items-center gap-0.5 text-amber-400">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <span className="text-xs text-muted-foreground">
            {reviewsCount} Reviews
          </span>
        </div>
      </div>

      <div className="pt-1 border-t border-border/40 text-xs space-y-1">
        <span className="text-muted-foreground block">Recent review</span>
        <p className="text-foreground/80 leading-relaxed text-[11px]">
          {recentReview}
        </p>
      </div>
    </div>
  );
}
