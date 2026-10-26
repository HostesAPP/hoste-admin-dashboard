"use client";

import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { CheckCircle2 } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupInformation = ({ group }: { group: Group }) => {
  if (!group) return null;

  const totalMembers =
    group.memberCount ??
    group.membersCount ??
    (Array.isArray(group.members) ? group.members.length : 124);

  return (
    <section className="col-span-2 p-6 rounded-xl border border-border bg-card flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="pb-4 border-b border-border flex items-center justify-between">
        <h3 className="text-base font-bold text-foreground">
          Group Information
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="h-8 px-3 text-xs font-medium text-foreground hover:bg-muted cursor-pointer"
        >
          Edit Information
        </Button>
      </div>

      {/* 2-Column Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-8 py-5 text-xs">
        {/* Left Column */}
        <div className="space-y-4">
          <div>
            <span className="text-muted-foreground block mb-1">Group Name</span>
            <span className="font-semibold text-sm text-foreground">
              {group.name}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Category</span>
            <span className="font-semibold text-sm text-foreground">
              {group.category || "Event Hospitality"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Date Created</span>
            <span className="font-semibold text-sm text-foreground">
              {group.createdAt ? formatDate(group.createdAt) : "August 18, 2025"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Verification Status</span>
            <span className="font-semibold text-sm text-success inline-flex items-center gap-1.5">
              <CheckCircle2 className="w-4 h-4 fill-success text-card" />
              <span>Verified</span>
            </span>
          </div>
        </div>

        {/* Right Column */}
        <div className="space-y-4">
          <div>
            <span className="text-muted-foreground block mb-1">Group ID</span>
            <span className="font-semibold text-sm text-foreground">
              {group.id}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Group Status</span>
            <span className="font-semibold text-xs text-success bg-success/15 border border-success/30 px-2 py-0.5 rounded-full inline-flex items-center gap-1">
              <span className="w-1.5 h-1.5 rounded-full bg-success" />
              {group.status || "Active"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Total Members</span>
            <span className="font-semibold text-sm text-foreground">
              {totalMembers} Active Members
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block mb-1">Description</span>
            <p className="font-normal text-xs text-muted-foreground line-clamp-2">
              {group.description || "A professional event hospitality team providing trained staff for corporate events, private functions and nightlife experiences."}
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};