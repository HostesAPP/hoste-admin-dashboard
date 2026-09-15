// features/customer-support/components/escalate-dispute/EscalationGuidelinesCard.tsx

"use client";

import React from "react";
import { Info } from "lucide-react";

export function EscalationGuidelinesCard() {
  return (
    <div className="bg-blue-500/10 border border-blue-300/60 dark:bg-blue-950/30 dark:border-blue-900/40 rounded-2xl p-5 space-y-2">
      <div className="flex items-center gap-2">
        <Info className="w-4 h-4 text-blue-600 dark:text-blue-400 shrink-0" />
        <h3 className="text-xs font-bold text-foreground">Escalation Guidelines</h3>
      </div>

      <p className="text-xs text-foreground/80 leading-relaxed pl-6">
        Escalate only when the issue cannot be resolved at your level. Provide clear details and evidence to help the dispute team resolve faster.
      </p>
    </div>
  );
}
