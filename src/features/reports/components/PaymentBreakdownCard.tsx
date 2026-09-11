"use client";

import React from "react";
import type { PaymentStatusItem, BookingTypeRevenueItem } from "../types/reports.types";

interface PaymentBreakdownCardProps {
  statusBreakdown: PaymentStatusItem[];
  bookingTypeBreakdown: BookingTypeRevenueItem[];
}

export const PaymentBreakdownCard: React.FC<PaymentBreakdownCardProps> = ({
  statusBreakdown,
  bookingTypeBreakdown,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between h-full space-y-5">
      {/* Top Section: Payment Status Breakdown */}
      <div className="space-y-3.5">
        <h2 className="text-base font-bold text-foreground">
          Payment Status Breakdown
        </h2>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-muted">
          <div
            className="bg-secondary h-full"
            style={{ width: "96.4%" }}
            title="Successful (96.4%)"
          />
          <div
            className="bg-amber-500 h-full"
            style={{ width: "1.8%" }}
            title="Pending (1.8%)"
          />
          <div
            className="bg-primary h-full"
            style={{ width: "1.0%" }}
            title="Refunded (1.0%)"
          />
          <div
            className="bg-destructive h-full"
            style={{ width: "0.8%" }}
            title="Failed (0.8%)"
          />
        </div>

        {/* Status List with Metrics */}
        <div className="space-y-2 pt-1 text-xs">
          {statusBreakdown.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between py-0.5"
            >
              {/* Status Indicator & Label */}
              <div className="flex items-center gap-2 min-w-[90px]">
                <span className={`w-2 h-2 rounded-full ${item.colorClass} shrink-0`} />
                <span className="font-medium text-foreground">{item.label}</span>
              </div>

              {/* Amount */}
              <span className="font-extrabold text-foreground text-xs">
                {item.amount}
              </span>

              {/* Count & Percentage */}
              <span className="text-[11px] text-muted-foreground text-right min-w-[70px]">
                {item.count.toLocaleString()} ({item.percentage}%)
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-border/60" />

      {/* Bottom Section: Revenue by Booking Type */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-foreground">
          Revenue by Booking Type
        </h3>

        <div className="space-y-2 text-xs">
          {bookingTypeBreakdown.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between py-0.5"
            >
              <span className="text-muted-foreground font-medium">
                {item.type}
              </span>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-foreground">
                  {item.amount}
                </span>
                <span className="text-[11px] text-muted-foreground min-w-[50px] text-right">
                  {item.txnsCount} txns
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
