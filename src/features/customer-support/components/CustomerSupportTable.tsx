// features/customer-support/components/CustomerSupportTable.tsx

import React from "react";
import { MessageSquare, MessageCircle, Mail, Smartphone } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  CustomerConversation,
  ConversationStatus,
  ConversationChannel,
} from "../customer-support.types";

interface CustomerSupportTableProps {
  conversations: CustomerConversation[];
  isLoading?: boolean;
  onSelectConversation?: (conversation: CustomerConversation) => void;
}

export function CustomerSupportTable({
  conversations,
  isLoading = false,
  onSelectConversation,
}: CustomerSupportTableProps) {
  if (isLoading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div
            key={i}
            className="h-16 w-full bg-card rounded-xl border border-border/70 animate-pulse"
          />
        ))}
      </div>
    );
  }

  if (conversations.length === 0) {
    return (
      <div className="bg-card rounded-2xl border border-border/80 p-12 text-center flex flex-col items-center justify-center space-y-3">
        <div className="w-12 h-12 rounded-full bg-muted/60 flex items-center justify-center text-muted-foreground">
          <MessageSquare className="w-6 h-6" />
        </div>
        <h3 className="text-sm font-bold text-foreground">No conversations found</h3>
        <p className="text-xs text-muted-foreground max-w-sm">
          No customer support conversations match your current filters or search query.
        </p>
      </div>
    );
  }

  const getStatusColor = (status: ConversationStatus) => {
    switch (status) {
      case "Open":
        return "text-emerald-600 dark:text-emerald-400 font-bold";
      case "Waiting":
        return "text-amber-500 dark:text-amber-400 font-bold";
      case "Escalated":
        return "text-rose-500 dark:text-rose-400 font-bold";
      case "Closed":
        return "text-muted-foreground font-semibold";
      default:
        return "text-foreground font-medium";
    }
  };

  const getChannelIcon = (channel: ConversationChannel) => {
    switch (channel) {
      case "Chat":
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
      case "WhatsApp":
        return <MessageCircle className="w-4 h-4 text-emerald-500" />;
      case "Email":
        return <Mail className="w-4 h-4 text-primary" />;
      case "Mobile App":
        return <Smartphone className="w-4 h-4 text-indigo-500" />;
      default:
        return <MessageSquare className="w-4 h-4 text-sky-500" />;
    }
  };

  return (
    <div className="w-full overflow-x-auto">
      <table className="w-full text-left border-collapse">
        {/* Table Header */}
        <thead>
          <tr className="border-b border-border/60 text-[11px] font-semibold text-muted-foreground">
            <th className="py-3 px-4 w-[240px]">Customer</th>
            <th className="py-3 px-4">Last Messages</th>
            <th className="py-3 px-4 w-[120px]">Channel</th>
            <th className="py-3 px-4 w-[120px]">Status</th>
            <th className="py-3 px-4 w-[120px] text-right">Last Activity</th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody className="divide-y divide-border/40">
          {conversations.map((conv) => {
            const hasUnread = (conv.unreadCount || 0) > 0;

            return (
              <tr
                key={conv.id}
                onClick={() => onSelectConversation?.(conv)}
                className="hover:bg-muted/30 transition-colors cursor-pointer group"
              >
                {/* Customer Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-3">
                    <Avatar className="w-8 h-8 border border-border/60 shrink-0">
                      {conv.customerAvatar && (
                        <AvatarImage
                          src={conv.customerAvatar}
                          alt={conv.customerName}
                        />
                      )}
                      <AvatarFallback className="text-[11px] font-bold bg-muted text-foreground">
                        {conv.customerInitial ||
                          conv.customerName.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="text-xs font-semibold text-foreground group-hover:text-primary transition-colors">
                      {conv.customerName}
                    </span>
                  </div>
                </td>

                {/* Last Message Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center gap-2 max-w-xl">
                    <span className="text-xs text-muted-foreground truncate max-w-md group-hover:text-foreground/90 transition-colors">
                      {conv.lastMessage}
                    </span>
                    {hasUnread && (
                      <span className="bg-emerald-100 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shrink-0">
                        {conv.unreadCount}
                      </span>
                    )}
                  </div>
                </td>

                {/* Channel Column */}
                <td className="py-4 px-4">
                  <div className="flex items-center">
                    {getChannelIcon(conv.channel)}
                  </div>
                </td>

                {/* Status Column */}
                <td className="py-4 px-4">
                  <span className={`text-xs ${getStatusColor(conv.status)}`}>
                    {conv.status}
                  </span>
                </td>

                {/* Last Activity Column */}
                <td className="py-4 px-4 text-right">
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {conv.lastActivity}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
