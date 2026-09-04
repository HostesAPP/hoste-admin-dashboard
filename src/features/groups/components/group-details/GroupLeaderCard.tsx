"use client";

import React from "react";
import Link from "next/link";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Star, ArrowRight } from "lucide-react";
import { getGroupLeader, type Group } from "@/features/groups";

export const GroupLeaderCard = ({ group }: { group: Group }) => {
  const leader = getGroupLeader(group.leaderProfileId);
  const leaderName = leader?.displayName || "Kofi Asante";
  const leaderEmail = leader?.email || "kofi.asante@hoste.com";
  const leaderPhone = leader?.phone || "+233 24 123 4567";

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
            <AvatarFallback className="bg-primary/15 text-primary font-bold text-sm">
              {leaderName
                .split(" ")
                .map((n) => n[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <h4 className="font-bold text-base">
              {leaderName}
            </h4>
            <p className="text-xs text-muted-foreground">
              Group Leader & Founder
            </p>
            <div className="flex items-center gap-1 text-xs mt-0.5">
              <span className="font-bold text-yellow">4.95</span>
              <Star className="w-3.5 h-3.5 fill-yellow text-yellow inline -mt-0.5" />
              <span className="text-muted-foreground">(48 reviews)</span>
            </div>
          </div>
        </div>

        {/* Contact info */}
        <div className="space-y-1.5 text-xs text-muted-foreground pt-1 border-t border-border/60">
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
            <span className="font-medium text-foreground">Jan 12, 2025</span>
          </div>
        </div>
      </div>

      {/* Action button */}
      <div className="pt-2">
        <Button
          variant="outline"
          className="w-full text-xs h-9 justify-center gap-1.5 border-border hover:bg-muted font-semibold text-primary"
        >
          <Link
            href={`/profiles/${group.leaderProfileId}`}
            className="inline-flex items-center gap-1.5 w-full justify-center"
          >
            <span>View Leader Profile</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </Button>
      </div>
    </section>
  );
};
