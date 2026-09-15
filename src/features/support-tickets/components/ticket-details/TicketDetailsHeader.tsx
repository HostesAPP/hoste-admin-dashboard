// features/support-tickets/components/ticket-details/TicketDetailsHeader.tsx

import React from "react";
import Link from "next/link";
import { ChevronLeft, MoreVertical, CheckCircle2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SupportTicket } from "../../types/support-tickets.types";

interface TicketDetailsHeaderProps {
  ticket: SupportTicket;
  onResolveTicket: () => void;
  isResolving?: boolean;
}

export function TicketDetailsHeader({
  ticket,
  onResolveTicket,
  isResolving = false,
}: TicketDetailsHeaderProps) {
  const getStatusBadge = () => {
    switch (ticket.status) {
      case "Open":
        return "bg-orange-100/80 text-orange-700 border border-orange-200/60 dark:bg-orange-950/50 dark:text-orange-300";
      case "In Progress":
        return "bg-amber-100/80 text-amber-800 border border-amber-200/60 dark:bg-amber-950/50 dark:text-amber-300";
      case "Resolved":
        return "bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/50 dark:text-emerald-300";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="flex flex-col gap-3 p-6 border-b border-border/70">
      {/* Back button & Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/support-tickets"
          className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="w-3.5 h-3.5" />
          <span>Back to Tickets</span>
        </Link>
      </div>

      {/* Main Header Row */}
      <div className="flex items-center justify-between">
        <div className="flex flex-col">
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-foreground">
              Ticket Details
            </h1>
            <span
              className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${getStatusBadge()}`}
            >
              {ticket.status}
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground mt-1">
            <span>
              Ticket ID:{" "}
              <strong className="text-primary font-bold">
                {ticket.ticketCode}
              </strong>
            </span>
            <span>•</span>
            <span>Created: {ticket.createdAt || ticket.date}</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          {/* More Actions Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-center gap-1.5 h-10 px-4 rounded-xl text-xs font-semibold border border-border/80 bg-background hover:bg-muted/50 transition-colors cursor-pointer">
              More Actions
              <MoreVertical className="w-3.5 h-3.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48 rounded-xl text-xs">
              <DropdownMenuItem className="cursor-pointer">
                Export Transcript
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer">
                Print Ticket Details
              </DropdownMenuItem>
              <DropdownMenuItem className="cursor-pointer text-destructive">
                Flag for Review
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Resolve Ticket Button */}
          {ticket.status !== "Resolved" ? (
            <Button
              type="button"
              disabled={isResolving}
              onClick={onResolveTicket}
              className="h-10 px-5 rounded-xl bg-primary hover:bg-primary/90 text-primary-foreground text-xs font-semibold gap-2 shadow-xs transition-all cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4" />
              {isResolving ? "Resolving..." : "Resolve Ticket"}
            </Button>
          ) : (
            <div className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-emerald-100/80 text-emerald-800 text-xs font-bold border border-emerald-200/60">
              <CheckCircle2 className="w-4 h-4" />
              Resolved
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
