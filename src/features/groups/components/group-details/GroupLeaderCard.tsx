"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ArrowRight, UserCheck } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupLeaderCard = ({ group }: { group: Group }) => {
  const hasLeader = Boolean(group.leaderProfileId || group.leader?.id || group.leader?.displayName || group.leader?.name);
  const leaderName =
    group.leader?.displayName ||
    group.leader?.name ||
    (group.leaderProfileId ? `Leader (${group.leaderProfileId.slice(0, 8)}...)` : "Unassigned");
  const leaderEmail = group.leader?.email;
  const leaderAvatar = group.leader?.avatarUrl;

  const profileHref = group.leaderProfileId
    ? `/profiles/${group.leaderProfileId}`
    : group.leader?.profileId || group.leader?.id
    ? `/profiles/${group.leader.profileId || group.leader.id}`
    : null;

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
            <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
              {leaderName
                .split(" ")
                .filter(Boolean)
                .map((n) => n[0])
                .join("")
                .slice(0, 2)
                .toUpperCase() || "GL"}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-base">
              {leaderName}
            </h4>
            <p className="text-xs text-muted-foreground">
              {hasLeader ? "Designated Group Leader" : "Pending Assignment"}
            </p>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
          <div>
            <span>Email: </span>
            <span className="font-medium text-foreground">{leaderEmail || "—"}</span>
          </div>
          <div>
            <span>Status: </span>
            <span className="font-medium text-foreground">
              {hasLeader ? "Assigned" : "Unassigned"}
            </span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-2">
        {profileHref ? (
          <Button
            asChild
            variant="outline"
            className="w-full text-xs h-9 justify-center gap-1.5 border-border hover:bg-muted font-semibold text-primary"
          >
            <Link
              href={profileHref}
              className="inline-flex items-center gap-1.5 w-full justify-center"
            >
              <UserCheck className="w-3.5 h-3.5" />
              <span>View Leader Profile</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </Button>
        ) : (
          <Button
            variant="outline"
            disabled
            className="w-full text-xs h-9 justify-center border-border opacity-50"
          >
            No Leader Profile Linked
          </Button>
        )}
      </div>
    </section>
  );
};
