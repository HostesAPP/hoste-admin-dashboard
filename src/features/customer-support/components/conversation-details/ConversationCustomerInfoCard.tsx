// features/customer-support/components/conversation-details/ConversationCustomerInfoCard.tsx

import React from "react";
import { Mail, Phone, MapPin, CheckCircle2 } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerConversation } from "../../customer-support.types";

interface ConversationCustomerInfoCardProps {
  conversation: CustomerConversation;
}

export function ConversationCustomerInfoCard({
  conversation,
}: ConversationCustomerInfoCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs flex flex-col divide-y divide-border/60">
      {/* Customer Header Block */}
      <div className="p-6 flex flex-col items-center text-center">
        <h3 className="text-xs font-bold text-muted-foreground self-start mb-4 uppercase tracking-wider">
          Customer Info
        </h3>

        {/* Big Avatar */}
        <Avatar className="w-20 h-20 border-2 border-border/80 shadow-xs mb-3">
          {conversation.customerAvatar && (
            <AvatarImage
              src={conversation.customerAvatar}
              alt={conversation.customerName}
            />
          )}
          <AvatarFallback className="bg-primary/10 text-primary font-bold text-xl">
            {conversation.customerInitial ||
              conversation.customerName.charAt(0).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        {/* Name */}
        <h4 className="text-base font-bold text-foreground">
          {conversation.customerName}
        </h4>

        {/* Verified Hosté Badge */}
        {conversation.isVerifiedHoste && (
          <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-400 text-[11px] font-semibold border border-emerald-100 dark:border-emerald-900/50 mt-1.5">
            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
            <span>Verified Hosté</span>
          </div>
        )}

        {/* Contact Info List */}
        <div className="w-full mt-4 space-y-2 text-left">
          {conversation.customerEmail && (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
              <span className="truncate">{conversation.customerEmail}</span>
            </div>
          )}

          {conversation.customerPhone && (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <Phone className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
              <span>{conversation.customerPhone}</span>
            </div>
          )}

          {conversation.customerLocation && (
            <div className="flex items-center gap-2.5 text-xs text-muted-foreground">
              <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
              <span>{conversation.customerLocation}</span>
            </div>
          )}
        </div>

        {/* Customer Since Block */}
        <div className="w-full mt-4 pt-3 border-t border-border/50 flex flex-col text-center">
          <span className="text-[11px] font-medium text-muted-foreground">
            Customer
          </span>
          <span className="text-xs font-semibold text-foreground">
            {conversation.customerSince || "Since Jan 2026"}
          </span>
        </div>
      </div>

      {/* Numerical Stats Summary Block */}
      <div className="p-6 space-y-4">
        {/* Total Bookings */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Total Bookings
          </span>
          <span className="text-sm font-bold text-foreground">
            {conversation.totalBookings ?? 8}
          </span>
        </div>

        {/* Total Spent */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Total Spent
          </span>
          <span className="text-sm font-bold text-foreground">
            {conversation.totalSpent ? `₦${conversation.totalSpent}` : "₦320,000.00"}
          </span>
        </div>

        {/* Verification Status */}
        <div className="flex flex-col gap-1">
          <span className="text-[11px] font-medium text-muted-foreground">
            Verification Status
          </span>
          <div>
            <span className="inline-flex items-center gap-1 text-[11px] font-bold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-md border border-emerald-100 dark:border-emerald-900/50">
              <CheckCircle2 className="w-3 h-3 text-emerald-600" />
              {conversation.verificationStatus || "Verified"}
            </span>
          </div>
        </div>

        {/* Last Active */}
        <div className="flex flex-col gap-0.5">
          <span className="text-[11px] font-medium text-muted-foreground">
            Last Active
          </span>
          <span className="text-xs font-semibold text-foreground">
            {conversation.lastActivity || "Today, 10:35 AM"}
          </span>
        </div>
      </div>
    </div>
  );
}
