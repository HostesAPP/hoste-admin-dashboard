// features/support-tickets/components/SupportTicketsView.tsx

"use client";

import React, { useState } from "react";
import {
  SupportTicket,
  TicketStatus,
} from "../types/support-tickets.types";
import {
  useSupportTickets,
  useSupportTicketStats,
} from "../hooks/support-tickets.hooks";
import { SupportTicketsHeader } from "./SupportTicketsHeader";
import { SupportTicketsStats } from "./SupportTicketsStats";
import { SupportTicketsTabs } from "./SupportTicketsTabs";
import { SupportTicketsTable } from "./SupportTicketsTable";
import { TicketDetailModal } from "./TicketDetailModal";

export function SupportTicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TicketStatus | "All">("Open");
  const [selectedTicket, setSelectedTicket] = useState<SupportTicket | null>(
    null
  );
  const [isModalOpen, setIsModalOpen] = useState(false);

  // TanStack Query data fetching
  const { data: stats, isLoading: isStatsLoading } = useSupportTicketStats();
  const { data: tickets = [], isLoading: isTicketsLoading, refetch } =
    useSupportTickets({
      search: searchQuery,
      status: activeTab,
    });

  const handleSelectTicket = (ticket: SupportTicket) => {
    setSelectedTicket(ticket);
    setIsModalOpen(true);
  };

  const handleStatusChange = (ticketId: string, newStatus: TicketStatus) => {
    console.log(`Updating ticket ${ticketId} to status: ${newStatus}`);
    // Will update via API mutation when connected
    refetch();
  };

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header */}
      <SupportTicketsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1 p-8 space-y-6 max-w-7xl mx-auto w-full">
        {/* KPI Stats Overview */}
        <section>
          <SupportTicketsStats stats={stats} isLoading={isStatsLoading} />
        </section>

        {/* Filter Tabs */}
        <section className="pt-2">
          <SupportTicketsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            openCount={stats?.openCount ?? 24}
            inProgressCount={stats?.inProgressCount ?? 12}
            resolvedCount={stats?.resolvedCount ?? 340}
          />
        </section>

        {/* Tickets Table */}
        <section>
          <SupportTicketsTable
            tickets={tickets}
            isLoading={isTicketsLoading}
            onSelectTicket={handleSelectTicket}
          />
        </section>
      </main>

      {/* Detail Dialog */}
      <TicketDetailModal
        ticket={selectedTicket}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onStatusChange={handleStatusChange}
      />
    </div>
  );
}
