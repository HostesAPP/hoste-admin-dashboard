"use client";

import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Search, ChevronDown, X } from "lucide-react";
import { userFilterSchema, type UserFilterFormValues } from "../schemas/users.schema";
import type { UserTab } from "../types/users.types";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";

// NOTE: The backend GET /api/v1/users only accepts: search, category, accountStatus, dateFrom, dateTo.
// The "Filter" (Verified/Unverified) and "Role" dropdowns have no backend mapping —
// category filtering is handled by the Tab row (ALL / HOSTÉS / CUSTOMERS / ADMINS & STAFF).

interface UsersFilterBarProps {
  activeTab: UserTab;
  onTabChange: (tab: UserTab) => void;
  filters: Partial<UserFilterFormValues>;
  onFiltersChange: (values: Partial<UserFilterFormValues>) => void;
  onClearFilters: () => void;
}

const tabs: { id: UserTab; label: string }[] = [
  { id: "ALL", label: "ALL USERS" },
  { id: "HOSTES", label: "HOSTÉS" },
  { id: "CUSTOMERS", label: "CUSTOMERS" },
  { id: "ADMINS", label: "ADMINS & STAFF" },
];

export function UsersFilterBar({
  activeTab,
  onTabChange,
  filters,
  onFiltersChange,
  onClearFilters,
}: UsersFilterBarProps) {
  const [searchTerm, setSearchTerm] = useState(filters.search || "");

  // Sync internal search input state when external filters.search changes (e.g. on reset/clear)
  useEffect(() => {
    (() => {
      setSearchTerm(filters.search || "");
    })();
  }, [filters.search]);

  // Debounce search input (300ms) to avoid spamming the backend
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchTerm !== (filters.search || "")) {
        onFiltersChange({ search: searchTerm });
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchTerm, filters.search, onFiltersChange]);

  const { control, setValue, reset } = useForm<UserFilterFormValues>({
    resolver: zodResolver(userFilterSchema),
    defaultValues: {
      tab: activeTab,
      search: filters.search || "",
      filter: filters.filter || "",
      dateJoined: filters.dateJoined || "",
      status: filters.status || "",
      role: filters.role || "",
      page: 1,
      pageSize: 6,
    },
  });

  const handleReset = () => {
    setSearchTerm("");
    reset({
      tab: activeTab,
      search: "",
      filter: "",
      dateJoined: "",
      status: "",
      role: "",
      page: 1,
      pageSize: 6,
    });
    onClearFilters();
  };

  return (
    <div className="space-y-4 pt-2">
      {/* Category Tabs */}
      <div className="flex items-center gap-8 border-b border-border/60">
        {tabs.map((tab) => {
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => {
                onTabChange(tab.id);
                setValue("tab", tab.id);
              }}
              className={cn(
                "pb-3 text-xs font-semibold tracking-wider transition-colors relative cursor-pointer",
                isActive
                  ? "text-primary font-bold"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {tab.label}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary" />
              )}
            </button>
          );
        })}
      </div>

      {/* Filter Inputs & Dropdowns Row */}
      <div className="flex flex-wrap items-center gap-3 pt-1">
        {/* Search Input */}
        <div className="relative flex-1 min-w-70">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
          <Input
            type="search"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by name, email, phone number or User ID..."
            className="pl-10 pr-9 h-10 text-xs rounded-lg bg-card border-border/80 focus-visible:ring-primary focus-visible:ring-1"
          />
          {searchTerm && (
            <button
              type="button"
              onClick={() => {
                setSearchTerm("");
                onFiltersChange({ search: "" });
              }}
              className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-muted-foreground hover:text-foreground rounded-md transition-colors cursor-pointer"
              aria-label="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>

        {/* Date Joined Dropdown */}
        <Controller
          control={control}
          name="dateJoined"
          render={({ field }) => (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 text-xs font-normal border border-border/80 bg-card hover:bg-muted/50 px-3.5 gap-2 text-muted-foreground min-w-[110px] justify-between inline-flex items-center rounded-md cursor-pointer">
                <span>{field.value ? field.value : "Date Joined"}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="text-xs">
                <DropdownMenuItem onClick={() => { field.onChange(""); onFiltersChange({ dateJoined: "" }); }}>
                  Any time
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { field.onChange("Last 7 days"); onFiltersChange({ dateJoined: "7d" }); }}>
                  Last 7 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { field.onChange("Last 30 days"); onFiltersChange({ dateJoined: "30d" }); }}>
                  Last 30 days
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { field.onChange("This Year"); onFiltersChange({ dateJoined: "year" }); }}>
                  This Year
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />

        {/* Status Dropdown */}
        <Controller
          control={control}
          name="status"
          render={({ field }) => (
            <DropdownMenu>
              <DropdownMenuTrigger className="h-10 text-xs font-normal border border-border/80 bg-card hover:bg-muted/50 px-3.5 gap-2 text-muted-foreground min-w-[95px] justify-between inline-flex items-center rounded-md cursor-pointer">
                <span className="capitalize">{field.value ? field.value : "Status"}</span>
                <ChevronDown className="w-3.5 h-3.5 opacity-60" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="text-xs">
                <DropdownMenuItem onClick={() => { field.onChange(""); onFiltersChange({ status: "" }); }}>
                  All Statuses
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { field.onChange("Active"); onFiltersChange({ status: "Active" }); }}>
                  Active
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => { field.onChange("Suspended"); onFiltersChange({ status: "Suspended" }); }}>
                  Suspended
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        />



        {/* Clear Filters Link */}
        <button
          type="button"
          onClick={handleReset}
          className="text-xs font-medium text-primary hover:underline px-2 py-2 cursor-pointer transition-colors"
        >
          Clear Filters
        </button>
      </div>
    </div>
  );
}
