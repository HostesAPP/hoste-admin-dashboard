import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { BrandReportKpiMetric } from "../types/brand-users.types";

interface BrandUsersKpiCardsProps {
  metrics: BrandReportKpiMetric[];
}

export const BrandUsersKpiCards: React.FC<BrandUsersKpiCardsProps> = ({ metrics }) => {
  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3.5">
      {metrics.map((metric) => (
        <Card
          key={metric.id}
          className="rounded-lg py-2 border bg-card shadow-xs transition-all hover:shadow-sm"
        >
          <CardContent className="p-4">
            <p className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
              {metric.label}
            </p>
            <div className="flex flex-col gap-1.5">
              <h3 className="text-xl sm:text-2xl font-bold text-foreground tracking-tight">
                {metric.value}
              </h3>
              <div className="flex items-center">
                <span
                  className={`inline-flex items-center gap-0.5 text-[11px] font-medium px-2 py-0.5 rounded-full ${metric.isPositive
                      ? "bg-secondary/10 text-secondary border border-secondary/20"
                      : "bg-amber-500/10 text-amber-600 border border-amber-500/20"
                    }`}
                >
                  {metric.isPositive ? (
                    <ArrowUpRight className="w-3 h-3 stroke-[2.5]" />
                  ) : (
                    <ArrowDownRight className="w-3 h-3 stroke-[2.5]" />
                  )}
                  <span>{metric.change}</span>
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};
