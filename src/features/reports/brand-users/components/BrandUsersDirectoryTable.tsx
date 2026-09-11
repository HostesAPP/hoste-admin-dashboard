"use client";

import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import {
  Search,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  User,
  Calendar,
  FileText,
} from "lucide-react";
import type {
  BrandDirectoryItem,
  BrandReportFilterParams,
  BrandAccountStatus,
} from "../types/brand-users.types";

interface BrandUsersDirectoryTableProps {
  brands: BrandDirectoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: BrandReportFilterParams;
  onFilterChange: (filters: Partial<BrandReportFilterParams>) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onViewDetails: (brand: BrandDirectoryItem) => void;
}

export const BrandUsersDirectoryTable: React.FC<BrandUsersDirectoryTableProps> = ({
  brands,
  totalCount,
  currentPage,
  totalPages,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onViewDetails,
}) => {
  const renderStatusPill = (status: BrandAccountStatus) => {
    switch (status) {
      case "Active":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-secondary bg-secondary/10 px-2.5 py-0.5 rounded-full border border-secondary/20">
            <span className="w-1.5 h-1.5 rounded-full bg-secondary inline-block" />
            Active
          </span>
        );
      case "Pending":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-amber-600 dark:text-amber-400 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-500 inline-block" />
            Pending
          </span>
        );
      case "Inactive":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-muted-foreground bg-muted px-2.5 py-0.5 rounded-full border border-border">
            <span className="w-1.5 h-1.5 rounded-full bg-slate-500 inline-block" />
            Inactive
          </span>
        );
      case "Suspended":
        return (
          <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-destructive bg-destructive/10 px-2.5 py-0.5 rounded-full border border-destructive/20">
            <span className="w-1.5 h-1.5 rounded-full bg-destructive inline-block" />
            Suspended
          </span>
        );
      default:
        return <span>{status}</span>;
    }
  };

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card overflow-hidden">
      {/* Filters Bar */}
      <div className="p-4 border-b border-border flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex flex-wrap items-center gap-2 whitespace-nowrap">
          <span className="font-bold text-foreground mr-1">Filter By:</span>

          <select
            aria-label="Filter by Status"
            value={filters.status}
            onChange={(e) => onFilterChange({ status: e.target.value })}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All Statuses">Status: All Statuses</option>
            <option value="Active">Active</option>
            <option value="Pending">Pending</option>
            <option value="Inactive">Inactive</option>
            <option value="Suspended">Suspended</option>
          </select>

          <select
            aria-label="Filter by Booking Status"
            value={filters.booking}
            onChange={(e) => onFilterChange({ booking: e.target.value })}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All Statuses">Booking: All Statuses</option>
            <option value="Confirmed">Confirmed</option>
            <option value="Completed">Completed</option>
            <option value="Cancelled">Cancelled</option>
          </select>

          <select
            aria-label="Filter by Booking Type"
            value={filters.type}
            onChange={(e) => onFilterChange({ type: e.target.value })}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All Booking Types">Type: All Booking Types</option>
            <option value="One-Time">One-Time / Per Booking</option>
            <option value="Full-Time">Full-Time Placement</option>
            <option value="Retainer">Contract Retainer</option>
          </select>

          <select
            aria-label="Filter by Spend Range"
            value={filters.spend}
            onChange={(e) => onFilterChange({ spend: e.target.value })}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All Ranges">Spend: All Ranges</option>
            <option value="Under 1M">&lt; ₦1,000,000</option>
            <option value="1M - 10M">₦1,000,000 - ₦10,000,000</option>
            <option value="Over 10M">&gt; ₦10,000,000</option>
          </select>

          <select
            aria-label="Filter by Brand Category"
            value={filters.brand}
            onChange={(e) => onFilterChange({ brand: e.target.value })}
            className="h-8 px-2.5 text-xs rounded-lg border border-border bg-background text-foreground focus:outline-none focus:ring-1 focus:ring-primary cursor-pointer"
          >
            <option value="All Brands">Brand: All Brands</option>
            <option value="Enterprise">Enterprise</option>
            <option value="SMB">SMB / Mid-Market</option>
            <option value="Agency">Agencies</option>
          </select>

          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:underline cursor-pointer ml-1"
          >
            Reset Filters
          </button>
        </div>

        {/* Right Search Input */}
        <div className="relative min-w-[200px]">
          <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-muted-foreground" />
          <Input
            placeholder="Search Brand/Email..."
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            className="pl-8 h-8 text-xs rounded-lg bg-muted/20 border-border"
          />
        </div>
      </div>

      {/* Table */}
      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs whitespace-nowrap">
            <thead>
              <tr className="border-b border-border bg-muted/20 text-muted-foreground font-semibold uppercase text-[10px] tracking-wider whitespace-nowrap">
                <th className="py-2.5 px-4">BRAND / USER</th>
                <th className="py-2.5 px-4">EMAIL</th>
                <th className="py-2.5 px-4 text-center">TOTAL BKGS</th>
                <th className="py-2.5 px-4 text-center">COMPLETED</th>
                <th className="py-2.5 px-4 text-center">CANCELLED</th>
                <th className="py-2.5 px-4">TOTAL SPEND (₦)</th>
                <th className="py-2.5 px-4">AVG BK VALUE</th>
                <th className="py-2.5 px-4 text-center">STATUS</th>
                <th className="py-2.5 px-4">JOINED</th>
                <th className="py-2.5 px-4 text-center">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60 whitespace-nowrap">
              {brands.map((brand) => (
                <tr key={brand.id} className="hover:bg-muted/20 transition-colors">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2.5">
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs ${brand.avatarColor}`}
                      >
                        {brand.initial}
                      </div>
                      <span className="font-bold text-foreground">{brand.name}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4 text-muted-foreground">{brand.email}</td>
                  <td className="py-3 px-4 text-center font-bold text-foreground">
                    {brand.totalBookings}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-secondary">
                    {brand.completed}
                  </td>
                  <td className="py-3 px-4 text-center font-bold text-destructive">
                    {brand.cancelled}
                  </td>
                  <td className="py-3 px-4 font-bold text-foreground">
                    {brand.totalSpend}
                  </td>
                  <td className="py-3 px-4 text-foreground">{brand.avgBookingValue}</td>
                  <td className="py-3 px-4 text-center">{renderStatusPill(brand.status)}</td>
                  <td className="py-3 px-4 text-muted-foreground">{brand.joinedDate}</td>
                  <td className="py-3 px-4 text-center">
                    <DropdownMenu>
                      <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
                        <MoreHorizontal className="w-4 h-4" />
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end" className="w-fit p-2 text-xs roundedlg shadow-md">
                        <DropdownMenuItem
                          onClick={() => onViewDetails(brand)}
                          className="gap-2 cursor-pointer"
                        >
                          <User className="w-3.5 h-3.5 text-muted-foreground" />
                          View Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                          View Bookings
                        </DropdownMenuItem>
                        <DropdownMenuItem className="gap-2 cursor-pointer">
                          <FileText className="w-3.5 h-3.5 text-muted-foreground" />
                          View Activity Log
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
        <div className="flex items-center justify-between px-4 py-3 border-t border-border text-xs text-muted-foreground">
          <p>
            Showing <span className="font-bold text-foreground">1 to 7</span> of{" "}
            <span className="font-bold text-foreground">{totalCount}</span> Brand Users
          </p>
          <div className="flex items-center gap-1">
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="h-7 w-7 p-0 rounded-lg"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </Button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
              <Button
                key={page}
                variant={currentPage === page ? "default" : "outline"}
                size="sm"
                onClick={() => onPageChange(page)}
                className={`h-7 w-7 p-0 rounded-lg text-xs font-bold ${
                  currentPage === page
                    ? "bg-primary text-primary-foreground hover:bg-primary/90"
                    : "text-foreground"
                }`}
              >
                {page}
              </Button>
            ))}
            <Button
              variant="outline"
              size="sm"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="h-7 w-7 p-0 rounded-lg"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
