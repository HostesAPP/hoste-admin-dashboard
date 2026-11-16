"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";

export interface UsersPaginationProps {
  currentPage?: number;
  totalUsers?: number;
  startRange?: number;
  endRange?: number;
  totalPages?: number;
  pageSize?: number;
  skip?: number;
  take?: number;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;
}

function getPageNumbers(
  currentPage: number,
  totalPages: number
): (number | "ellipsis")[] {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }

  if (currentPage <= 4) {
    return [1, 2, 3, 4, 5, "ellipsis", totalPages];
  }

  if (currentPage >= totalPages - 3) {
    return [
      1,
      "ellipsis",
      totalPages - 4,
      totalPages - 3,
      totalPages - 2,
      totalPages - 1,
      totalPages,
    ];
  }

  return [
    1,
    "ellipsis",
    currentPage - 1,
    currentPage,
    currentPage + 1,
    "ellipsis",
    totalPages,
  ];
}

export function UsersPagination({
  currentPage = 1,
  totalUsers = 0,
  startRange,
  endRange,
  totalPages = 1,
  pageSize = 10,
  skip,
  take,
  isLoading = false,
  onPageChange,
  onPageSizeChange,
}: UsersPaginationProps) {
  // Resolve effective skip and take
  const currentTake = take ?? pageSize ?? 10;
  const currentSkip =
    skip !== undefined ? skip : Math.max(0, (currentPage - 1) * currentTake);

  const effectivePage = Math.floor(currentSkip / currentTake) + 1;
  const effectiveTotalPages = Math.max(
    1,
    totalPages || Math.ceil(totalUsers / currentTake)
  );

  const calculatedStart =
    totalUsers === 0 ? 0 : startRange ?? currentSkip + 1;
  const calculatedEnd =
    endRange ?? Math.min(currentSkip + currentTake, totalUsers);

  const pageNumbers = getPageNumbers(effectivePage, effectiveTotalPages);

  const canGoPrevious = effectivePage > 1 && !isLoading;
  const canGoNext = effectivePage < effectiveTotalPages && !isLoading;

  const handlePrevious = () => {
    if (!canGoPrevious) return;
    onPageChange?.(effectivePage - 1);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    onPageChange?.(effectivePage + 1);
  };

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
      {/* Left: Showing range */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-muted-foreground">
          Showing{" "}
          <strong className="text-foreground font-semibold">
            {calculatedStart}–{calculatedEnd}
          </strong>{" "}
          of{" "}
          <strong className="text-foreground font-semibold">
            {totalUsers.toLocaleString()}
          </strong>{" "}
          users
        </span>

        {onPageSizeChange && (
          <div className="flex items-center gap-1.5 pl-2 border-l border-border/60">
            <span className="text-xs text-muted-foreground">Per page:</span>
            <Select
              value={String(currentTake)}
              onValueChange={(val) => onPageSizeChange(Number(val))}
            >
              <SelectTrigger className="h-7 w-16 text-xs bg-card border-border/80">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="text-xs">
                <SelectItem value="10">10</SelectItem>
                <SelectItem value="25">25</SelectItem>
                <SelectItem value="50">50</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      {/* Right: Pagination buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={!canGoPrevious}
          onClick={handlePrevious}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          <ChevronLeft className="w-3.5 h-3.5 mr-1" />
          Previous
        </Button>

        {pageNumbers.map((page, index) => {
          if (page === "ellipsis") {
            return (
              <span
                key={`ellipsis-${index}`}
                className="px-1 text-xs text-muted-foreground"
              >
                ...
              </span>
            );
          }

          const isCurrent = page === effectivePage;
          return (
            <button
              key={page}
              type="button"
              disabled={isLoading}
              onClick={() => onPageChange?.(page)}
              className={cn(
                "h-7 min-w-7 px-2 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer",
                isCurrent
                  ? "bg-foreground text-background"
                  : "text-muted-foreground hover:text-foreground hover:bg-muted"
              )}
            >
              {page.toLocaleString()}
            </button>
          );
        })}

        <Button
          variant="outline"
          size="sm"
          disabled={!canGoNext}
          onClick={handleNext}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80 cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Next
          <ChevronRight className="w-3.5 h-3.5 ml-1" />
        </Button>
      </div>
    </div>
  );
}
