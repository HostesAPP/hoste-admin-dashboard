// features/revenue/components/details/FinancialBreakdownCard.tsx

"use client";

import React from "react";
import { RevenueFinancialBreakdown } from "../../revenue.types";

interface FinancialBreakdownCardProps {
  breakdown: RevenueFinancialBreakdown;
}

export function FinancialBreakdownCard({ breakdown }: FinancialBreakdownCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-4">
      <h2 className="text-xs font-bold text-foreground tracking-tight">
        Financial Breakdown
      </h2>

      <div className="divide-y divide-border/60 text-xs">
        {/* Gross Amount */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Gross Amount</span>
          <span className="font-bold text-foreground">{breakdown.grossAmount}</span>
        </div>

        {/* Service Fee */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Service Fee (10%)</span>
          <span className="font-bold text-destructive">{breakdown.platformCommission}</span>
        </div>

        {/* Processing Fee */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Processing Fee</span>
          <span className="font-bold text-destructive">{breakdown.processingFee}</span>
        </div>

        {/* Hoste Payout */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-muted-foreground font-medium">Hoste Payout</span>
          <span className="font-bold text-foreground">{breakdown.hostePayout}</span>
        </div>

        {/* Net Revenue */}
        <div className="py-2.5 flex items-center justify-between">
          <span className="text-foreground font-bold">Net Revenue</span>
          <span className="font-bold text-foreground">{breakdown.netRevenue}</span>
        </div>
      </div>
    </div>
  );
}
