// features/revenue/components/details/TransactionSummaryCard.tsx

"use client";

import React from "react";
import { RevenueTransactionDetails } from "../../revenue.types";

interface TransactionSummaryCardProps {
  details: RevenueTransactionDetails;
}

export function TransactionSummaryCard({ details }: TransactionSummaryCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-sm font-bold text-foreground tracking-tight">
          Transaction Summary
        </h2>
        <span className="inline-flex items-center px-4 py-1 rounded-full text-xs font-semibold bg-blue-50 text-blue-600 border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400 dark:border-blue-900/40">
          {details.paymentStatus}
        </span>
      </div>

      {/* 6 Key-Value Fields Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-1 border-t border-border/60">
        {/* 1. Transaction ID */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Transaction ID
          </span>
          <span className="text-xs font-bold text-foreground block truncate">
            {details.transactionId}
          </span>
        </div>

        {/* 2. Booking ID */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Booking ID
          </span>
          <span className="text-xs font-bold text-foreground block truncate">
            {details.bookingId}
          </span>
        </div>

        {/* 3. Payment Reference */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Payment Reference
          </span>
          <span className="text-xs font-bold text-foreground block truncate">
            {details.paymentReference}
          </span>
        </div>

        {/* 4. Transaction Date & Time */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Transaction Date & Time
          </span>
          <span className="text-xs font-bold text-foreground block">
            {details.transactionDateTime}
          </span>
        </div>

        {/* 5. Payment Status */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Payment Status
          </span>
          <div>
            <span className="inline-flex items-center px-2.5 py-0.5 rounded-sm text-[11px] font-semibold bg-blue-50 text-blue-600 border border-blue-200/50 dark:bg-blue-950/40 dark:text-blue-400">
              {details.paymentStatus}
            </span>
          </div>
        </div>

        {/* 6. Currency */}
        <div className="space-y-1">
          <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
            Currency
          </span>
          <span className="text-xs font-bold text-foreground block truncate">
            {details.currency}
          </span>
        </div>
      </div>
    </div>
  );
}
