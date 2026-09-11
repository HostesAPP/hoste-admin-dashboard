"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import type { PlatformActivityKpiMetric } from "../types/platform-activity.types";

interface PlatformActivityKpiCardsProps {
  kpis: PlatformActivityKpiMetric[];
}

export const PlatformActivityKpiCards: React.FC<PlatformActivityKpiCardsProps> = ({
  kpis,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-6 gap-3.5">
      {kpis.map((kpi) => (
        <Card
          key={kpi.id}
          className={`rounded-2xl border shadow-xs bg-card transition-all ${
            kpi.isHighlighted
              ? "border-primary"
              : "border-border"
          }`}
        >
          <CardContent className="p-4 sm:p-4.5 flex flex-col justify-between h-full">
            <div>
              <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">
                {kpi.label}
              </p>
              <h3
                className={`text-xl sm:text-2xl font-bold tracking-tight mt-1.5 ${
                  kpi.valueColor === "secondary"
                    ? "text-secondary"
                    : kpi.valueColor === "primary"
                    ? "text-primary"
                    : "text-foreground"
                }`}
              >
                {kpi.value}
              </h3>
            </div>

            <div className="flex items-center gap-1.5 mt-3">
              <Badge
                variant="outline"
                className={`text-[10px] font-bold px-1.5 py-0.5 rounded-md ${
                  kpi.isPositive
                    ? "bg-secondary/10 text-secondary border-secondary/20"
                    : "bg-destructive/10 text-destructive border-destructive/20"
                }`}
              >
                {kpi.change}
              </Badge>
              <span className="text-[10px] text-muted-foreground">vs last period</span>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
