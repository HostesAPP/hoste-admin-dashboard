// features/customer-support/components/escalate-dispute/EscalateDisputeView.tsx

"use client";

import React from "react";
import Link from "next/link";
import { ChevronLeft } from "lucide-react";
import { EscalationDetailsForm } from "./EscalationDetailsForm";
import { EscalationCustomerInfoCard } from "./EscalationCustomerInfoCard";
import { EscalationBookingSummaryCard } from "./EscalationBookingSummaryCard";
import { EscalationRelatedTicketCard } from "./EscalationRelatedTicketCard";
import { EscalationChecklistCard } from "./EscalationChecklistCard";
import { EscalationGuidelinesCard } from "./EscalationGuidelinesCard";
import { useCustomerConversation } from "../../hooks/customer-support.hooks";
import {
  MOCK_DISPUTE_BOOKING_DETAILS,
  MOCK_DISPUTE_RELATED_TICKET,
} from "../../data/customer-support.data";

interface EscalateDisputeViewProps {
  conversationId: string;
}

export function EscalateDisputeView({ conversationId }: EscalateDisputeViewProps) {
  const { data: conversation, isLoading } = useCustomerConversation(conversationId);

  // Fallback placeholder while loading or if data is loading
  const customerData = conversation || {
    id: conversationId || "conv-001",
    conversationCode: "#CNV-901",
    customerName: "Sarah Johnson",
    customerAvatar: "/avatar-placeholder.png",
    customerInitial: "S",
    customerEmail: "sarahjohnson@gmail.com",
    customerPhone: "+234 812 346 6789",
    customerLocation: "Lagos Nigeria",
    customerSince: "Since Jan 2026",
    isVerifiedHoste: true,
    isOnline: true,
    lastMessage: "What's the status of my booking...",
    channel: "Chat" as const,
    status: "Open" as const,
    lastActivity: "Today, 10:35 AM",
  };

  if (isLoading && !conversation) {
    return (
      <div className="flex flex-col min-h-screen p-6 sm:p-8 max-w-7xl mx-auto space-y-6">
        <div className="h-8 w-28 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8 h-[650px] bg-muted animate-pulse rounded-2xl" />
          <div className="lg:col-span-4 space-y-6">
            <div className="h-56 bg-muted animate-pulse rounded-2xl" />
            <div className="h-44 bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-6 sm:p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* Top Header / Breadcrumb Bar */}
        <div className="relative flex items-center justify-between pb-1">
          {/* Back to chat Link */}
          <div>
            <Link
              href={`/customer-support/${conversationId || "conv-001"}`}
              className="inline-flex items-center gap-1 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
              <span>Back to chat</span>
            </Link>
          </div>

          {/* Centered Page Title & Subtitle */}
          <div className="text-center absolute left-1/2 -translate-x-1/2 top-0 pointer-events-none">
            <h1 className="text-xl font-bold text-foreground tracking-tight">
              Escalate to Dispute
            </h1>
            <p className="text-xs text-muted-foreground mt-0.5">
              Review the issue and escalate to the dispute team for further investigation.
            </p>
          </div>

          <div className="w-20" />
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65% / 8 cols): Escalation Details Form */}
          <div className="lg:col-span-8">
            <EscalationDetailsForm conversationId={conversationId || "conv-001"} />
          </div>

          {/* Right Column (~35% / 4 cols): Information & Guidelines Cards */}
          <div className="lg:col-span-4 space-y-5">
            {/* 1. Customer Information Card */}
            <EscalationCustomerInfoCard conversation={customerData} />

            {/* 2. Booking Summary Card */}
            <EscalationBookingSummaryCard booking={MOCK_DISPUTE_BOOKING_DETAILS} />

            {/* 3. Related Support Ticket Card */}
            <EscalationRelatedTicketCard ticket={MOCK_DISPUTE_RELATED_TICKET} />

            {/* 4. Before you Escalate Checklist Card */}
            <EscalationChecklistCard hasEvidence={false} />

            {/* 5. Escalation Guidelines Card */}
            <EscalationGuidelinesCard />
          </div>
        </div>
      </main>
    </div>
  );
}
