"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import type { PlatformAreaActivityItem } from "../types/platform-activity.types";

interface ActivityByPlatformAreaCardProps {
  items: PlatformAreaActivityItem[];
}

export const ActivityByPlatformAreaCard: React.FC<
  ActivityByPlatformAreaCardProps
> = ({ items }) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-3 px-6 pt-5">
        <CardTitle className="text-base font-bold text-foreground">
          Activity by Platform Area
        </CardTitle>
        <CardDescription className="text-xs text-muted-foreground mt-0.5">
          Interaction distribution across functional core modules
        </CardDescription>
      </CardHeader>

      <CardContent className="px-6 pb-6 pt-2 space-y-2">
        {items.map((item) => (
          <div key={item.id} className="flex items-center gap-4 text-xs">
            {/* Left Area Label */}
            <span className="w-32 sm:w-36 font-bold text-foreground shrink-0">
              {item.areaName}
            </span>

            {/* Middle Capsule Progress Bar */}
            <div className="flex-1 h-3 rounded-full bg-muted/60 overflow-hidden relative">
              <div
                className={`h-full rounded-full transition-all ${item.colorClass}`}
                style={{ width: `${item.percentage}%` }}
              />
            </div>

            {/* Right Value & Count */}
            <span className="font-bold text-foreground shrink-0 min-w-[75px] whitespace-nowrap">
              {item.percentage}% ({item.volumeFormatted})
            </span>
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
