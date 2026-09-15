// features/customer-support/components/customer-profile/CustomerProfileLeftCard.tsx
"use client"

import React, { useState } from "react";
import { Mail, Phone, MapPin, Calendar, Copy, Check } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { CustomerProfileData } from "../../customer-support.types";

interface CustomerProfileLeftCardProps {
  profile: CustomerProfileData;
}

export function CustomerProfileLeftCard({
  profile,
}: CustomerProfileLeftCardProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyId = () => {
    navigator.clipboard.writeText(profile.customerCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col gap-6">
      {/* Top Customer Info */}
      <div className="flex flex-col items-center text-center">
        {/* Avatar with Online Status */}
        <div className="relative mb-3">
          <Avatar className="w-24 h-24 border-2 border-border shadow-xs">
            {profile.customerAvatar && (
              <AvatarImage
                src={profile.customerAvatar}
                alt={profile.customerName}
              />
            )}
            <AvatarFallback className="bg-primary/10 text-primary font-bold text-2xl">
              {profile.customerInitial ||
                profile.customerName.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <span className="absolute bottom-1 right-1 w-4 h-4 rounded-full bg-emerald-500 border-2 border-card" />
        </div>

        {/* Name & Verified Badge */}
        <div className="flex items-center gap-2">
          <h2 className="text-base font-bold text-foreground">
            {profile.customerName}
          </h2>
          {profile.isVerified && (
            <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-2 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
              Verified
            </span>
          )}
        </div>

        {/* Customer ID + Copy Button */}
        <div className="flex items-center gap-1.5 text-xs text-muted-foreground mt-1">
          <span>Customer ID: {profile.customerCode}</span>
          <button
            type="button"
            onClick={handleCopyId}
            className="text-muted-foreground hover:text-foreground transition-colors p-0.5 cursor-pointer"
            title="Copy ID"
          >
            {copied ? (
              <Check className="w-3.5 h-3.5 text-emerald-600" />
            ) : (
              <Copy className="w-3.5 h-3.5" />
            )}
          </button>
        </div>

        {/* Active Customer Badge */}
        <div className="mt-2">
          <span className="text-[11px] font-semibold text-emerald-700 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/50 px-3 py-0.5 rounded-full border border-emerald-100 dark:border-emerald-900/50">
            {profile.customerStatus} customer
          </span>
        </div>
      </div>

      {/* Contact Information */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <h3 className="text-xs font-bold text-foreground">
          Contact Information
        </h3>

        <div className="space-y-2.5 text-xs">
          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Mail className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span className="truncate">{profile.email}</span>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Phone className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span>{profile.phone}</span>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <MapPin className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span>{profile.location}</span>
          </div>

          <div className="flex items-center gap-2.5 text-muted-foreground">
            <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
            <span>{profile.joinedDate}</span>
          </div>
        </div>
      </div>

      {/* Account Summary */}
      <div className="space-y-3 pt-2 border-t border-border/60">
        <div className="border-b border-border/70 pb-1 w-fit">
          <h3 className="text-xs font-bold text-foreground">
            Account Summary
          </h3>
        </div>

        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span>Total bookings</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.totalBookings}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Total Spent</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.totalSpent}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Outstanding balance</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.outstandingBalance}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Completed bookings</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.completedBookings}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>Cancelled bookings</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.cancelledBookings}
            </span>
          </div>

          <div className="flex items-center justify-between text-muted-foreground">
            <span>No-show bookings</span>
            <span className="font-bold text-foreground">
              {profile.accountSummary.noShowBookings}
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
