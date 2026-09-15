// features/customer-support/components/CustomerSupportFilters.tsx

import React from "react";
import { Search, ChevronDown, Download, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ConversationStatus,
  ConversationChannel,
  CustomerSupportStatsData,
} from "../customer-support.types";

interface CustomerSupportFiltersProps {
  activeTab: ConversationStatus | "All";
  onTabChange: (tab: ConversationStatus | "All") => void;
  selectedChannel: ConversationChannel | "All";
  onChannelChange: (channel: ConversationChannel | "All") => void;
  sortBy: "newest" | "oldest" | "activity";
  onSortChange: (sort: "newest" | "oldest" | "activity") => void;
  searchQuery: string;
  onSearchChange: (search: string) => void;
  stats?: CustomerSupportStatsData;
  onExportReport?: () => void;
  onNewConversation?: () => void;
}

export function CustomerSupportFilters({
  activeTab,
  onTabChange,
  selectedChannel,
  onChannelChange,
  sortBy,
  onSortChange,
  searchQuery,
  onSearchChange,
  stats,
  onExportReport,
  onNewConversation,
}: CustomerSupportFiltersProps) {
  const tabs: { id: ConversationStatus | "All"; label: string; count: number }[] = [
    { id: "All", label: "All", count: stats?.totalConversations || 103 },
    { id: "Open", label: "Open", count: stats?.openConversations || 48 },
    { id: "Waiting", label: "Waiting", count: stats?.waitingForReply || 16 },
    { id: "Escalated", label: "Escalated", count: stats?.escalated || 7 },
    { id: "Closed", label: "Closed", count: stats?.closedToday || 32 },
  ];

  return (
    <div className="space-y-4">
      {/* Top Actions Row: Export Report + New Conversation */}
      <div className="flex items-center justify-end gap-3">
        <Button
          type="button"
          variant="outline"
          onClick={onExportReport}
          className="h-9 px-4 rounded-xl text-xs font-semibold border-border/80 text-foreground hover:bg-muted/50 transition-colors gap-2 cursor-pointer"
        >
          <Download className="w-3.5 h-3.5 text-muted-foreground" />
          Export Report
        </Button>

        <Button
          type="button"
          onClick={onNewConversation}
          className="h-9 px-4 rounded-xl text-xs font-semibold bg-primary text-primary-foreground hover:bg-primary/90 transition-colors gap-2 shadow-xs cursor-pointer"
        >
          <Plus className="w-3.5 h-3.5" />
          New Conversation
        </Button>
      </div>

      {/* Main Filter & Tabs Row */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-border/70 pb-3">
        {/* Left Status Tabs */}
        <div className="flex items-center gap-6 overflow-x-auto scrollbar-none">
          {tabs.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => onTabChange(tab.id)}
                className={`text-xs sm:text-sm font-semibold whitespace-nowrap transition-colors relative cursor-pointer pb-2 -mb-3 ${
                  isActive
                    ? "text-primary border-b-2 border-primary font-bold"
                    : "text-muted-foreground hover:text-foreground"
                }`}
              >
                {tab.label} ({tab.count})
              </button>
            );
          })}
        </div>

        {/* Right Filter Controls: Channels dropdown, Newest dropdown, Search Input */}
        <div className="flex items-center gap-3 shrink-0">
          {/* Channel Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-between gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border border-border/80 bg-card hover:bg-muted/40 transition-colors cursor-pointer text-foreground">
              <span>{selectedChannel === "All" ? "All channels" : selectedChannel}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-40 rounded-xl text-xs">
              <DropdownMenuItem onClick={() => onChannelChange("All")} className="cursor-pointer">
                All channels
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChannelChange("Chat")} className="cursor-pointer">
                Chat
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChannelChange("WhatsApp")} className="cursor-pointer">
                WhatsApp
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onChannelChange("Email")} className="cursor-pointer">
                Email
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Sort Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex items-center justify-between gap-2 h-9 px-3.5 rounded-xl text-xs font-medium border border-border/80 bg-card hover:bg-muted/40 transition-colors cursor-pointer text-foreground">
              <span>{sortBy === "newest" ? "Newest" : sortBy === "oldest" ? "Oldest" : "Most Active"}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-36 rounded-xl text-xs">
              <DropdownMenuItem onClick={() => onSortChange("newest")} className="cursor-pointer">
                Newest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("oldest")} className="cursor-pointer">
                Oldest
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onSortChange("activity")} className="cursor-pointer">
                Most Active
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Search Conversations Input */}
          <div className="relative w-56 sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search conversations"
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              className="h-9 pl-8 pr-3 rounded-xl border-border/80 bg-card text-xs placeholder:text-muted-foreground/70 focus-visible:ring-primary"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
