"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ArrowRight, Star } from "lucide-react";
import { useAdminProfileDetail } from "@/features/profiles/hooks/use-profiles";
import { formatDate } from "@/lib/utils";
import type { Group } from "../../types/groups.types";

export const GroupLeaderCard = ({ group }: { group: Group }) => {
  const leaderId = group.leaderProfileId || group.leader?.profileId || group.leader?.id || "";
  const { data: leaderProfile, isLoading } = useAdminProfileDetail(leaderId);

  const hasLeader = Boolean(leaderId || group.leader?.displayName || group.leader?.name);

  if (isLoading && leaderId) {
    return (
      <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between animate-pulse">
        <div className="pb-4 border-b border-border">
          <div className="h-5 w-28 bg-muted rounded" />
        </div>
        <div className="py-4 space-y-4">
          <div className="flex items-center gap-3.5">
            <div className="w-12 h-12 rounded-full bg-muted" />
            <div className="space-y-1.5 flex-1">
              <div className="h-4 w-32 bg-muted rounded" />
              <div className="h-3 w-20 bg-muted rounded" />
            </div>
          </div>
          <div className="space-y-2 pt-3 border-t border-border">
            <div className="h-3 w-40 bg-muted rounded" />
            <div className="h-3 w-32 bg-muted rounded" />
          </div>
        </div>
        <div className="h-9 w-full bg-muted rounded-md" />
      </section>
    );
  }

  if (!hasLeader) {
    return (
      <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex-1 flex flex-col justify-between">
        <div className="pb-4 border-b border-border">
          <h3 className="text-base font-bold text-foreground">Group Leader</h3>
        </div>
        <div className="py-8 text-center text-xs text-muted-foreground">
          No leader assigned to this group yet.
        </div>
      </section>
    );
  }

  const leaderName =
    leaderProfile?.displayName ||
    group.leader?.displayName ||
    group.leader?.name ||
    (leaderId ? `Leader (${leaderId.slice(0, 8)}...)` : "Leader");

  const leaderEmail =
    leaderProfile?.email || group.leader?.email || "No email available";

  const leaderPhone =
    leaderProfile?.phone || "No phone available";

  const leaderAvatar = leaderProfile?.avatarUrl || group.leader?.avatarUrl;

  const leaderJoined = leaderProfile?.createdAt
    ? formatDate(leaderProfile.createdAt)
    : "Recent";

  const leaderRole = leaderProfile?.profileType
    ? `${leaderProfile.profileType} • Group Leader`
    : "Group Leader";

  const rating = leaderProfile?.rating
    ? Number(leaderProfile.rating).toFixed(1)
    : "—";

  const reviewsCount = leaderProfile?.completedBookingsCount ?? 0;

  const leaderInitials = leaderName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() || "GL";

  const profileHref = leaderId ? `/profiles/${leaderId}` : "#";

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
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-sm">
              {leaderInitials}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-base text-foreground">{leaderName}</h4>
            <p className="text-xs text-muted-foreground">{leaderRole}</p>
            <div className="flex items-center gap-1 text-xs mt-0.5">
              <span className="font-bold text-foreground">{rating}</span>
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400 inline" />
              <span className="text-muted-foreground">
                ({reviewsCount} engagements)
              </span>
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
        {leaderId ? (
          <Link
            href={profileHref}
            className="inline-flex items-center justify-center gap-1.5 w-full h-9 rounded-md border border-border/80 bg-background/50 hover:bg-muted text-xs font-semibold text-primary transition-all"
          >
            <span>View Leader Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        ) : (
          <span className="text-xs text-muted-foreground text-center block py-2">
            No profile link available
          </span>
        )}
      </div>
    </section>
  );
};
