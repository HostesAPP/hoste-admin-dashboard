"use client";

import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface BookingsPaginationProps {
  currentPage: number;
  totalRecords: number;
  startRange: number;
  endRange: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export const BookingsPagination: React.FC<BookingsPaginationProps> = ({
  currentPage,
  totalRecords,
  startRange,
  endRange,
  totalPages,
  onPageChange,
}) => {
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
      {/* Count Info */}
      <div>
        Showing <span className="font-bold text-foreground">{startRange}</span> to{" "}
        <span className="font-bold text-foreground">{endRange}</span> of{" "}
        <span className="font-bold text-foreground">
          {totalRecords.toLocaleString()}
        </span>{" "}
        booking records
      </div>

      {/* Pagination Buttons */}
      <div className="flex items-center gap-1.5">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>

        {pages.map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => onPageChange(p)}
            className={`w-8 h-8 flex items-center justify-center rounded-lg text-xs font-bold transition-colors cursor-pointer ${
              currentPage === p
                ? "bg-primary text-primary-foreground shadow-xs"
                : "border border-border bg-card text-foreground hover:bg-muted"
            }`}
          >
            {p}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="w-8 h-8 flex items-center justify-center rounded-lg border border-border bg-card text-foreground hover:bg-muted disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
