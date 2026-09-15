// features/customer-support/components/CustomerSupportView.tsx

"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import { CustomerSupportHeader } from "./CustomerSupportHeader";
import { CustomerSupportStats } from "./CustomerSupportStats";
import { CustomerSupportFilters } from "./CustomerSupportFilters";
import { CustomerSupportTable } from "./CustomerSupportTable";
import { NewConversationModal } from "./NewConversationModal";
import {
  useCustomerConversations,
  useCustomerSupportStats,
  useCreateCustomerConversation,
} from "../hooks/customer-support.hooks";
import {
  ConversationStatus,
  ConversationChannel,
  CustomerConversation,
} from "../customer-support.types";

export function CustomerSupportView() {
  const router = useRouter();
  const [globalSearch, setGlobalSearch] = useState("");
  const [activeTab, setActiveTab] = useState<ConversationStatus | "All">("All");
  const [selectedChannel, setSelectedChannel] = useState<
    ConversationChannel | "All"
  >("All");
  const [sortBy, setSortBy] = useState<"newest" | "oldest" | "activity">(
    "newest"
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [isNewModalOpen, setIsNewModalOpen] = useState(false);

  // Queries
  const { data: stats, isLoading: isStatsLoading } = useCustomerSupportStats();
  const { data: conversations = [], isLoading: isConversationsLoading } =
    useCustomerConversations({
      status: activeTab,
      channel: selectedChannel,
      sortBy,
      search: searchQuery || globalSearch,
    });

  // Mutation
  const createConversationMutation = useCreateCustomerConversation();

  const handleExportReport = () => {
    const csvContent =
      "data:text/csv;charset=utf-8," +
      "ID,Customer,Message,Channel,Status,Last Activity\n" +
      conversations
        .map(
          (c) =>
            `"${c.conversationCode}","${c.customerName}","${c.lastMessage}","${c.channel}","${c.status}","${c.lastActivity}"`
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `customer_support_report_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCreateConversation = (data: {
    customerName: string;
    customerEmail?: string;
    customerPhone?: string;
    channel: ConversationChannel;
    message: string;
  }) => {
    createConversationMutation.mutate({
      customerName: data.customerName,
      customerEmail: data.customerEmail,
      customerPhone: data.customerPhone,
      channel: data.channel,
      lastMessage: data.message,
      status: "Open",
    });
  };

  const handleSelectConversation = (conv: CustomerConversation) => {
    router.push(`/customer-support/${conv.id}`);
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Console Header */}
      <CustomerSupportHeader
        globalSearch={globalSearch}
        onGlobalSearchChange={setGlobalSearch}
      />

      {/* Main Content Area */}
      <main className="flex-1 px-6 py-6 space-y-6 w-full">
        {/* Stat Cards (rounded-lg per design requirements) */}
        <CustomerSupportStats stats={stats} isLoading={isStatsLoading} />

        {/* Filter & Action Controls + Tabs */}
        <div className="space-y-4 pt-2">
          <CustomerSupportFilters
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedChannel={selectedChannel}
            onChannelChange={setSelectedChannel}
            sortBy={sortBy}
            onSortChange={setSortBy}
            searchQuery={searchQuery}
            onSearchChange={setSearchQuery}
            stats={stats}
            onExportReport={handleExportReport}
            onNewConversation={() => setIsNewModalOpen(true)}
          />

          {/* Table */}
          <div className="bg-card rounded-2xl border border-border/80 shadow-xs overflow-hidden">
            <CustomerSupportTable
              conversations={conversations}
              isLoading={isConversationsLoading}
              onSelectConversation={handleSelectConversation}
            />
          </div>
        </div>
      </main>

      {/* New Conversation Modal */}
      <NewConversationModal
        open={isNewModalOpen}
        onOpenChange={setIsNewModalOpen}
        onSubmit={handleCreateConversation}
        isLoading={createConversationMutation.isPending}
      />
    </div>
  );
}
