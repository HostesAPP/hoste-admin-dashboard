import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { BrandAccountStatusItem } from "../types/brand-users.types";

interface BrandAccountStatusCardProps {
  data: BrandAccountStatusItem[];
}

export const BrandAccountStatusCard: React.FC<BrandAccountStatusCardProps> = ({ data }) => {
  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-base font-bold text-foreground">
          Account Status Breakdown
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 pt-1 flex-1 flex flex-col justify-between">
        {/* Multi-segment progress bar */}
        <div className="h-3 w-full rounded-full bg-muted overflow-hidden flex">
          {data.map((item) => (
            <div
              key={item.status}
              className={`${item.colorClass} h-full transition-all duration-300`}
              style={{ width: `${item.percentage}%` }}
            />
          ))}
        </div>

        {/* 2x2 grid of cards */}
        <div className="grid grid-cols-2 gap-3 pt-1">
          {data.map((item) => {
            const isPending = item.status === "Pending";
            const isSuspended = item.status === "Suspended";
            const isInactive = item.status === "Inactive";

            const containerStyle = isPending
              ? "border-amber-500/20 bg-amber-500/5"
              : isSuspended
              ? "border-destructive/20 bg-destructive/5"
              : isInactive
              ? "border-border/80 bg-muted/20"
              : "border-border/80 bg-background";

            const textStyle = isPending
              ? "text-amber-600 dark:text-amber-400"
              : isSuspended
              ? "text-destructive"
              : isInactive
              ? "text-muted-foreground"
              : "text-secondary";

            const dotStyle = isPending
              ? "bg-amber-500"
              : isSuspended
              ? "bg-destructive"
              : isInactive
              ? "bg-slate-500"
              : "bg-secondary";

            return (
              <div
                key={item.status}
                className={`p-3.5 rounded-xl border ${containerStyle} flex flex-col justify-between`}
              >
                <div className={`flex items-center gap-1.5 mb-1 ${textStyle} font-bold text-xs uppercase tracking-wider`}>
                  <span className={`w-2 h-2 rounded-full ${dotStyle} inline-block`} />
                  {item.label}
                </div>
                <div>
                  <p className="text-2xl font-bold text-foreground tracking-tight">{item.count}</p>
                  <p className="text-[11px] text-muted-foreground mt-0.5">{item.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};
