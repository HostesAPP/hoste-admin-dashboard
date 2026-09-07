"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface UsersPaginationProps {
  currentPage: number;
  totalUsers: number;
  startRange: number;
  endRange: number;
  totalPages: number;
  onPageChange: (page: number) => void;
}

export function UsersPagination({
  currentPage,
  totalUsers,
  startRange,
  endRange,
  totalPages,
  onPageChange,
}: UsersPaginationProps) {
  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 px-2">
      {/* Left: Showing range */}
      <span className="text-xs text-muted-foreground">
        Showing <strong className="text-foreground font-semibold">{startRange}–{endRange}</strong> of{" "}
        <strong className="text-foreground font-semibold">{totalUsers.toLocaleString()}</strong> users
      </span>

      {/* Right: Pagination buttons */}
      <div className="flex items-center gap-1.5">
        <Button
          variant="outline"
          size="sm"
          disabled={currentPage <= 1}
          onClick={() => onPageChange(currentPage - 1)}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80"
        >
          Previous
        </Button>

        {/* Page 1 */}
        <button
          type="button"
          onClick={() => onPageChange(1)}
          className={cn(
            "w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer",
            currentPage === 1
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          1
        </button>

        {/* Page 2 */}
        <button
          type="button"
          onClick={() => onPageChange(2)}
          className={cn(
            "w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer",
            currentPage === 2
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          2
        </button>

        {/* Page 3 */}
        <button
          type="button"
          onClick={() => onPageChange(3)}
          className={cn(
            "w-7 h-7 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer",
            currentPage === 3
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          3
        </button>

        {/* Ellipsis */}
        <span className="px-1 text-xs text-muted-foreground">...</span>

        {/* Last Page */}
        <button
          type="button"
          onClick={() => onPageChange(totalPages)}
          className={cn(
            "h-7 px-2 rounded text-xs font-semibold flex items-center justify-center transition-colors cursor-pointer",
            currentPage === totalPages
              ? "bg-foreground text-background"
              : "text-muted-foreground hover:text-foreground hover:bg-muted"
          )}
        >
          {totalPages.toLocaleString()}
        </button>

        <Button
          variant="outline"
          size="sm"
          disabled={currentPage >= totalPages}
          onClick={() => onPageChange(currentPage + 1)}
          className="h-7 px-2.5 text-xs text-muted-foreground hover:text-foreground border-border/80"
        >
          Next
        </Button>
      </div>
    </div>
  );
}
