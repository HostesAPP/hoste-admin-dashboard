import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { EventPlannerReportKpiMetric } from "../types/event-planners.types";

interface EventPlannersKpiCardsProps {
  metrics: EventPlannerReportKpiMetric[];
}

export const EventPlannersKpiCards: React.FC<EventPlannersKpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className={`rounded-2xl py-1.5 border bg-card shadow-xs transition-all hover:shadow-sm ${
            metric.highlight
              ? "border-primary/50 bg-primary/[0.03]"
              : "border-border"
          }`}
        >
          <CardContent className="p-4 space-y-2">
            <p className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
              {metric.label}
            </p>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {metric.value}
              </h3>
              <div className="flex items-center gap-1.5 flex-wrap">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${
                    metric.isPositive
                      ? "bg-secondary/10 text-secondary border border-secondary/20"
                      : "bg-destructive/10 text-destructive border border-destructive/20"
                  }`}
                >
                  {metric.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>{metric.change}</span>
                </span>
                {metric.subtext && (
                  <span className="text-[10px] text-muted-foreground font-medium">
                    {metric.subtext}
                  </span>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
