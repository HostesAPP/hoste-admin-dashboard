// features/support-tickets/components/ticket-details/TicketDetailsView.tsx

"use client";

import React from "react";
import {
  useSupportTicket,
  useUpdateTicketStatus,
  useAddTicketMessage,
} from "../../hooks/support-tickets.hooks";
import { TicketDetailsHeader } from "./TicketDetailsHeader";
import { TicketAttributesBar } from "./TicketAttributesBar";
import { TicketConversationThread } from "./TicketConversationThread";
import { TicketMetadataCard } from "./TicketMetadataCard";
import { TicketCustomerCard } from "./TicketCustomerCard";
import { TicketActionsCard } from "./TicketActionsCard";
import { TicketMessage } from "../../types/support-tickets.types";

interface TicketDetailsViewProps {
  ticketId: string;
}

export function TicketDetailsView({ ticketId }: TicketDetailsViewProps) {
  const { data: ticket, isLoading } = useSupportTicket(ticketId);
  const updateStatusMutation = useUpdateTicketStatus();
  const addMessageMutation = useAddTicketMessage();

  if (isLoading || !ticket) {
    return (
      <div className="flex flex-col min-h-screen p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-12 w-1/3 bg-muted animate-pulse rounded-xl" />
        <div className="h-24 w-full bg-muted animate-pulse rounded-2xl" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="h-96 w-full bg-muted animate-pulse rounded-2xl" />
            <div className="h-48 w-full bg-muted animate-pulse rounded-2xl" />
          </div>
          <div className="space-y-6">
            <div className="h-72 w-full bg-muted animate-pulse rounded-2xl" />
            <div className="h-64 w-full bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleResolveTicket = () => {
    updateStatusMutation.mutate({ id: ticket.id, status: "Resolved" });
  };

  const handleSendMessage = (message: Partial<TicketMessage>) => {
    const newMessage: TicketMessage = {
      id: `msg-${Date.now()}`,
      senderName: message.senderName || "Admin",
      senderRole: message.senderRole || "Admin",
      senderInitial: message.senderInitial || "N",
      timestamp: "Just now",
      isInternalNote: message.isInternalNote,
      content: message.content || "",
    };
    addMessageMutation.mutate({ id: ticket.id, message: newMessage });
  };

  const handleActionClick = (actionId: string) => {
    console.log(`Action triggered: ${actionId}`);
    if (actionId === "close") {
      updateStatusMutation.mutate({ id: ticket.id, status: "Resolved" });
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 space-y-6 mx-auto w-full">
        {/* Top Header */}
        <TicketDetailsHeader
          ticket={ticket}
          onResolveTicket={handleResolveTicket}
          isResolving={updateStatusMutation.isPending}
        />

        {/* 5-Item Attributes Bar */}
        <section className="px-6">
          <TicketAttributesBar ticket={ticket} />
        </section>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-3 gap-6 items-start px-6 pb-6">
          {/* Left Column (~66%): Conversation Thread + Details Summary Card */}
          <div className="lg:col-span-2 space-y-6">
            <TicketConversationThread
              ticket={ticket}
              onSendMessage={handleSendMessage}
            />
            <TicketMetadataCard ticket={ticket} />
          </div>

          {/* Right Column (~33%): Customer Info Card + Ticket Actions */}
          <div className="space-y-6">
            <TicketCustomerCard ticket={ticket} />
            <TicketActionsCard
              ticket={ticket}
              onActionClick={handleActionClick}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
