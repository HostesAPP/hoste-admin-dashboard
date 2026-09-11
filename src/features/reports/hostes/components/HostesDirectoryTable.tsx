"use client";

import React from "react";
import { ChevronDown, Star, MoreVertical, ChevronLeft, ChevronRight, Eye, ShieldCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { HosteDirectoryItem, HostesReportFilterParams } from "../types/hostes.types";

interface HostesDirectoryTableProps {
  directory: HosteDirectoryItem[];
  filters: HostesReportFilterParams;
  totalRecords: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  onFilterChange: (filters: Partial<HostesReportFilterParams>) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onViewHoste: (hoste: HosteDirectoryItem) => void;
}

const VERIFICATION_OPTIONS = ["All", "Verified", "Pending", "Unverified", "Suspended"];
const ACCOUNT_OPTIONS = ["All", "Active", "Pending", "Suspended", "Inactive"];
const BOOKING_OPTIONS = ["All", "High Volume (50+)", "Medium (10-49)", "Low (<10)"];
const TYPE_OPTIONS = ["All Types", "VIP Usher", "Protocol", "Hostess", "Brand Ambassador"];
const RATING_OPTIONS = ["All", "4.5+", "4.0+", "3.5+"];

export const HostesDirectoryTable: React.FC<HostesDirectoryTableProps> = ({
  directory,
  filters,
  totalRecords,
  currentPage,
  totalPages,
  pageSize,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onViewHoste,
}) => {
  const getVerificationBadge = (status: HosteDirectoryItem["verification"]) => {
    switch (status) {
      case "Verified":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
            Verified
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            Suspended
          </span>
        );
      case "Unverified":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            Unverified
          </span>
        );
      default:
        return null;
    }
  };

  const getAccountBadge = (status: HosteDirectoryItem["accountStatus"]) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-500/10 text-blue-600 border border-blue-500/20">
            Pending
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-destructive/10 text-destructive border border-destructive/20">
            Suspended
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex px-2 py-0.5 rounded-full text-[10px] font-bold bg-muted text-muted-foreground border border-border">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  const startRange = (currentPage - 1) * pageSize + 1;
  const endRange = Math.min(currentPage * pageSize, totalRecords);
  const pages = Array.from({ length: Math.min(totalPages, 3) }, (_, i) => i + 1);

  return (
    <div className="bg-card border border-border/80 rounded-2xl p-5 shadow-soft space-y-4">
      {/* Header */}
      <div>
        <h3 className="text-base font-bold text-foreground">
          Hosté Users Directory & Audit Table
        </h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          Detailed account list with individual fulfillment metrics and status controls
        </p>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 py-1 text-xs">
        <div className="flex flex-wrap items-center gap-2">
          {/* Verification Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 bg-background hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1 rounded-lg shadow-xs cursor-pointer transition-colors">
              <span className="text-muted-foreground">Verification:</span>
              <span className="font-semibold">{filters.verification}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 rounded-xl">
              {VERIFICATION_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onFilterChange({ verification: opt })}
                  className="cursor-pointer text-xs"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Account Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 bg-background hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1 rounded-lg shadow-xs cursor-pointer transition-colors">
              <span className="text-muted-foreground">Account:</span>
              <span className="font-semibold">{filters.accountStatus}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 rounded-xl">
              {ACCOUNT_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onFilterChange({ accountStatus: opt })}
                  className="cursor-pointer text-xs"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Booking Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 bg-background hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1 rounded-lg shadow-xs cursor-pointer transition-colors">
              <span className="text-muted-foreground">Booking:</span>
              <span className="font-semibold">{filters.booking}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 rounded-xl">
              {BOOKING_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onFilterChange({ booking: opt })}
                  className="cursor-pointer text-xs"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Type Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 bg-background hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1 rounded-lg shadow-xs cursor-pointer transition-colors">
              <span className="text-muted-foreground">Type:</span>
              <span className="font-semibold">{filters.type}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-44 rounded-xl">
              {TYPE_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onFilterChange({ type: opt })}
                  className="cursor-pointer text-xs"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Rating Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger className="h-8 px-2.5 bg-background hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1 rounded-lg shadow-xs cursor-pointer transition-colors">
              <span className="text-muted-foreground">Rating:</span>
              <span className="font-semibold">{filters.rating}</span>
              <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-36 rounded-xl">
              {RATING_OPTIONS.map((opt) => (
                <DropdownMenuItem
                  key={opt}
                  onClick={() => onFilterChange({ rating: opt })}
                  className="cursor-pointer text-xs"
                >
                  {opt}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-primary hover:underline cursor-pointer px-1"
        >
          Reset Filters
        </button>
      </div>

      {/* Directory Table */}
      <div className="w-full overflow-x-auto rounded-xl border border-border/70">
        <table className="w-full text-left border-collapse min-w-[1050px]">
          <thead>
            <tr className="border-b border-border/80 bg-muted/30 text-[11px] font-bold text-muted-foreground uppercase tracking-wider">
              <th className="py-3 px-4">HOSTÉ USER</th>
              <th className="py-3 px-4">VERIFICATION</th>
              <th className="py-3 px-4">BOOKINGS (TOT/CMP/CNC)</th>
              <th className="py-3 px-4">COMPL. RATE</th>
              <th className="py-3 px-4">TOTAL EARNINGS</th>
              <th className="py-3 px-4">RATING</th>
              <th className="py-3 px-4">LAST ACTIVE</th>
              <th className="py-3 px-4">ACCOUNT STATUS</th>
              <th className="py-3 px-4">JOINED</th>
              <th className="py-3 px-4 text-right">ACTIONS</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border/60 text-xs">
            {directory.map((item) => (
              <tr key={item.id} className="hover:bg-muted/30 transition-colors">
                {/* HOSTÉ USER */}
                <td className="py-3.5 px-4">
                  <div className="flex flex-col">
                    <span className="font-bold text-foreground">{item.name}</span>
                    <span className="text-[11px] text-muted-foreground">
                      {item.email}
                    </span>
                  </div>
                </td>

                {/* VERIFICATION */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getVerificationBadge(item.verification)}
                </td>

                {/* BOOKINGS */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <span>{item.bookings.total} / </span>
                  <span className="font-bold text-secondary">
                    {item.bookings.completed}
                  </span>
                  <span> / </span>
                  <span className="text-destructive font-bold">
                    {item.bookings.cancelled}
                  </span>
                </td>

                {/* COMPL. RATE */}
                <td className="py-3.5 px-4 font-bold text-secondary whitespace-nowrap">
                  {item.completionRate}
                </td>

                {/* TOTAL EARNINGS */}
                <td className="py-3.5 px-4 font-extrabold text-foreground whitespace-nowrap">
                  {item.totalEarnings}
                </td>

                {/* RATING */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  <div className="flex items-center gap-1 font-bold text-foreground">
                    <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                    <span>{item.rating.toFixed(2)}</span>
                  </div>
                </td>

                {/* LAST ACTIVE */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {item.lastActive}
                </td>

                {/* ACCOUNT STATUS */}
                <td className="py-3.5 px-4 whitespace-nowrap">
                  {getAccountBadge(item.accountStatus)}
                </td>

                {/* JOINED */}
                <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                  {item.joinedDate}
                </td>

                {/* ACTIONS */}
                <td className="py-3.5 px-4 text-right whitespace-nowrap">
                  <DropdownMenu>
                    <DropdownMenuTrigger className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer inline-flex items-center justify-center">
                      <MoreVertical className="w-4 h-4" />
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="w-44 rounded-xl">
                      <DropdownMenuItem
                        onClick={() => onViewHoste(item)}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>View Details</span>
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => {}}
                        className="cursor-pointer text-xs flex items-center gap-2"
                      >
                        <ShieldCheck className="w-3.5 h-3.5 text-muted-foreground" />
                        <span>Audit History</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination Footer */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-2 text-xs text-muted-foreground">
        <div>
          Showing <span className="font-bold text-foreground">{startRange}</span> to{" "}
          <span className="font-bold text-foreground">{endRange}</span> of{" "}
          <span className="font-bold text-foreground">
            {totalRecords.toLocaleString()}
          </span>{" "}
          Hosté accounts
        </div>

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
    </div>
  );
};
