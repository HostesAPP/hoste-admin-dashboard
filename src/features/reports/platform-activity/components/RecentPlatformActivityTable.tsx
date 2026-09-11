"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  User,
  Calendar,
  Users,
  Eye,
} from "lucide-react";
import type {
  PlatformActivityLogItem,
  PlatformActivityFilterParams,
} from "../types/platform-activity.types";

interface RecentPlatformActivityTableProps {
  logs: PlatformActivityLogItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: PlatformActivityFilterParams;
  onFilterChange: (filters: Partial<PlatformActivityFilterParams>) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onViewLog: (log: PlatformActivityLogItem) => void;
}

export const RecentPlatformActivityTable: React.FC<
  RecentPlatformActivityTableProps
> = ({
  logs,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onViewLog,
}) => {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              Recent Platform Activity Log
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Audit trail of system events, user actions, transactions, and state changes
            </CardDescription>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
          {/* User Type Filter */}
          <div className="w-36">
            <Select
              value={filters.userType}
              onValueChange={(val) => onFilterChange({ userType: val || "All Types" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="User: All Types" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All Types">User: All Types</SelectItem>
                <SelectItem value="Customer">Customer</SelectItem>
                <SelectItem value="Hosté (Host)">Hosté (Host)</SelectItem>
                <SelectItem value="Event Planner">Event Planner</SelectItem>
                <SelectItem value="Brand User">Brand User</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Activity Event Filter */}
          <div className="w-40">
            <Select
              value={filters.activityType}
              onValueChange={(val) => onFilterChange({ activityType: val || "All Events" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="Activity: All Events" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All Events">Activity: All Events</SelectItem>
                <SelectItem value="Booking Created">Booking Created</SelectItem>
                <SelectItem value="Payment Completed">Payment Completed</SelectItem>
                <SelectItem value="User Registration">User Registration</SelectItem>
                <SelectItem value="Group Created">Group Created</SelectItem>
                <SelectItem value="Ticket Created">Ticket Created</SelectItem>
                <SelectItem value="Profile Updated">Profile Updated</SelectItem>
                <SelectItem value="Booking Completed">Booking Completed</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Status Filter */}
          <div className="w-32">
            <Select
              value={filters.status}
              onValueChange={(val) => onFilterChange({ status: val || "All" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="Status: All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">Status: All</SelectItem>
                <SelectItem value="Success">Success</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="In Review">In Review</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Area Filter */}
          <div className="w-36">
            <Select
              value={filters.area}
              onValueChange={(val) => onFilterChange({ area: val || "All Areas" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="Area: All Areas" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All Areas">Area: All Areas</SelectItem>
                <SelectItem value="Bookings">Bookings</SelectItem>
                <SelectItem value="Payments">Payments</SelectItem>
                <SelectItem value="Profiles">Profiles</SelectItem>
                <SelectItem value="Groups">Groups</SelectItem>
                <SelectItem value="Support">Support</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Reset Filters Link */}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer px-2 ml-auto sm:ml-0"
          >
            Reset Filters
          </button>
        </div>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/30 text-muted-foreground text-[10px] font-bold tracking-wider uppercase border-y border-border/70 whitespace-nowrap">
              <tr>
                <th className="py-3 px-5">ACTIVITY DESCRIPTION</th>
                <th className="py-3 px-4">USER</th>
                <th className="py-3 px-4">USER TYPE</th>
                <th className="py-3 px-4">ACTIVITY TYPE</th>
                <th className="py-3 px-4">DATE & TIME</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4">AREA</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {logs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-muted-foreground">
                    No activity logs found matching the selected filters.
                  </td>
                </tr>
              ) : (
                logs.map((log) => (
                  <tr
                    key={log.id}
                    className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => onViewLog(log)}
                  >
                    <td className="py-3.5 px-5 font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap">
                      {log.activityDescription}
                    </td>

                    <td className="py-3.5 px-4 font-medium text-foreground whitespace-nowrap">
                      {log.user}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {log.userType}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {log.activityType}
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {log.dateTime}
                    </td>

                    <td className="py-3.5 px-3 whitespace-nowrap">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          log.status === "Success" || log.status === "Completed" || log.status === "Active"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : log.status === "Pending"
                            ? "bg-warning/10 text-warning border-warning/20"
                            : log.status === "In Review"
                            ? "bg-primary/10 text-primary border-primary/20"
                            : "bg-destructive/10 text-destructive border-destructive/20"
                        }`}
                      >
                        {log.status}
                      </Badge>
                    </td>

                    <td className="py-3.5 px-4 text-muted-foreground whitespace-nowrap">
                      {log.area}
                    </td>

                    <td
                      className="py-3.5 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-44 rounded-xl shadow-lg border border-border"
                        >
                          <DropdownMenuItem
                            onClick={() => onViewLog(log)}
                            className="text-xs cursor-pointer gap-2 py-2 text-primary font-semibold focus:text-primary"
                          >
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>View User</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewLog(log)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Booking</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewLog(log)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Users className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Group</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewLog(log)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Activity Detail</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/70 text-xs">
          <span className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startItem} to {Math.min(endItem, logs.length)}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> activity logs
          </span>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              disabled={currentPage <= 1}
              onClick={() => onPageChange(currentPage - 1)}
              className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                type="button"
                onClick={() => onPageChange(p)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                  currentPage === p
                    ? "bg-primary text-primary-foreground shadow-xs"
                    : "border border-border/80 text-muted-foreground hover:text-foreground hover:bg-muted/50"
                }`}
              >
                {p}
              </button>
            ))}

            <button
              type="button"
              disabled={currentPage >= totalPages}
              onClick={() => onPageChange(currentPage + 1)}
              className="w-8 h-8 rounded-lg border border-border/80 flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors cursor-pointer"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
