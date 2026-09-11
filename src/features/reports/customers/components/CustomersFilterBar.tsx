"use client";

import React from "react";
import { Search, RotateCcw } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { CustomerReportFilterParams } from "../types/customers.types";

interface CustomersFilterBarProps {
  filters: CustomerReportFilterParams;
  onFilterChange: (filters: Partial<CustomerReportFilterParams>) => void;
  onResetFilters: () => void;
}

export const CustomersFilterBar: React.FC<CustomersFilterBarProps> = ({
  filters,
  onFilterChange,
  onResetFilters,
}) => {
  return (
    <div className="flex flex-wrap items-center gap-3 p-3 rounded-2xl bg-card border border-border shadow-xs">
      {/* Filters Label */}
      <span className="text-xs font-bold tracking-wider text-muted-foreground uppercase px-1">
        FILTERS:
      </span>

      {/* Status Filter */}
      <div className="w-36">
        <Select
          value={filters.status}
          onValueChange={(val) => onFilterChange({ status: val || "All" })}
        >
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
            <SelectValue placeholder="Status: All" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">Status: All</SelectItem>
            <SelectItem value="Active">Active</SelectItem>
            <SelectItem value="Pending">Pending</SelectItem>
            <SelectItem value="Suspended">Suspended</SelectItem>
            <SelectItem value="Inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Booking Filter */}
      <div className="w-36">
        <Select
          value={filters.booking}
          onValueChange={(val) => onFilterChange({ booking: val || "All" })}
        >
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
            <SelectValue placeholder="Booking: All" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All">Booking: All</SelectItem>
            <SelectItem value="1-5 Bookings">1-5 Bookings</SelectItem>
            <SelectItem value="6-20 Bookings">6-20 Bookings</SelectItem>
            <SelectItem value="20+ Bookings">20+ Bookings</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Type Filter */}
      <div className="w-36">
        <Select
          value={filters.type}
          onValueChange={(val) => onFilterChange({ type: val || "All Types" })}
        >
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
            <SelectValue placeholder="Type: All Types" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="All Types">Type: All Types</SelectItem>
            <SelectItem value="VIP">VIP Customer</SelectItem>
            <SelectItem value="Corporate">Corporate Client</SelectItem>
            <SelectItem value="Individual">Individual User</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Spend Range Filter */}
      <div className="w-44">
        <Select
          value={filters.spend}
          onValueChange={(val) => onFilterChange({ spend: val || "₦0 - ₦100M+" })}
        >
          <SelectTrigger className="h-9 text-xs rounded-xl border-border bg-background">
            <SelectValue placeholder="Spend: ₦0 - ₦100M+" />
          </SelectTrigger>
          <SelectContent className="rounded-xl">
            <SelectItem value="₦0 - ₦100M+">Spend: ₦0 - ₦100M+</SelectItem>
            <SelectItem value="< ₦1M">&lt; ₦1M</SelectItem>
            <SelectItem value="₦1M - ₦10M">₦1M - ₦10M</SelectItem>
            <SelectItem value="₦10M - ₦50M">₦10M - ₦50M</SelectItem>
            <SelectItem value="₦50M+">₦50M+</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Search Input */}
      <div className="relative flex-1 min-w-[200px]">
        <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search Customer Name/ID..."
          value={filters.search}
          onChange={(e) => onFilterChange({ search: e.target.value })}
          className="h-9 pl-9 text-xs rounded-xl border-border bg-background"
        />
      </div>

      {/* Reset Filters */}
      <Button
        variant="outline"
        onClick={onResetFilters}
        className="h-9 text-xs border-primary/30 text-primary hover:bg-primary/10 hover:text-primary rounded-xl shrink-0 font-semibold gap-1.5"
      >
        <RotateCcw className="w-3.5 h-3.5" />
        Reset Filters
      </Button>
    </div>
  );
};
