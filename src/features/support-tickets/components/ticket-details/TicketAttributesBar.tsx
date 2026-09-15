// features/support-tickets/components/ticket-details/TicketAttributesBar.tsx

import React from "react";
import { Globe, CreditCard, ChevronDown } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { SupportTicket } from "../../types/support-tickets.types";

interface TicketAttributesBarProps {
  ticket: SupportTicket;
}

export function TicketAttributesBar({ ticket }: TicketAttributesBarProps) {
  const getPriorityBadge = () => {
    switch (ticket.priority) {
      case "High":
        return {
          dotColor: "bg-rose-500",
          badgeBg: "bg-rose-50 text-rose-700 border border-rose-200/50",
        };
      case "Medium":
        return {
          dotColor: "bg-amber-500",
          badgeBg: "bg-amber-50 text-amber-700 border border-amber-200/50",
        };
      case "Low":
        return {
          dotColor: "bg-slate-500",
          badgeBg: "bg-slate-100 text-slate-700 border border-slate-200/50",
        };
      default:
        return {
          dotColor: "bg-muted-foreground",
          badgeBg: "bg-muted text-muted-foreground",
        };
    }
  };

  const priorityStyle = getPriorityBadge();

  return (
    <div className="grid grid-cols-5 gap-3 bg-card p-5 rounded-lg border border-border/80 shadow-xs">
      {/* 1. Priority */}
      <div className="flex flex-col gap-1.5 border-r border-border/50 pr-4 last:border-none">
        <span className="text-[11px] font-medium text-muted-foreground">
          Priority
        </span>
        <div className="flex items-center gap-2">
          <div
            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold ${priorityStyle.badgeBg}`}
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${priorityStyle.dotColor}`}
            />
            {ticket.priority}
          </div>
        </div>
      </div>

      {/* 2. Type */}
      <div className="flex flex-col gap-1.5 border-r border-border/50 pr-4 last:border-none">
        <span className="text-[11px] font-medium text-muted-foreground">
          Type
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <div className="w-5 h-5 rounded-md bg-muted/60 flex items-center justify-center text-muted-foreground">
            <CreditCard className="w-3.5 h-3.5 text-primary" />
          </div>
          <span>{ticket.type === "Payment" ? "Payment Issue" : ticket.type}</span>
        </div>
      </div>

      {/* 3. Status */}
      <div className="flex flex-col gap-1.5 border-r border-border/50 pr-4 last:border-none">
        <span className="text-[11px] font-medium text-muted-foreground">
          Status
        </span>
        <div>
          <span className="inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold bg-orange-100/80 text-orange-700 border border-orange-200/60 dark:bg-orange-950/40 dark:text-orange-300">
            {ticket.status}
          </span>
        </div>
      </div>

      {/* 4. Source */}
      <div className="flex flex-col gap-1.5 border-r border-border/50 pr-4 last:border-none">
        <span className="text-[11px] font-medium text-muted-foreground">
          Source
        </span>
        <div className="flex items-center gap-2 text-xs font-bold text-foreground">
          <Globe className="w-4 h-4 text-emerald-600" />
          <span>{ticket.source || "Web App"}</span>
        </div>
      </div>

      {/* 5. Assigned To */}
      <div className="flex flex-col gap-1.5">
        <span className="text-[11px] font-medium text-muted-foreground">
          Assigned To
        </span>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <Avatar className="w-7 h-7">
              <AvatarImage src="/avatar-naomi.png" alt="Naomi Sarah" />
              <AvatarFallback className="bg-rose-500 text-white font-bold text-[10px]">
                NS
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col text-left leading-tight">
              <span className="font-bold text-xs text-foreground">
                {ticket.assignedAdmin?.name || "Naomi Sarah"}
              </span>
              <span className="text-[10px] text-muted-foreground">
                {ticket.assignedAdmin?.role || "Super Admin"}
              </span>
            </div>
          </div>
          <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
        </div>
      </div>
    </div>
  );
}
