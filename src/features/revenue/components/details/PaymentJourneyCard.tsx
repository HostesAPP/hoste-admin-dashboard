// features/revenue/components/details/PaymentJourneyCard.tsx

"use client";

import React from "react";
import { CheckSquare } from "lucide-react";
import { PaymentJourneyStep } from "../../revenue.types";

interface PaymentJourneyCardProps {
  steps: PaymentJourneyStep[];
}

export function PaymentJourneyCard({ steps }: PaymentJourneyCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-6">
      <h2 className="text-sm font-bold text-foreground tracking-tight">
        Payment Journey
      </h2>

      <div className="space-y-6 pt-1">
        {steps.map((step) => (
          <div key={step.id} className="flex items-start gap-3.5 group">
            {/* Green Check Square Icon */}
            <div className="mt-0.5 shrink-0 text-secondary">
              <CheckSquare className="w-4 h-4 fill-secondary/15 stroke-secondary stroke-[2.2]" />
            </div>

            {/* Step Details */}
            <div className="space-y-0.5">
              <p className="text-xs font-bold text-foreground">
                {step.title}
              </p>
              <p className="text-xs text-muted-foreground font-medium">
                {step.timestamp} - {step.details}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
