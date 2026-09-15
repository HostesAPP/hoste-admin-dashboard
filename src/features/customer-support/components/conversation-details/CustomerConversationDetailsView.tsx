// features/customer-support/components/conversation-details/CustomerConversationDetailsView.tsx

"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ConversationChatCard } from "./ConversationChatCard";
import { ConversationCustomerInfoCard } from "./ConversationCustomerInfoCard";
import { ConversationRecentBookingsCard } from "./ConversationRecentBookingsCard";
import {
  useCustomerConversation,
  useAddCustomerConversationMessage,
  useUpdateCustomerConversationStatus,
} from "../../hooks/customer-support.hooks";
import { CustomerMessage } from "../../customer-support.types";

interface CustomerConversationDetailsViewProps {
  conversationId: string;
}

export function CustomerConversationDetailsView({
  conversationId,
}: CustomerConversationDetailsViewProps) {
  const router = useRouter();
  const { data: conversation, isLoading } =
    useCustomerConversation(conversationId);
  const addMessageMutation = useAddCustomerConversationMessage();
  const updateStatusMutation = useUpdateCustomerConversationStatus();

  if (isLoading || !conversation) {
    return (
      <div className="flex flex-col min-h-screen p-8 mx-auto space-y-6">
        <div className="h-8 w-24 bg-muted animate-pulse rounded-lg" />
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-150 bg-muted animate-pulse rounded-2xl" />
          <div className="space-y-6">
            <div className="h-80 bg-muted animate-pulse rounded-2xl" />
            <div className="h-64 bg-muted animate-pulse rounded-2xl" />
          </div>
        </div>
      </div>
    );
  }

  const handleSendMessage = (content: string, isInternalNote = false) => {
    const newMessage: CustomerMessage = {
      id: `msg-${Date.now()}`,
      senderName: isInternalNote ? "Super Admin (Note)" : "Super Admin",
      senderRole: "Admin",
      senderInitial: "SA",
      timestamp: "Just now",
      isInternalNote,
      content,
    };

    addMessageMutation.mutate({
      id: conversation.id,
      message: newMessage,
    });
  };

  const handleCloseConversation = () => {
    updateStatusMutation.mutate({
      id: conversation.id,
      status: "Closed",
    });
  };

  const handleEscalateToDispute = () => {
    router.push(`/customer-support/${conversation.id}/escalate`);
  };


  const handleViewProfile = () => {
    router.push(`/customer-support/profile/${conversation.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <main className="flex-1 p-6 sm:p-8 space-y-5 max-w-7xl mx-auto w-full">
        {/* Back Link */}
        <div>
          <Link
            href="/customer-support"
            className="inline-flex items-center gap-1.5 text-xs font-semibold text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span>Back</span>
          </Link>
        </div>

        {/* 2-Column Main Workspace */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
          {/* Left Column (~66%): Chat Conversation Card + Bottom Actions */}
          <div className="lg:col-span-2 space-y-4">
            <ConversationChatCard
              conversation={conversation}
              onSendMessage={handleSendMessage}
              isSending={addMessageMutation.isPending}
              onViewProfile={handleViewProfile}
            />

            {/* Bottom Actions Row */}
            <div className="flex items-center justify-center gap-4 pt-2">
              <Button
                type="button"
                variant="outline"
                onClick={handleCloseConversation}
                disabled={updateStatusMutation.isPending}
                className="h-10 px-6 rounded-xl text-xs font-semibold border-border/80 text-foreground hover:bg-muted/50 transition-colors cursor-pointer"
              >
                Close Conversation
              </Button>

              <Button
                type="button"
                onClick={handleEscalateToDispute}
                disabled={updateStatusMutation.isPending}
                className="h-10 px-6 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors shadow-xs cursor-pointer"
              >
                Escalate to Dispute
              </Button>
            </div>
          </div>

          {/* Right Column (~33%): Customer Info Card + Recent Bookings Card */}
          <div className="space-y-6">
            <ConversationCustomerInfoCard conversation={conversation} />
            <ConversationRecentBookingsCard
              bookings={conversation.recentBookings}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
