// features/support-tickets/components/ticket-details/TicketActionsCard.tsx

import React from "react";
import {
  UserCheck,
  Flag,
  AlertTriangle,
  XCircle,
  ChevronRight,
} from "lucide-react";
import { SupportTicket } from "../../types/support-tickets.types";

interface TicketActionsCardProps {
  ticket: SupportTicket;
  onActionClick?: (actionType: string) => void;
}

export function TicketActionsCard({
  ticket,
  onActionClick,
}: TicketActionsCardProps) {
  const actions = [
    {
      id: "assign",
      title: "Assign Ticket",
      subtitle: "Assign to another admin",
      icon: UserCheck,
      iconColor: "text-emerald-700 dark:text-emerald-400",
      bgColor: "bg-emerald-50 dark:bg-emerald-950/40",
    },
    {
      id: "priority",
      title: "Change Priority",
      subtitle: "Update ticket priority",
      icon: Flag,
      iconColor: "text-amber-700 dark:text-amber-400",
      bgColor: "bg-amber-50 dark:bg-amber-950/40",
    },
    {
      id: "escalate",
      title: "Escalate Ticket",
      subtitle: "Escalate to higher team",
      icon: AlertTriangle,
      iconColor: "text-sky-700 dark:text-sky-400",
      bgColor: "bg-sky-50 dark:bg-sky-950/40",
    },
    {
      id: "close",
      title: "Close Ticket",
      subtitle: "Close this ticket",
      icon: XCircle,
      iconColor: "text-rose-700 dark:text-rose-400",
      bgColor: "bg-rose-50 dark:bg-rose-950/40",
    },
  ];

  return (
    <div className="bg-card rounded-2xl border border-border/80 p-6 shadow-xs flex flex-col">
      <h3 className="text-sm font-bold text-foreground pb-3 border-b border-border/60 mb-3">
        Ticket Actions
      </h3>

      <div className="flex flex-col divide-y divide-border/50">
        {actions.map((act) => {
          const Icon = act.icon;
          return (
            <button
              key={act.id}
              type="button"
              onClick={() => onActionClick?.(act.id)}
              className="flex items-center justify-between py-3.5 px-1 hover:bg-muted/40 rounded-xl transition-colors text-left group cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${act.bgColor} ${act.iconColor} shrink-0`}
                >
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex flex-col">
                  <span className="font-bold text-xs text-foreground group-hover:text-primary transition-colors">
                    {act.title}
                  </span>
                  <span className="text-[11px] text-muted-foreground">
                    {act.subtitle}
                  </span>
                </div>
              </div>

              <ChevronRight className="w-4 h-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </button>
          );
        })}
      </div>
    </div>
  );
}
