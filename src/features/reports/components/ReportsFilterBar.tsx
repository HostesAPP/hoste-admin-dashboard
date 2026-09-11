"use client";

import React from "react";
import { Search, ChevronDown } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ReportFilterParams } from "../types/reports.types";

interface ReportsFilterBarProps {
  filters: ReportFilterParams;
  onFilterChange: (filters: Partial<ReportFilterParams>) => void;
  onResetFilters: () => void;
}

const STATUS_OPTIONS = [
  "All Statuses",
  "Successful",
  "Pending",
  "Refunded",
  "Failed",
];

const BOOKING_TYPE_OPTIONS = [
  "All Booking Types",
  "One-Time Event",
  "Full-Time Placement",
  "Contract Retainer",
];

const USER_TYPE_OPTIONS = [
  "All User Types",
  "Brand User",
  "Customer",
  "Event Planner",
];

const PAYMENT_METHOD_OPTIONS = [
  "All Payment Methods",
  "Card (Paystack)",
  "Bank Transfer",
  "USSD Payment",
  "Card (Mastercard)",
  "Card (Visa)",
];

export const ReportsFilterBar: React.FC<ReportsFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-stretch lg:items-center justify-between gap-3 py-1">
      {/* Left Filter Dropdowns */}
      <div className="flex flex-wrap items-center gap-2.5">
        <span className="text-xs font-bold text-foreground shrink-0 mr-1">
          Filter By:
        </span>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 px-3 bg-card hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1.5 rounded-lg shadow-xs cursor-pointer transition-colors">
            <span>Status:</span>
            <span className="font-semibold text-foreground">
              {filters.status === "All" ? "All Statuses" : filters.status}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 rounded-xl">
            {STATUS_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() =>
                  onFilterChange({ status: opt === "All Statuses" ? "All" : opt })
                }
                className="cursor-pointer text-xs"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Booking Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 px-3 bg-card hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1.5 rounded-lg shadow-xs cursor-pointer transition-colors">
            <span>Type:</span>
            <span className="font-semibold text-foreground">
              {filters.bookingType === "All"
                ? "All Booking Types"
                : filters.bookingType}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl">
            {BOOKING_TYPE_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() =>
                  onFilterChange({
                    bookingType: opt === "All Booking Types" ? "All" : opt,
                  })
                }
                className="cursor-pointer text-xs"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* User Type Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 px-3 bg-card hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1.5 rounded-lg shadow-xs cursor-pointer transition-colors">
            <span>User:</span>
            <span className="font-semibold text-foreground">
              {filters.userType === "All" ? "All User Types" : filters.userType}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-44 rounded-xl">
            {USER_TYPE_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() =>
                  onFilterChange({
                    userType: opt === "All User Types" ? "All" : opt,
                  })
                }
                className="cursor-pointer text-xs"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Payment Method Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="h-9 px-3 bg-card hover:bg-muted/50 border border-border text-foreground font-medium text-xs flex items-center gap-1.5 rounded-lg shadow-xs cursor-pointer transition-colors">
            <span>Method:</span>
            <span className="font-semibold text-foreground">
              {filters.paymentMethod === "All"
                ? "All Payment Methods"
                : filters.paymentMethod}
            </span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground ml-0.5" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-48 rounded-xl">
            {PAYMENT_METHOD_OPTIONS.map((opt) => (
              <DropdownMenuItem
                key={opt}
                onClick={() =>
                  onFilterChange({
                    paymentMethod: opt === "All Payment Methods" ? "All" : opt,
                  })
                }
                className="cursor-pointer text-xs"
              >
                {opt}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Right Search Input & Reset Button */}
      <div className="flex items-center gap-3 shrink-0">
        <div className="relative flex-1 sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={filters.search}
            onChange={(e) => onFilterChange({ search: e.target.value })}
            placeholder="Search Txn ID, Customer..."
            className="w-full h-9 pl-9 pr-3 text-xs bg-card border border-border rounded-lg placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary shadow-xs"
          />
        </div>

        <button
          type="button"
          onClick={onResetFilters}
          className="text-xs font-semibold text-primary hover:underline whitespace-nowrap cursor-pointer px-1"
        >
          Reset Filters
        </button>
      </div>
    </div>
  );
};
