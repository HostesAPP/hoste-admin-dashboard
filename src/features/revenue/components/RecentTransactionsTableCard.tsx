// features/revenue/components/RecentTransactionsTableCard.tsx

"use client";

import React from "react";
import Link from "next/link";
import { RevenueTransaction } from "../revenue.types";

interface RecentTransactionsTableCardProps {
  transactions: RevenueTransaction[];
}

export function RecentTransactionsTableCard({
  transactions,
}: RecentTransactionsTableCardProps) {
  return (
    <div className="bg-card rounded-2xl border border-border/80 shadow-xs p-6 flex flex-col justify-between h-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-xs font-bold text-foreground">Recent Transactions</h2>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] text-muted-foreground border-b border-border/60">
              <th className="pb-3 font-semibold tracking-wider">Transaction ID</th>
              <th className="pb-3 font-semibold tracking-wider">Booking ID</th>
              <th className="pb-3 font-semibold tracking-wider">Customer</th>
              <th className="pb-3 font-semibold tracking-wider">Booking Value</th>
              <th className="pb-3 font-semibold tracking-wider">Hosté Revenue</th>
              <th className="pb-3 font-semibold tracking-wider">Status</th>
              <th className="pb-3 font-semibold tracking-wider">Date</th>
              <th className="pb-3 font-semibold tracking-wider text-right">Action</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/40">
            {transactions.map((tx) => (
              <tr
                key={tx.id}
                className="hover:bg-muted/30 transition-colors group"
              >
                <td className="py-3.5 font-bold text-foreground">
                  {tx.transactionCode}
                </td>
                <td className="py-3.5 font-medium text-foreground">
                  <Link
                    href={`/bookings/${tx.bookingCode}`}
                    className="hover:text-primary transition-colors"
                  >
                    {tx.bookingCode}
                  </Link>
                </td>
                <td className="py-3.5 text-foreground font-medium">
                  {tx.customerName}
                </td>
                <td className="py-3.5 text-foreground">
                  {tx.bookingValue}
                </td>
                <td className="py-3.5 font-bold text-foreground">
                  {tx.hosteRevenue}
                </td>
                <td className="py-3.5">
                  <span className="inline-flex items-center px-2 py-0.5 rounded-sm text-[10px] font-semibold bg-secondary/10 text-secondary border border-secondary/20">
                    {tx.status}
                  </span>
                </td>
                <td className="py-3.5 text-muted-foreground text-[11px]">
                  {tx.date}
                </td>
                <td className="py-3.5 text-right">
                  <Link
                    href={`/revenue/${tx.transactionCode}`}
                    className="inline-flex items-center px-2.5 py-1 rounded-lg border border-primary text-primary hover:bg-primary/5 text-[11px] font-semibold transition-colors shadow-2xs"
                  >
                    View Details
                  </Link>
                </td>

              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
