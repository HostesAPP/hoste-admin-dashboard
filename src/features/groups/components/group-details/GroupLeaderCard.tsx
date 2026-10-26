"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, Star } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupLeaderCard = ({ group }: { group: Group }) => {
  const hasLeader = Boolean(group.leaderProfileId || group.leader?.id || group.leader?.displayName || group.leader?.name);
  const leaderName =
    group.leader?.displayName ||
    group.leader?.name ||
    "Kofi Asante";
  const leaderEmail = group.leader?.email || "kofi.asante@hoste.com";
  const leaderAvatar = group.leader?.avatarUrl;
  const leaderPhone = (group.leader as { phone?: string })?.phone || "+233 24 123 4567";
  const leaderJoined = (group.leader as { joinedAt?: string })?.joinedAt || "Jan 12, 2025";
  const leaderRole = (group.leader as { title?: string })?.title || "Group Leader & Founder";
  const leaderRating = (group.leader as { rating?: number | string })?.rating || "4.93";
  const reviewsCount = (group.leader as { reviewsCount?: number })?.reviewsCount || 48;

  const profileHref = group.leaderProfileId
    ? `/profiles/${group.leaderProfileId}`
    : group.leader?.profileId || group.leader?.id
    ? `/profiles/${group.leader.profileId || group.leader.id}`
    : "/profiles/PRF-001";

  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="pb-4 border-b border-border">
        <h3 className="text-base font-bold text-foreground">Group Leader</h3>
      </div>

      {/* Leader Profile Info */}
      <div className="py-4 space-y-4">
        <div className="flex items-center gap-3.5">
          <Avatar className="w-12 h-12 border border-border">
            {leaderAvatar && <AvatarImage src={leaderAvatar} alt={leaderName} />}
            <AvatarFallback className="bg-slate-800 text-white font-bold text-sm">
              {leaderName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "KA"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-base text-foreground">
              {leaderName}
            </h4>
            <p className="text-xs text-muted-foreground">
              {leaderRole}
            </p>
            <div className="flex items-center gap-1 text-xs mt-0.5">
              <span className="font-bold text-foreground">{leaderRating}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
              <span className="text-muted-foreground">({reviewsCount} reviews)</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-muted-foreground pt-3 border-t border-border">
          <div>
            <span>Email: </span>
            <span className="font-medium text-foreground">{leaderEmail}</span>
          </div>
          <div>
            <span>Phone: </span>
            <span className="font-medium text-foreground">{leaderPhone}</span>
          </div>
          <div>
            <span>Joined Hosté: </span>
            <span className="font-medium text-foreground">{leaderJoined}</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-2">
        <Link
          href={profileHref}
          className="inline-flex items-center justify-center gap-1.5 w-full h-9 rounded-md border border-border/80 bg-background/50 hover:bg-muted text-xs font-semibold text-primary transition-all"
        >
          <span>View Leader Profile</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </section>
  );
};
