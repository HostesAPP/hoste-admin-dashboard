// features/support-tickets/components/SupportTicketsTable.tsx

import React from "react";
import Link from "next/link";
import {
  SupportTicket,
  TicketType,
  TicketPriority,
  TicketStatus,
} from "../types/support-tickets.types";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
  onSelectTicket: (ticket: SupportTicket) => void;
}

export function SupportTicketsTable({
  tickets,
  isLoading = false,
  onSelectTicket,
}: SupportTicketsTableProps) {
  const getTypeBadge = (type: TicketType) => {
    switch (type) {
      case "Payment":
        return "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/50";
      case "Account":
        return "bg-orange-100/80 text-orange-800 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200/50";
      case "Booking":
        return "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 border border-slate-200/60";
      case "NIN":
        return "bg-rose-100/80 text-rose-800 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    switch (priority) {
      case "High":
        return "bg-rose-100/70 text-rose-700 dark:bg-rose-950/50 dark:text-rose-300 border border-rose-200/50";
      case "Medium":
        return "bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/50";
      case "Low":
        return "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 border border-slate-200/50";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getStatusBadge = (status: TicketStatus) => {
    switch (status) {
      case "Open":
        return "bg-orange-100/80 text-orange-700 dark:bg-orange-950/50 dark:text-orange-300 border border-orange-200/60";
      case "In Progress":
        return "bg-amber-100/80 text-amber-800 dark:bg-amber-950/50 dark:text-amber-300 border border-amber-200/60";
      case "Resolved":
        return "bg-emerald-100/80 text-emerald-800 dark:bg-emerald-950/50 dark:text-emerald-300 border border-emerald-200/60";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  return (
    <div className="rounded-2xl border border-border/80 bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border/80 text-xs font-semibold text-muted-foreground bg-muted/20">
              <th className="py-3.5 px-6 font-semibold">Ticket ID</th>
              <th className="py-3.5 px-4 font-semibold">Raised By</th>
              <th className="py-3.5 px-4 font-semibold">Type</th>
              <th className="py-3.5 px-4 font-semibold">Subject</th>
              <th className="py-3.5 px-4 font-semibold">Date</th>
              <th className="py-3.5 px-4 font-semibold">Priority</th>
              <th className="py-3.5 px-4 font-semibold">Status</th>
              <th className="py-3.5 px-6 font-semibold text-right">
                <span className="sr-only">Actions</span>
              </th>
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-border/60 text-xs sm:text-sm">
            {isLoading ? (
              Array.from({ length: 6 }).map((_, i) => (
                <tr key={i} className="animate-pulse">
                  <td className="py-4 px-6">
                    <div className="h-4 w-14 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-24 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-48 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-4 w-12 bg-muted rounded" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-14 bg-muted rounded-full" />
                  </td>
                  <td className="py-4 px-4">
                    <div className="h-5 w-16 bg-muted rounded-full" />
                  </td>
                  <td className="py-4 px-6 text-right">
                    <div className="h-7 w-20 bg-muted rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : tickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-12 text-center text-muted-foreground">
                  <p className="font-semibold text-sm">No support tickets found</p>
                  <p className="text-xs text-muted-foreground mt-1">
                    Try adjusting your search query or status filter.
                  </p>
                </td>
              </tr>
            ) : (
              tickets.map((ticket) => (
                <tr
                  key={ticket.id}
                  className="hover:bg-muted/30 transition-colors group"
                >
                  {/* Ticket ID */}
                  <td className="py-4 px-6 font-bold text-xs text-primary whitespace-nowrap">
                    {ticket.ticketCode}
                  </td>

                  {/* Raised By */}
                  <td className="py-4 px-4 font-bold text-xs sm:text-sm text-foreground whitespace-nowrap">
                    {ticket.raisedBy}
                  </td>

                  {/* Type */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getTypeBadge(
                        ticket.type
                      )}`}
                    >
                      {ticket.type}
                    </span>
                  </td>

                  {/* Subject */}
                  <td className="py-4 px-4 text-xs sm:text-sm text-foreground/90 font-normal max-w-md truncate">
                    {ticket.subject}
                  </td>

                  {/* Date */}
                  <td className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                    {ticket.date}
                  </td>

                  {/* Priority */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getPriorityBadge(
                        ticket.priority
                      )}`}
                    >
                      {ticket.priority}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="py-4 px-4 whitespace-nowrap">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-medium ${getStatusBadge(
                        ticket.status
                      )}`}
                    >
                      {ticket.status}
                    </span>
                  </td>

                  {/* Action */}
                  <td className="py-4 px-6 text-right whitespace-nowrap">
                    <Link
                      href={`/support-tickets/${ticket.id}`}
                      className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-border/80 bg-background text-primary text-xs font-semibold hover:border-primary/50 hover:bg-primary/5 transition-all cursor-pointer shadow-2xs"
                    >
                      View Ticket &rarr;
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
