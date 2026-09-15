// features/customer-support/components/escalate-dispute/EscalationRelatedTicketCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { MessageSquareText } from "lucide-react";
import { DisputeRelatedTicket } from "../../customer-support.types";

interface EscalationRelatedTicketCardProps {
  ticket?: DisputeRelatedTicket;
}

export function EscalationRelatedTicketCard({
  ticket = {
    ticketCode: "SUP-84321",
    status: "Open",
    openedDate: "Jul 29, 2026 . 10:14 AM",
    issueSummary: "I was charged twice for this same booking.",
  },
}: EscalationRelatedTicketCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 space-y-3">
      <div className="flex items-center justify-between">
        <h3 className="text-xs font-bold text-foreground">Related Support Ticket</h3>
        <Link
          href={`/support-tickets/${ticket.ticketCode}`}
          className="text-xs font-semibold text-primary hover:underline transition-all"
        >
          View Conversation
        </Link>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 min-w-0">
            <MessageSquareText className="w-4 h-4 text-purple-600 dark:text-purple-400 shrink-0" />
            <span className="font-semibold text-xs text-foreground truncate">
              Ticket #{ticket.ticketCode}
            </span>
          </div>
          <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-full bg-amber-500/10 text-amber-600 border border-amber-300/40 dark:text-amber-400 dark:border-amber-800/40">
            {ticket.status}
          </span>
        </div>

        <p className="text-[10px] text-muted-foreground">
          Opened: {ticket.openedDate}
        </p>

        <div className="pt-2 border-t border-border/60">
          <span className="text-[11px] text-muted-foreground block font-medium">Issue:</span>
          <p className="text-xs text-foreground/90 font-medium leading-snug mt-0.5">
            {ticket.issueSummary}
          </p>
        </div>
      </div>
    </div>
  );
}
