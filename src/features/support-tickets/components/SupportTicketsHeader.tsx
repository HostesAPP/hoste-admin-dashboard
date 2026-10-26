// features/support-tickets/components/SupportTicketsHeader.tsx

import React from "react";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";

interface SupportTicketsHeaderProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
}

export function SupportTicketsHeader({
  searchQuery,
  onSearchChange,
}: SupportTicketsHeaderProps) {
  return (
    <PageHeaderLayout
      title="Support Tickets"
      description="Escalated customer support tickets from Lade AI to human support"
    >
      <div className="relative w-72">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
        <Input
          type="search"
          placeholder="Search Tickets by code, subject, user..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="h-9 pl-9 pr-4 rounded-xl border-border/80 bg-background text-xs placeholder:text-muted-foreground/70 focus-visible:ring-primary"
        />
      </div>
    </PageHeaderLayout>
  );
}
