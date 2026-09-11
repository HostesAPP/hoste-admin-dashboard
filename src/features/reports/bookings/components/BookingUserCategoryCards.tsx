"use client";

import React from "react";
import type { BookingUserCategoryItem } from "../types/bookings.types";

interface BookingUserCategoryCardsProps {
  categories: BookingUserCategoryItem[];
}

export const BookingUserCategoryCards: React.FC<BookingUserCategoryCardsProps> = ({
  categories,
}) => {
  return (
    <div className="space-y-3">
      <h2 className="text-base font-bold text-foreground">
        Booking Volume by User Category
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {categories.map((cat) => (
          <div
            key={cat.id}
            className="bg-card border border-border/80 rounded-md p-4 shadow-soft flex items-end justify-between hover:border-border transition-all duration-200"
          >
            <div>
              <span className="text-[11px] font-bold tracking-wider text-muted-foreground uppercase">
                {cat.category}
              </span>
              <div className="text-base font-extrabold text-foreground mt-1">
                {cat.countWithPercent}
              </div>
            </div>

            <div className="text-right">
              <span className="text-xs font-bold text-secondary">
                {cat.totalRevenue}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
