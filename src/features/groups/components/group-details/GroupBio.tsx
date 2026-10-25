"use client";

import React from "react";
import { formatDate } from "@/lib/utils";
import { CheckCircle2, User } from "lucide-react";
import type { Group } from "../../types/groups.types";

export const GroupDetailsBio = ({ group }: { group: Group }) => {
  return (
    <section className="p-6 rounded-xl border border-border bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
      {/* Group Logo / Avatar */}
      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-orange-50 dark:bg-orange-950/20 flex items-center justify-center shrink-0 border border-orange-100 dark:border-orange-900/30">
        <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-primary-foreground shadow-sm">
          <User className="w-6 h-6 stroke-[2.2]" />
        </div>
      </div>

      {/* Group Info */}
      <div className="flex-1 space-y-2">
        <div className="flex items-center gap-2.5 flex-wrap">
          <h2 className="text-xl sm:text-2xl font-bold text-foreground">
            {group?.name || "Accra Social Club"}
          </h2>
          <span className="inline-flex items-center gap-1 text-success text-xs font-semibold">
            <CheckCircle2 className="w-4 h-4 fill-success text-card" />
            <span>Verified Group</span>
          </span>
        </div>

        <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed max-w-3xl">
          {group?.description ||
            "A professional event hospitality team providing trained staff for corporate events, private functions and nightlife experiences."}
        </p>

        {/* Category, Created At and Group ID */}
        <div className="flex items-center gap-2 sm:gap-3 text-xs text-muted-foreground flex-wrap pt-1">
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
              {group?.createdAt ? formatDate(group.createdAt) : "August 18, 2025"}
            </span>
          </div>
          <span>•</span>
          <div>
            <span>Group ID: </span>
            <span className="font-semibold text-foreground">{group?.id || "GRP-00124"}</span>
          </div>
        </div>
      </div>
    </section>
  );
};