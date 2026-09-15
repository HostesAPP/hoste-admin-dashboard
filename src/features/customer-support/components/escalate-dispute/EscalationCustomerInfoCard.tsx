// features/customer-support/components/escalate-dispute/EscalationCustomerInfoCard.tsx

"use client";

import React, { useState } from "react";
import { Mail, Phone, MapPin, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerConversation } from "../../customer-support.types";

interface EscalationCustomerInfoCardProps {
  conversation: CustomerConversation;
}

export function EscalationCustomerInfoCard({
  conversation,
}: EscalationCustomerInfoCardProps) {
  const [copied, setCopied] = useState(false);

  const customerId = conversation.id.startsWith("conv-")
    ? `CUS-001245`
    : `CUS-${conversation.id}`;

  const handleCopyId = () => {
    navigator.clipboard.writeText(customerId);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-5 space-y-4">
      <h3 className="text-xs font-bold text-foreground">Customer Information</h3>

      <div className="flex items-start gap-3.5">
        <Avatar className="w-13 h-13 rounded-full border border-border/60 shrink-0">
          <AvatarImage
            src={conversation.customerAvatar || "/avatar-placeholder.png"}
            alt={conversation.customerName}
          />
          <AvatarFallback className="bg-secondary/15 text-secondary font-bold text-sm">
            {conversation.customerInitial || conversation.customerName.charAt(0)}
          </AvatarFallback>
        </Avatar>

        <div className="space-y-1.5 flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="font-bold text-sm text-foreground truncate">
              {conversation.customerName}
            </span>
            <span className="inline-flex items-center text-[10px] font-semibold px-2 py-0.5 rounded-sm bg-blue-50 text-blue-600 border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40">
              Verified
            </span>
          </div>

          <div>
            <span className="inline-flex items-center text-[10px] font-medium px-2 py-0.5 rounded-sm bg-secondary/10 text-secondary">
              Active Customer
            </span>
          </div>

          <div className="space-y-1 pt-1 text-xs text-muted-foreground">
            <div className="flex items-center gap-2 truncate">
              <Mail className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span className="truncate">{conversation.customerEmail || "sarahjohnson@gmail.com"}</span>
            </div>

            <div className="flex items-center gap-2">
              <Phone className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{conversation.customerPhone || "+234 812 346 6789"}</span>
            </div>

            <div className="flex items-center gap-2">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
              <span>{conversation.customerLocation || "Lagos Nigeria"}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="pt-2 border-t border-border/60 flex items-center justify-between text-xs">
        <div className="flex items-center gap-1 text-[11px] text-muted-foreground">
          <span>Customer</span>
          <span className="font-semibold text-foreground">
            {conversation.customerSince || "Since Jan 2026"}
          </span>
        </div>

        <button
          type="button"
          onClick={handleCopyId}
          className="flex items-center gap-1.5 text-[11px] text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
          title="Copy Customer ID"
        >
          <span>Customer ID: {customerId}</span>
          {copied ? (
            <Check className="w-3 h-3 text-secondary" />
          ) : (
            <Copy className="w-3 h-3" />
          )}
        </button>
      </div>
    </div>
  );
}
