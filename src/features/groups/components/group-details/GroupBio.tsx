"use client";

import React from "react";
import { formatDate } from "@/lib/utils";
import { BadgeCheck, Users } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupDetailsBio = ({ group }: { group: Group }) => {
  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Group Logo / Avatar */}
      <div
        style={{
          backgroundColor: `${group?.color || "#EF5A22"}15`,
        }}
        className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex items-center justify-center shrink-0 border border-border/50 shadow-inner"
      >
        <div
          style={{
            backgroundColor: group?.color || "#EF5A22",
          }}
          className="w-10 h-10 sm:w-12 sm:h-12 rounded-xl flex items-center justify-center text-white shadow-sm"
        >
          <Users className="w-6 h-6 stroke-[2.5]" />
        </div>
      </div>

      {/* Group Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {group?.name}
          </h2>
          <span className="inline-flex items-center gap-1 bg-success/15 text-success border border-success/30 px-2.5 py-0.5 rounded-full text-xs font-semibold">
            <BadgeCheck className="w-3.5 h-3.5 fill-success text-card" />
            <span>Verified Group</span>
          </span>
        </div>

        <p className="text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {group?.description ||
            "A professional event hospitality team providing trained staff for corporate events, private functions and nightlife experiences."}
        </p>

        {/* Category, Created At and Group ID */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs sm:text-sm text-muted-foreground flex-wrap pt-1">
          <div>
            <span>Category: </span>
            <span className="font-semibold text-foreground">
              {group?.category || "Event Hospitality"}
            </span>
          </div>
          <span>•</span>
          <div>
            <span>Created: </span>
            <span className="font-semibold text-foreground">
              {group?.createdAt ? formatDate(group.createdAt) : "August 10, 2026"}
            </span>
          </div>
          <span>•</span>
          <div>
            <span>Group ID: </span>
            <span className="font-semibold text-foreground">{group?.id}</span>
          </div>
        </div>
      </div>
    </section>
  );
};