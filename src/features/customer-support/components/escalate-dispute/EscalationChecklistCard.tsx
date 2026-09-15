// features/customer-support/components/escalate-dispute/EscalationChecklistCard.tsx

"use client";

import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

interface EscalationChecklistCardProps {
  hasEvidence?: boolean;
}

export function EscalationChecklistCard({
  hasEvidence = false,
}: EscalationChecklistCardProps) {
  const checklist = [
    {
      id: "verified-details",
      text: "Have you verified the booking and payment details?",
      checked: true,
    },
    {
      id: "communicated-customer",
      text: "Have you communicated with the customer?",
      checked: true,
    },
    {
      id: "checked-payout",
      text: "Have you checked the payout status?",
      checked: true,
    },
    {
      id: "attached-evidence",
      text: "Have you attached relevant evidence?",
      checked: hasEvidence,
    },
  ];

  return (
    <div className="bg-amber-500/10 border border-amber-300/60 dark:bg-amber-950/30 dark:border-amber-900/40 rounded-2xl p-5 space-y-3">
      <h3 className="text-xs font-bold text-foreground">Before you Escalate</h3>

      <div className="space-y-2.5">
        {checklist.map((item) => (
          <div key={item.id} className="flex items-start gap-2.5">
            {item.checked ? (
              <CheckCircle2 className="w-4 h-4 text-secondary fill-secondary/20 shrink-0 mt-0.5" />
            ) : (
              <Circle className="w-4 h-4 text-muted-foreground/60 shrink-0 mt-0.5" />
            )}
            <span
              className={`text-xs leading-snug ${
                item.checked
                  ? "text-foreground font-medium"
                  : "text-muted-foreground"
              }`}
            >
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
