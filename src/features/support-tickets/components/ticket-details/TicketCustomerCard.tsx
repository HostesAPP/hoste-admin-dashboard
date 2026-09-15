// features/support-tickets/components/ticket-details/TicketCustomerCard.tsx

import React from "react";
import Link from "next/link";
import {
  MoreVertical,
  CheckCircle2,
  Mail,
  Phone,
  MapPin,
  ArrowUpRight,
} from "lucide-react";
import { SupportTicket } from "../../types/support-tickets.types";

interface TicketCustomerCardProps {
  ticket: SupportTicket;
}

export function TicketCustomerCard({ ticket }: TicketCustomerCardProps) {
  const initial =
    ticket.userInitial || ticket.raisedBy?.charAt(0) || "U";

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs flex flex-col">
      {/* Card Header */}
      <div className="flex items-center justify-between pb-4 border-b border-border/60">
        <h3 className="text-sm font-bold text-foreground">
          Customer Information
        </h3>
        <button
          type="button"
          className="text-muted-foreground hover:text-foreground p-1 rounded-md cursor-pointer"
        >
          <MoreVertical className="w-4 h-4" />
        </button>
      </div>

      {/* Customer Avatar & Bio */}
      <div className="flex items-center gap-4 py-5">
        <div className="w-14 h-14 rounded-full bg-emerald-800 flex items-center justify-center font-bold text-xl text-white shrink-0 shadow-xs">
          {initial}
        </div>

        <div className="flex flex-col text-left">
          <h4 className="font-bold text-base text-foreground">
            {ticket.raisedBy}
          </h4>

          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100/80 text-emerald-800 border border-emerald-200/60 dark:bg-emerald-950/40 dark:text-emerald-300">
              Verified Hosté
              <CheckCircle2 className="w-3 h-3 text-emerald-700" />
            </span>
          </div>

          <span className="text-[11px] text-muted-foreground mt-1">
            Hosté ID: {ticket.hosteId || "HST-10293"}
          </span>
        </div>
      </div>

      {/* Contact Details List */}
      <div className="flex flex-col gap-3 py-4 border-t border-border/60 text-xs">
        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Mail className="w-4 h-4 text-muted-foreground/70 shrink-0" />
          <span className="text-foreground truncate">
            {ticket.userEmail || "amaserwaa@gmail.com"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-muted-foreground">
          <Phone className="w-4 h-4 text-muted-foreground/70 shrink-0" />
          <span className="text-foreground">
            {ticket.userPhone || "+233 24 123 4567"}
          </span>
        </div>

        <div className="flex items-center gap-2.5 text-muted-foreground">
          <MapPin className="w-4 h-4 text-muted-foreground/70 shrink-0" />
          <span className="text-foreground">
            {ticket.userLocation || "Accra, Ghana"}
          </span>
        </div>
      </div>

      {/* View Full Profile Action */}
      <div className="pt-3 mt-auto">
        <Link
          href={`/users`}
          className="w-full inline-flex items-center justify-center gap-1.5 py-2.5 px-4 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-800 dark:bg-emerald-950/40 dark:text-emerald-300 dark:hover:bg-emerald-950/60 font-bold text-xs border border-emerald-200/60 transition-colors shadow-2xs"
        >
          <span>View Full Profile</span>
          <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}
