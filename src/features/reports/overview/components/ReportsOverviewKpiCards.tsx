"use client";

import React from "react";
import { ChevronUp, ChevronDown } from "lucide-react";
import type { OverviewKpiMetric } from "../types/overview.types";

interface ReportsOverviewKpiCardsProps {
  metrics: OverviewKpiMetric[];
}

export const ReportsOverviewKpiCards: React.FC<ReportsOverviewKpiCardsProps> = ({
  metrics,
}) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {metrics.map((metric) => (
        <div
          key={metric.id}
          className="bg-card border border-border/80 rounded-2xl p-4 shadow-soft flex flex-col justify-between hover:border-border transition-all duration-200"
        >
          {/* Label */}
          <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
            {metric.label}
          </span>

          {/* Value */}
          <div className="my-2">
            <span className="text-lg xl:text-xl font-extrabold tracking-tight text-foreground">
              {metric.value}
            </span>
          </div>

          {/* Change Badge */}
          <div>
            <span
              className={`inline-flex items-center gap-0.5 px-2 py-0.5 rounded-full text-[11px] font-bold ${
                metric.isPositive
                  ? "bg-secondary/10 text-secondary"
                  : "bg-destructive/10 text-destructive"
              }`}
            >
              {metric.isPositive ? (
                <ChevronUp className="w-3.5 h-3.5" />
              ) : (
                <ChevronDown className="w-3.5 h-3.5" />
              )}
              <span>{metric.change}</span>
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};
