"use client";

import React from "react";
import type {
  BookingStatusBreakdownItem,
  BookingTypePerformanceItem,
} from "../types/bookings.types";

interface BookingStatusBreakdownCardProps {
  statusBreakdown: BookingStatusBreakdownItem[];
  typePerformance: BookingTypePerformanceItem[];
}

export const BookingStatusBreakdownCard: React.FC<BookingStatusBreakdownCardProps> = ({
  statusBreakdown,
  typePerformance,
}) => {
  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft flex flex-col justify-between h-full space-y-4">
      {/* Top: Booking Status Breakdown */}
      <div className="space-y-3">
        <h2 className="text-base font-bold text-foreground">
          Booking Status Breakdown
        </h2>

        {/* Multi-segment Progress Bar */}
        <div className="w-full h-2.5 rounded-full overflow-hidden flex bg-muted">
          {statusBreakdown.map((item) => (
            <div
              key={item.status}
              style={{
                width: `${item.percentage}%`,
                backgroundColor: item.barColor,
              }}
              className="h-full"
              title={`${item.label} (${item.percentage}%)`}
            />
          ))}
        </div>

        {/* Status Rows */}
        <div className="space-y-1.5 pt-1 text-xs">
          {statusBreakdown.map((item) => (
            <div
              key={item.status}
              className="flex items-center justify-between py-0.5"
            >
              <div className="flex items-center gap-2">
                <span
                  className="w-2 h-2 rounded-full shrink-0"
                  style={{ backgroundColor: item.barColor }}
                />
                <span className="font-semibold text-foreground">
                  {item.label}
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-extrabold text-foreground">
                  {item.count.toLocaleString()}
                </span>
                <span className="text-[11px] text-muted-foreground w-10 text-right">
                  {item.percentage}%
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="border-t border-border/60" />

      {/* Bottom: Type Performance */}
      <div className="space-y-2.5">
        <h3 className="text-xs font-bold text-foreground">
          Type Performance
        </h3>

        <div className="space-y-2 text-xs">
          {typePerformance.map((item) => (
            <div
              key={item.type}
              className="flex items-center justify-between py-0.5"
            >
              <span className="text-muted-foreground font-medium">
                {item.type}
              </span>
              <div className="flex items-center gap-2.5">
                <span className="text-[11px] text-muted-foreground">
                  {item.bookingCount}
                </span>
                <span className="font-extrabold text-foreground text-xs">
                  {item.revenue}
                </span>
                <span className="text-secondary font-bold text-[11px]">
                  {item.completionRate}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
