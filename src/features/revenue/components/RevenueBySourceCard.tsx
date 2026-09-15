// features/revenue/components/RevenueBySourceCard.tsx

"use client";

import React from "react";
import { RevenueSourceItem } from "../revenue.types";

interface RevenueBySourceCardProps {
  sources: RevenueSourceItem[];
}

export function RevenueBySourceCard({ sources }: RevenueBySourceCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-5">
      <h2 className="text-xs font-bold text-foreground">Revenue by Source</h2>

      <div className="space-y-4">
        {sources.map((src) => (
          <div key={src.id} className="space-y-1.5">
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground font-medium">{src.name}</span>
              <span className="font-bold text-foreground">{src.amount}</span>
            </div>

            <div className="w-full h-2 rounded-full bg-muted/60 overflow-hidden">
              <div
                style={{ width: `${src.percentage * 1.8}%` }}
                className={`h-full rounded-full ${src.colorClass} transition-all duration-500`}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
