// features/support-tickets/components/ticket-details/TicketMetadataCard.tsx

import React from "react";
import { SupportTicket } from "../../types/support-tickets.types";

interface TicketMetadataCardProps {
  ticket: SupportTicket;
}

export function TicketMetadataCard({ ticket }: TicketMetadataCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs">
      <h3 className="text-sm font-bold text-foreground mb-4">
        Ticket Details
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-xs">
        {/* Column 1 */}
        <div className="space-y-3.5">
          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Booking ID
            </span>
            <span className="font-bold text-foreground">
              {ticket.bookingId || "#BKG-8821"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Category
            </span>
            <span className="font-bold text-foreground">
              {ticket.type}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Sub-category
            </span>
            <span className="font-bold text-foreground">
              {ticket.subCategory || "Escrow Payment"}
            </span>
          </div>
        </div>

        {/* Column 2 */}
        <div className="space-y-3.5">
          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Payment Method
            </span>
            <span className="font-bold text-foreground">
              {ticket.paymentMethod || "Paystack"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Transaction ID
            </span>
            <span className="font-bold text-foreground">
              {ticket.transactionId || "TXN_554487744"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Amount
            </span>
            <span className="font-bold text-foreground">
              {ticket.amount || "₦1,200.00"}
            </span>
          </div>
        </div>

        {/* Column 3 */}
        <div className="space-y-3.5">
          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Created
            </span>
            <span className="font-bold text-foreground">
              {ticket.createdAt || "Jun 1, 2025 • 10:15 AM"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Last Updated
            </span>
            <span className="font-bold text-foreground">
              {ticket.updatedAt || "Jun 1, 2025 • 10:22 AM"}
            </span>
          </div>

          <div>
            <span className="text-muted-foreground block text-[11px] mb-0.5">
              Created By
            </span>
            <span className="font-bold text-foreground">
              {ticket.raisedBy} (Customer)
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
