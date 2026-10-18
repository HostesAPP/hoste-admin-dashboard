"use client";

import { formatDate } from "@/lib/utils";
import type { Group } from "../../types/groups.types";

export const GroupInformation = ({ group }: { group: Group }) => {
  if (!group) return null;

  const totalMembers =
    group.memberCount ??
    group.membersCount ??
    (Array.isArray(group.members) ? group.members.length : "—");

  return (
    <section className="col-span-2 p-6 rounded-xl border border-border bg-card flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="pb-5 border-b border-border">
        <h3 className="text-base font-bold text-foreground">
          Group Information
        </h3>
      </div>

      {/* 2-Column Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-5 text-xs">
        <div>
          <span className="text-muted-foreground block mb-1">Group Name</span>
          <span className="font-semibold text-sm text-foreground">
            {group.name}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Group ID</span>
          <span className="font-semibold text-sm text-foreground">
            {group.id}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Category</span>
          <span className="font-semibold text-sm text-foreground">
            {group.category || "General"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Group Status</span>
          <span className="font-semibold text-sm text-success inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {group.status || "Active"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Date Created</span>
          <span className="font-semibold text-sm text-foreground">
            {group.createdAt ? formatDate(group.createdAt) : "—"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Total Members</span>
          <span className="font-semibold text-sm text-foreground">
            {totalMembers}
          </span>
        </div>

        <div className="w-full col-span-2">
          <span className="text-muted-foreground block mb-1">Description</span>
          <span className="font-medium text-xs text-muted-foreground line-clamp-3">
            {group.description || "No description provided."}
          </span>
        </div>
      </div>
    </section>
  );
};