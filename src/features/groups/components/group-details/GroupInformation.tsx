"use client";

import { Button } from "@/components/ui/button";
import { formatDate } from "@/lib/utils";
import { Edit2 } from "lucide-react";
import type { Group } from "@/features/groups";

export const GroupInformation = ({ group }: { group: Group }) => {
  if (!group) return null;

  return (
    <section className="col-span-2 p-6 rounded-xl border border-border bg-card  flex-1 flex flex-col justify-between">
      {/* Header */}
      <div className="flex items-center justify-between pb-5 border-b border-border">
        <h3 className="text-base font-bold text-foreground">
          Group Information
        </h3>
        <Button
          variant="outline"
          size="sm"
          className="text-xs h-8 px-3 gap-1.5 border-border hover:bg-muted font-medium"
          onClick={() => alert("Edit Group Information modal")}
        >
          <Edit2 className="w-3.5 h-3.5 text-muted-foreground" />
          <span>Edit Information</span>
        </Button>
      </div>

      {/* 2-Column Fields Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-4 gap-x-6 py-5 text-xs">
        <div>
          <span className="text-muted-foreground block mb-1">Group Name</span>
          <span className="font-semibold text-sm text-foreground">
            {group?.name}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Group ID</span>
          <span className="font-semibold text-sm text-foreground">
            {group?.id}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Category</span>
          <span className="font-semibold text-sm text-foreground">
            {group?.category}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Group Status</span>
          <span className="font-semibold text-sm text-success inline-flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full bg-success" />
            {group?.status}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Date Created</span>
          <span className="font-semibold text-sm text-foreground">
            {group?.createdAt ? formatDate(group?.createdAt) : "August 10, 2026"}
          </span>
        </div>

        <div>
          <span className="text-muted-foreground block mb-1">Total Members</span>
          <span className="font-semibold text-sm text-foreground">
            124 Active Members
          </span>
        </div>

        <div className="w-full col-span-2">
          <span className="text-muted-foreground block mb-1">Description</span>
          <span className="font-medium text-xs text-muted-foreground line-clamp-2">
            {group?.description}
          </span>
        </div>
      </div>
    </section>
  );
};