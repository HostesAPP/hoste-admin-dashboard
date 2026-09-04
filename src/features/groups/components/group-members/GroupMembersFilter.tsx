"use client";

import React from "react";
import { Search, ChevronDown, RotateCcw } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export type GroupMembersFilterProps = {
  searchQuery: string;
  onSearchChange: (query: string) => void;
  selectedRole: string;
  onRoleChange: (role: string) => void;
  selectedStatus: string;
  onStatusChange: (status: string) => void;
  selectedJoined: string;
  onJoinedChange: (joined: string) => void;
  onResetFilters: () => void;
  hasActiveFilters: boolean;
  selectedCount: number;
  isLeaderSelected?: boolean;
  onClearSelection?: () => void;
};

const ROLE_OPTIONS = ["All", "Group Leader", "Member", "Co-Leader"];
const STATUS_OPTIONS = ["All", "Active", "Pending", "Suspended"];
const JOINED_OPTIONS = [
  "Any Date",
  "Last 7 Days",
  "Last 30 Days",
  "Last 90 Days",
  "This Year",
];

export const GroupMembersFilter: React.FC<GroupMembersFilterProps> = ({
  searchQuery,
  onSearchChange,
  selectedRole,
  onRoleChange,
  selectedStatus,
  onStatusChange,
  selectedJoined,
  onJoinedChange,
  onResetFilters,
  hasActiveFilters,
  selectedCount,
  isLeaderSelected = true,
  onClearSelection,
}) => {
  return (
    <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-3 bg-card p-3 rounded-xl border border-border">
      {/* Left Filter Controls */}
      <div className="flex flex-wrap items-center gap-2.5 flex-1 w-full lg:w-auto">
        {/* Search Bar */}
        <div className="relative flex-1 min-w-[220px] max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => onSearchChange(e.target.value)}
            placeholder="Search name, email, or User ID..."
            className="w-full bg-background border border-input rounded-lg pl-9 pr-3 py-1.5 text-xs sm:text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
          />
        </div>

        {/* Role Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 rounded-lg text-xs sm:text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-muted-foreground">Role:</span>
            <span className="font-medium">{selectedRole}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {ROLE_OPTIONS.map((role) => (
              <DropdownMenuItem
                key={role}
                onClick={() => onRoleChange(role)}
                className={`cursor-pointer text-xs ${
                  selectedRole === role ? "font-semibold text-primary" : ""
                }`}
              >
                {role}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Status Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 rounded-lg text-xs sm:text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-muted-foreground">Status:</span>
            <span className="font-medium">{selectedStatus}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-36">
            {STATUS_OPTIONS.map((status) => (
              <DropdownMenuItem
                key={status}
                onClick={() => onStatusChange(status)}
                className={`cursor-pointer text-xs ${
                  selectedStatus === status ? "font-semibold text-primary" : ""
                }`}
              >
                {status}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Joined Date Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger className="flex items-center gap-1.5 bg-background border border-input px-3 py-1.5 rounded-lg text-xs sm:text-sm text-foreground hover:bg-muted/50 transition-colors cursor-pointer">
            <span className="text-muted-foreground">Joined:</span>
            <span className="font-medium">{selectedJoined}</span>
            <ChevronDown className="w-3.5 h-3.5 text-muted-foreground" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-40">
            {JOINED_OPTIONS.map((option) => (
              <DropdownMenuItem
                key={option}
                onClick={() => onJoinedChange(option)}
                className={`cursor-pointer text-xs ${
                  selectedJoined === option ? "font-semibold text-primary" : ""
                }`}
              >
                {option}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Reset Filters Link/Button */}
        {hasActiveFilters && (
          <button
            onClick={onResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer px-1 py-1"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset Filters</span>
          </button>
        )}
      </div>

      {/* Right side Selection Tag */}
      {selectedCount > 0 && (
        <div className="flex items-center gap-2 bg-warning/15 text-warning border border-warning/30 px-3 py-1.5 rounded-lg text-xs font-medium self-stretch sm:self-auto justify-between sm:justify-start">
          <span>
            {selectedCount} Selected {isLeaderSelected && "(Leader Protected)"}
          </span>
          {onClearSelection && (
            <button
              onClick={onClearSelection}
              className="text-xs hover:underline cursor-pointer opacity-75 hover:opacity-100 ml-1"
            >
              Clear
            </button>
          )}
        </div>
      )}
    </div>
  );
};
