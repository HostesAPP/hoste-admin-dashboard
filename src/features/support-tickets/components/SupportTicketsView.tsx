// features/support-tickets/components/SupportTicketsView.tsx

"use client";

import { useState } from "react";
import { TicketStatus } from "../types/support-tickets.types";
import {
  useSupportTickets,
  useSupportTicketStats,
} from "../hooks/support-tickets.hooks";
import { SupportTicketsHeader } from "./SupportTicketsHeader";
import { SupportTicketsStats } from "./SupportTicketsStats";
import { SupportTicketsTabs } from "./SupportTicketsTabs";
import { SupportTicketsTable } from "./SupportTicketsTable";

export function SupportTicketsView() {
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<TicketStatus | "All">("Open");
  const [selectedType, setSelectedType] = useState<string>("All");

  // TanStack Query data fetching
  const { data: stats, isLoading: isStatsLoading } = useSupportTicketStats();
  const {
    data: tickets = [],
    isLoading: isTicketsLoading,
    isError: isTicketsError,
    refetch: refetchTickets,
  } = useSupportTickets({
    search: searchQuery,
    status: activeTab,
    type: selectedType,
  });

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Top Header with PageHeaderLayout & search */}
      <SupportTicketsHeader
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
      />

      {/* Main Page Content */}
      <main className="flex-1 px-8 py-6 space-y-6 mx-auto w-full max-w-7xl">
        {/* KPI Stats Overview */}
        <section>
          <SupportTicketsStats stats={stats} isLoading={isStatsLoading} />
        </section>

        {/* Filter Tabs & Category Dropdown */}
        <section className="pt-2">
          <SupportTicketsTabs
            activeTab={activeTab}
            onTabChange={setActiveTab}
            selectedType={selectedType}
            onTypeChange={setSelectedType}
            openCount={stats?.openCount ?? 0}
            inProgressCount={stats?.inProgressCount ?? 0}
            resolvedCount={stats?.resolvedCount ?? 0}
            totalCount={stats?.totalCount ?? 0}
          />
        </section>

        {/* Tickets Table */}
        <section>
          <SupportTicketsTable
            tickets={tickets}
            isLoading={isTicketsLoading}
            isError={isTicketsError}
            onRetry={() => refetchTickets()}
          />
        </section>
      </main>
    </div>
  );
}
