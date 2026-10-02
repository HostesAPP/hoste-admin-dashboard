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

interface ProfilesPaginationProps {
  currentPage: number;
  totalPages: number;
  totalResults: number;
  rowsPerPage: number;
  onPageChange: (page: number) => void;
  onRowsPerPageChange: (rows: number) => void;
}

export function ProfilesPagination({
  currentPage,
  totalPages,
  totalResults,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
}: ProfilesPaginationProps) {
  const startItem = totalResults === 0 ? 0 : (currentPage - 1) * rowsPerPage + 1;
  const endItem = Math.min(currentPage * rowsPerPage, totalResults);

  return (
    <div className="flex items-center justify-between pt-5 pb-2 text-xs text-muted-foreground select-none">
      {/* Result counter */}
      <div>
        Showing {startItem} to {endItem} of {totalResults} results
      </div>

      {/* Rows per page & Page numbers */}
      <div className="flex items-center gap-6">
        {/* Rows per page */}
        <div className="flex items-center gap-2">
          <span>Rows per page:</span>
          <Select
            value={String(rowsPerPage)}
            onValueChange={(val) => onRowsPerPageChange(Number(val))}
          >
            <SelectTrigger className="h-7 w-16 text-xs rounded-lg border-border/80 bg-card">
              <SelectValue placeholder="10" />
            </SelectTrigger>
            <SelectContent className="rounded-xl">
              <SelectItem value="5">5</SelectItem>
              <SelectItem value="10">10</SelectItem>
              <SelectItem value="20">20</SelectItem>
              <SelectItem value="50">50</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Page Buttons */}
        <div className="flex items-center gap-1.5">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage - 1)}
            disabled={currentPage <= 1}
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          >
            <ChevronLeft className="w-4 h-4" />
            <span className="sr-only">Previous page</span>
          </Button>

          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            const isActive = pageNumber === currentPage;

            return (
              <Button
                key={pageNumber}
                variant={isActive ? "default" : "ghost"}
                size="icon"
                onClick={() => onPageChange(pageNumber)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-semibold cursor-pointer transition-all",
                  isActive
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "text-muted-foreground hover:text-foreground hover:bg-muted"
                )}
              >
                {pageNumber}
              </Button>
            );
          })}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => onPageChange(currentPage + 1)}
            disabled={currentPage >= totalPages}
            className="w-7 h-7 rounded-lg text-muted-foreground hover:text-foreground disabled:opacity-30 cursor-pointer"
          >
            <ChevronRight className="w-4 h-4" />
            <span className="sr-only">Next page</span>
          </Button>
        </div>
      </div>
    </div>
  );
}
