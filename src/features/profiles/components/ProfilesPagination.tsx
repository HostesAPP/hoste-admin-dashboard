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
import type { ProfileTab } from "../types/profiles.types";

export interface ProfilesPaginationProps {
  currentPage?: number;
  totalPages?: number;
  totalResults?: number;
  rowsPerPage?: number;
  skip?: number;
  take?: number;
  total?: number;
  status?: ProfileTab | string;
  isLoading?: boolean;
  onPageChange?: (page: number) => void;
  onRowsPerPageChange?: (rows: number) => void;
  onSkipChange?: (skip: number) => void;
  onTakeChange?: (take: number) => void;
}

function getStatusLabel(status?: ProfileTab | string): string {
  if (!status) return "";
  const s = status.toLowerCase();
  switch (s) {
    case "pending":
      return "pending";
    case "approved":
    case "active":
      return "approved";
    case "rejected":
      return "rejected";
    case "suspended":
      return "suspended";
    case "deactivated":
    case "deleted":
      return "deactivated";
    default:
      return s;
  }
}

function getPageNumbers(
  currentPage: number,
  totalPages: number,
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

export function ProfilesPagination({
  currentPage = 1,
  totalPages = 1,
  totalResults = 0,
  rowsPerPage = 10,
  skip,
  take,
  total,
  status,
  isLoading,
  onPageChange,
  onRowsPerPageChange,
  onSkipChange,
  onTakeChange,
}: ProfilesPaginationProps) {
  // 1. Resolve effective take & skip
  const currentTake = take ?? rowsPerPage ?? 10;
  const currentSkip =
    skip !== undefined
      ? skip
      : Math.max(0, (currentPage - 1) * currentTake);
  const effectiveTotal = total ?? totalResults ?? 0;

  // 2. Derive page count and current page strictly from skip & take
  const calculatedCurrentPage =
    Math.floor(currentSkip / currentTake) + 1;
  const calculatedTotalPages = Math.max(
    1,
    Math.ceil(effectiveTotal / currentTake),
  );

  // 3. Slice bounds for "Showing X–Y of Z"
  const startItem = effectiveTotal === 0 ? 0 : currentSkip + 1;
  const endItem = Math.min(currentSkip + currentTake, effectiveTotal);
  const statusLabel = getStatusLabel(status);

  // 4. Previous and Next capabilities
  const canGoPrevious = currentSkip > 0 && !isLoading;
  const canGoNext =
    currentSkip + currentTake < effectiveTotal && !isLoading;

  const handlePrevious = () => {
    if (!canGoPrevious) return;
    const newSkip = Math.max(0, currentSkip - currentTake);
    const newPage = Math.floor(newSkip / currentTake) + 1;
    onSkipChange?.(newSkip);
    onPageChange?.(newPage);
  };

  const handleNext = () => {
    if (!canGoNext) return;
    const newSkip = currentSkip + currentTake;
    const newPage = Math.floor(newSkip / currentTake) + 1;
    onSkipChange?.(newSkip);
    onPageChange?.(newPage);
  };

  const handlePageClick = (pageNumber: number) => {
    const newSkip = (pageNumber - 1) * currentTake;
    onSkipChange?.(newSkip);
    onPageChange?.(pageNumber);
  };

  const handleRowsSelect = (val: string | null) => {
    if (!val) return;
    const newTake = Number(val);
    onTakeChange?.(newTake);
    onRowsPerPageChange?.(newTake);
    onSkipChange?.(0);
    onPageChange?.(1);
  };

  const pageNumbers = getPageNumbers(
    calculatedCurrentPage,
    calculatedTotalPages,
  );

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 mt-4 border-t border-border/60 text-xs text-muted-foreground select-none">
      {/* Result counter correlated with current status */}
      <div>
        {effectiveTotal === 0 ? (
          <span>
            No {statusLabel ? `${statusLabel} ` : ""}profiles found
          </span>
        ) : (
          <span>
            Showing{" "}
            <strong className="font-semibold text-foreground">
              {startItem}–{endItem}
            </strong>{" "}
            of{" "}
            <strong className="font-semibold text-foreground">
              {effectiveTotal.toLocaleString()}
            </strong>{" "}
            {statusLabel ? `${statusLabel} ` : ""}profiles
          </span>
        )}
      </div>

      {/* Rows per page & Page numbers */}
      <div className="flex items-center gap-6">
        {/* Rows per page (take) */}
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground whitespace-nowrap">
            Rows per page:
          </span>
          <Select
            value={String(currentTake)}
            onValueChange={handleRowsSelect}
            disabled={isLoading}
          >
            <SelectTrigger className="h-8 w-18 text-xs rounded-lg border-border/80 bg-background hover:bg-muted/50 cursor-pointer transition-colors">
              <SelectValue placeholder="5" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="25">25</SelectItem>
              <SelectItem value="50">50</SelectItem>
              <SelectItem value="100">100</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Navigation Buttons powered by skip & take */}
        <div className="flex items-center gap-1.5">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handlePrevious}
            disabled={!canGoPrevious}
            className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 gap-1 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Previous</span>
          </Button>

          {pageNumbers.map((item, idx) => {
            if (item === "ellipsis") {
              return (
                <span
                  key={`ellipsis-${idx}`}
                  className="w-8 h-8 flex items-center justify-center text-xs text-muted-foreground select-none"
                >
                  ...
                </span>
              );
            }

            const pageNumber = item;
            const isActive = pageNumber === calculatedCurrentPage;

            return (
              <Button
                key={pageNumber}
                type="button"
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => handlePageClick(pageNumber)}
                disabled={isLoading}
                className={cn(
                  "w-8 h-8 p-0 rounded-lg text-xs font-semibold cursor-pointer transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground border-primary shadow-xs font-bold hover:bg-primary/95"
                    : "border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted",
                )}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={handleNext}
            disabled={!canGoNext}
            className="h-8 px-2.5 text-xs font-medium text-muted-foreground hover:text-foreground border-border/80 gap-1 rounded-lg cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
          >
            <span>Next</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </Button>
        </div>
      </div>
    </div>
  );
}
