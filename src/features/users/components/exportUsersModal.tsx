"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { FileText, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

type ExportScope = "all" | "filtered";
type ExportFormat = "csv" | "xlsx" | "pdf" | "json";

interface ExportUsersModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  totalUsersCount?: number;
  filteredUsersCount?: number;
  onConfirmExport?: (scope: ExportScope, format: ExportFormat) => void;
}

const formatLabels: Record<ExportFormat, { label: string; ext: string }> = {
  csv: { label: "CSV (.csv)", ext: "csv" },
  xlsx: { label: "Excel (.xlsx)", ext: "xlsx" },
  pdf: { label: "PDF (.pdf)", ext: "pdf" },
  json: { label: "JSON (.json)", ext: "json" },
};

export function ExportUsersModal({
  open,
  onOpenChange,
  totalUsersCount = 12482,
  filteredUsersCount = 6,
  onConfirmExport,
}: ExportUsersModalProps) {
  const [scope, setScope] = useState<ExportScope>("all");
  const [format, setFormat] = useState<ExportFormat>("csv");

  const selectedCount = scope === "all" ? totalUsersCount : filteredUsersCount;
  const fileName = `users_export.${formatLabels[format].ext}`;

  const handleExport = () => {
    onConfirmExport?.(scope, format);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-card border-border p-6 gap-5">
        <DialogHeader className="text-left space-y-1">
          <DialogTitle className="text-lg font-bold text-foreground">
            Export Users
          </DialogTitle>
          <DialogDescription className="text-xs text-muted-foreground">
            Choose the users and file format you want to export.
          </DialogDescription>
        </DialogHeader>

        {/* Users to Export Radio Selection */}
        <div className="space-y-3">
          <label className="text-xs font-semibold text-foreground block">
            Users to Export
          </label>

          <div className="space-y-2.5">
            {/* Option 1: All Users */}
            <div
              onClick={() => setScope("all")}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer",
                scope === "all"
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 hover:bg-muted/40"
              )}
            >
              <div className="pt-0.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    scope === "all"
                      ? "border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {scope === "all" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground">All Users</span>
                <span className="text-[11px] text-muted-foreground">
                  Export every user registered on Hosté.
                </span>
              </div>
            </div>

            {/* Option 2: Current Filtered Users */}
            <div
              onClick={() => setScope("filtered")}
              className={cn(
                "flex items-start gap-3 p-2.5 rounded-lg border transition-colors cursor-pointer",
                scope === "filtered"
                  ? "border-primary/40 bg-primary/5"
                  : "border-border/60 hover:bg-muted/40"
              )}
            >
              <div className="pt-0.5">
                <div
                  className={cn(
                    "w-4 h-4 rounded-full border flex items-center justify-center transition-colors",
                    scope === "filtered"
                      ? "border-primary"
                      : "border-muted-foreground/40"
                  )}
                >
                  {scope === "filtered" && (
                    <div className="w-2 h-2 rounded-full bg-primary" />
                  )}
                </div>
              </div>
              <div className="flex flex-col text-left">
                <span className="text-xs font-bold text-foreground">
                  Current Filtered Users
                </span>
                <span className="text-[11px] text-muted-foreground">
                  Export only the users currently shown based on the selected search, tabs, and filters.
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* File Format Selection */}
        <div className="space-y-1.5 text-left">
          <label className="text-xs font-semibold text-foreground block">
            File Format
          </label>
          <DropdownMenu>
            <DropdownMenuTrigger className="w-full h-10 px-3.5 text-xs font-medium border border-border/80 bg-card hover:bg-muted/50 rounded-lg inline-flex items-center justify-between text-foreground cursor-pointer">
              <div className="flex items-center gap-2">
                <FileText className="w-4 h-4 text-muted-foreground" />
                <span>{formatLabels[format].label}</span>
              </div>
              <ChevronDown className="w-3.5 h-3.5 opacity-60" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-[380px] text-xs">
              {(Object.keys(formatLabels) as ExportFormat[]).map((fmt) => (
                <DropdownMenuItem
                  key={fmt}
                  onClick={() => setFormat(fmt)}
                  className="flex items-center gap-2"
                >
                  <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                  <span>{formatLabels[fmt].label}</span>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Summary Box */}
        <div className="bg-muted/30 border border-border/70 rounded-lg p-3.5 flex items-center justify-between text-left">
          <div className="flex flex-col">
            <span className="text-[11px] text-muted-foreground font-normal">
              Users selected:
            </span>
            <span className="text-xs font-bold text-foreground mt-0.5">
              {selectedCount.toLocaleString()}
            </span>
          </div>

          <div className="flex flex-col text-right">
            <span className="text-[11px] text-muted-foreground font-normal">
              File:
            </span>
            <span className="text-xs font-semibold text-foreground font-mono mt-0.5">
              {fileName}
            </span>
          </div>
        </div>

        <DialogFooter className="flex sm:justify-end gap-2 pt-2">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs font-medium h-9 px-4"
          >
            Cancel
          </Button>

          <Button
            type="button"
            size="sm"
            onClick={handleExport}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold text-xs sm:text-sm h-9 px-5 rounded-lg cursor-pointer"
          >
            Export Users
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
