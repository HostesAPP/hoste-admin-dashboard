// features/customer-support/components/CustomerSupportStats.tsx

import React from "react";
import { MessageSquare, MessageCircle, AlertCircle, CheckCircle2 } from "lucide-react";
import { CustomerSupportStatsData } from "../customer-support.types";

interface CustomerSupportStatsProps {
  stats?: CustomerSupportStatsData;
  isLoading?: boolean;
}

export function CustomerSupportStats({
  stats,
  isLoading = false,
}: CustomerSupportStatsProps) {
  if (isLoading || !stats) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="h-32 bg-card rounded-lg border border-border/80 p-5 animate-pulse flex flex-col justify-between"
          >
            <div className="h-4 w-28 bg-muted rounded" />
            <div className="h-8 w-16 bg-muted rounded" />
            <div className="h-6 w-full bg-muted rounded-full" />
          </div>
        ))}
      </div>
    );
  }

  const statItems = [
    {
      id: "open",
      title: "Open Conversations",
      value: stats.openConversations,
      changeText: stats.openChangeText,
      topBorderColor: "bg-primary",
      icon: MessageSquare,
      iconColor: "text-sky-500",
    },
    {
      id: "waiting",
      title: "Waiting for Reply",
      value: stats.waitingForReply,
      changeText: stats.waitingChangeText,
      topBorderColor: "bg-emerald-700 dark:bg-emerald-500",
      icon: MessageCircle,
      iconColor: "text-amber-500",
    },
    {
      id: "escalated",
      title: "Escalate",
      value: stats.escalated,
      changeText: stats.escalatedChangeText,
      topBorderColor: "bg-rose-500",
      icon: AlertCircle,
      iconColor: "text-rose-500",
    },
    {
      id: "closed",
      title: "Closed (Today)",
      value: stats.closedToday,
      changeText: stats.closedChangeText,
      topBorderColor: "bg-emerald-700 dark:bg-emerald-500",
      icon: CheckCircle2,
      iconColor: "text-emerald-600",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {statItems.map((item) => {
        const Icon = item.icon;
        return (
          <div
            key={item.id}
            className="bg-card rounded-lg border border-border/80 shadow-xs relative overflow-hidden flex flex-col justify-between p-5 pt-4 transition-all hover:shadow-sm"
          >
            {/* Top Colored Line */}
            <div
              className={`absolute top-0 left-0 right-0 h-1 ${item.topBorderColor}`}
            />

            {/* Title & Icon Row */}
            <div className="flex items-center justify-center gap-2 mt-1">
              <Icon className={`w-4 h-4 ${item.iconColor}`} />
              <span className="text-xs font-medium text-muted-foreground">
                {item.title === "Escalate" ? "Escalated" : item.title}
              </span>
            </div>

            {/* Large Value */}
            <div className="text-center my-2">
              <span className="text-3xl font-extrabold text-foreground tracking-tight">
                {item.value}
              </span>
            </div>

            {/* Bottom Change Pill */}
            <div className="w-full">
              <div className="bg-emerald-50/80 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold py-1 px-2.5 rounded-full text-center flex items-center justify-center gap-1 border border-emerald-100/60 dark:border-emerald-900/40">
                <span>{item.changeText}</span>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
