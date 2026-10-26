// features/support-tickets/components/SupportTicketsTable.tsx
"use client"

import React, { useState } from "react";
import Link from "next/link";
import {
  SupportTicket,
  TicketType,
  TicketPriority,
  TicketStatus,
} from "../types/support-tickets.types";
import { ChevronLeft, ChevronRight, CheckCircle2, ArrowRight, AlertCircle, RefreshCw } from "lucide-react";

interface SupportTicketsTableProps {
  tickets: SupportTicket[];
  isLoading?: boolean;
  isError?: boolean;
  onRetry?: () => void;
  onSelectTicket?: (ticket: SupportTicket) => void;
  pageSize?: number;
}

export function SupportTicketsTable({
  tickets,
  isLoading = false,
  isError = false,
  onRetry,
  pageSize = 10,
}: SupportTicketsTableProps) {
  const [currentPage, setCurrentPage] = useState(1);

  if (isError) {
    return (
      <div className="rounded-2xl border border-border bg-card p-12 text-center shadow-xs">
        <AlertCircle className="w-10 h-10 text-destructive mx-auto mb-3" />
        <h3 className="text-base font-semibold text-foreground">Unable to load support tickets</h3>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
          We encountered an issue fetching tickets from the backend. Please check your network or try again.
        </p>
        {onRetry && (
          <button
            type="button"
            onClick={onRetry}
            className="mt-4 inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-primary text-primary-foreground text-xs font-semibold hover:bg-primary/90 transition-all cursor-pointer shadow-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry</span>
          </button>
        )}
      </div>
    );
  }

  // Pagination calculation
  const totalItems = tickets.length;
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize));
  const validCurrentPage = Math.min(currentPage, totalPages);
  const startIndex = (validCurrentPage - 1) * pageSize;
  const currentTickets = tickets.slice(startIndex, startIndex + pageSize);

  const getTypeBadge = (type: TicketType) => {
    const t = String(type).toLowerCase();
    if (t.includes("payment") || t.includes("payout")) {
      return "bg-secondary/10 text-secondary border border-secondary/20";
    }
    if (t.includes("account")) {
      return "bg-primary/10 text-primary border border-primary/20";
    }
    if (t.includes("booking")) {
      return "bg-sky-500/10 text-sky-700 dark:text-sky-300 border border-sky-500/20";
    }
    if (t.includes("nin") || t.includes("cac")) {
      return "bg-purple-500/10 text-purple-700 dark:text-purple-300 border border-purple-500/20";
    }
    if (t.includes("refund")) {
      return "bg-amber-500/10 text-amber-700 dark:text-amber-300 border border-amber-500/20";
    }
    return "bg-muted text-muted-foreground border border-border";
  };

  const getPriorityBadge = (priority: TicketPriority) => {
    const p = String(priority).toUpperCase();
    if (p === "HIGH") {
      return "bg-destructive/10 text-destructive border border-destructive/20";
    }
    if (p === "MEDIUM") {
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20";
    }
    return "bg-muted text-muted-foreground border border-border";
  };

  const getStatusBadge = (status: TicketStatus) => {
    const s = String(status).toUpperCase().replace(/\s+/g, "_");
    if (s === "OPEN") {
      return "bg-primary/10 text-primary border border-primary/20";
    }
    if (s === "IN_PROGRESS") {
      return "bg-amber-500/10 text-amber-700 dark:text-amber-400 border border-amber-500/20";
    }
    if (s === "RESOLVED") {
      return "bg-secondary/10 text-secondary border border-secondary/20";
    }
    return "bg-muted text-muted-foreground border border-border";
  };

  const formatTicketDate = (ticket: SupportTicket) => {
    if (ticket.date) return ticket.date;
    if (ticket.createdAt) {
      const d = new Date(ticket.createdAt);
      if (!isNaN(d.getTime())) {
        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
      }
    }
    return "Recently";
  };

  return (
    <div className="rounded-2xl border border-border bg-card overflow-hidden shadow-xs">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          {/* Table Header */}
          <thead>
            <tr className="border-b border-border text-xs font-semibold text-muted-foreground bg-muted/30">
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
                    <div className="h-4 w-28 bg-muted rounded" />
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
                    <div className="h-8 w-24 bg-muted rounded-lg ml-auto" />
                  </td>
                </tr>
              ))
            ) : currentTickets.length === 0 ? (
              <tr>
                <td colSpan={8} className="py-16 text-center text-muted-foreground">
                  <p className="font-semibold text-base text-foreground">No support tickets found</p>
                  <p className="text-xs text-muted-foreground mt-1 max-w-sm mx-auto">
                    No tickets match your active filter criteria. Try adjusting your search query, status tab, or category.
                  </p>
                </td>
              </tr>
            ) : (
              currentTickets.map((ticket) => {
                const ticketCodeDisplay = ticket.ticketNumber || ticket.ticketCode || ticket.id;
                return (
                  <tr
                    key={ticket.id}
                    className="hover:bg-muted/30 transition-colors group"
                  >
                    {/* Ticket ID (SUP-YYMMDD-XXXX) */}
                    <td className="py-4 px-6 font-bold text-xs text-primary whitespace-nowrap">
                      {ticketCodeDisplay}
                    </td>

                    {/* Raised By */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <div className="flex items-center gap-2">
                        <div className="w-6 h-6 rounded-full bg-primary/10 text-primary font-bold text-[11px] flex items-center justify-center shrink-0">
                          {ticket.userInitial || (ticket.raisedBy ? ticket.raisedBy[0].toUpperCase() : "U")}
                        </div>
                        <span className="font-medium text-foreground">
                          {ticket.raisedBy || "Anonymous"}
                        </span>
                        {ticket.isVerified && (
                          <CheckCircle2 className="w-3.5 h-3.5 text-secondary shrink-0" />
                        )}
                      </div>
                    </td>

                    {/* Type */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getTypeBadge(
                          ticket.type
                        )}`}
                      >
                        {ticket.type}
                      </span>
                    </td>

                    {/* Subject */}
                    <td className="py-4 px-4 text-xs sm:text-sm text-foreground/90 font-normal max-w-xs xl:max-w-md truncate" title={ticket.subject}>
                      {ticket.subject}
                    </td>

                    {/* Date */}
                    <td className="py-4 px-4 text-xs text-muted-foreground whitespace-nowrap">
                      {formatTicketDate(ticket)}
                    </td>

                    {/* Priority */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getPriorityBadge(
                          ticket.priority
                        )}`}
                      >
                        {ticket.priority}
                      </span>
                    </td>

                    {/* Status */}
                    <td className="py-4 px-4 whitespace-nowrap">
                      <span
                        className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[11px] font-semibold ${getStatusBadge(
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
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-border/90 bg-card text-foreground text-xs font-semibold hover:border-primary hover:text-primary hover:bg-primary/5 transition-all cursor-pointer shadow-2xs"
                      >
                        <span>View Ticket</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      {!isLoading && totalItems > 0 && (
        <div className="flex items-center justify-between px-6 py-4 border-t border-border bg-card/60">
          <p className="text-xs text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startIndex + 1}</span> to{" "}
            <span className="font-semibold text-foreground">
              {Math.min(startIndex + pageSize, totalItems)}
            </span>{" "}
            of <span className="font-semibold text-foreground">{totalItems}</span> tickets
          </p>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={validCurrentPage === 1}
              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <span className="text-xs font-semibold px-2 text-foreground">
              {validCurrentPage} of {totalPages}
            </span>
            <button
              type="button"
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={validCurrentPage === totalPages}
              className="inline-flex items-center justify-center p-1.5 rounded-lg border border-border bg-card text-muted-foreground hover:text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              aria-label="Next page"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
