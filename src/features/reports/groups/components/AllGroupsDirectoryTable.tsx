"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
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
  Search,
  Users,
  Calendar,
  Eye,
} from "lucide-react";
import type {
  GroupDirectoryItem,
  GroupsReportFilterParams,
} from "../types/groups.types";

interface AllGroupsDirectoryTableProps {
  groups: GroupDirectoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: GroupsReportFilterParams;
  onFilterChange: (filters: Partial<GroupsReportFilterParams>) => void;
  onResetFilters: () => void;
  onPageChange: (page: number) => void;
  onViewGroup: (group: GroupDirectoryItem) => void;
}

export const AllGroupsDirectoryTable: React.FC<AllGroupsDirectoryTableProps> = ({
  groups,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  filters,
  onFilterChange,
  onResetFilters,
  onPageChange,
  onViewGroup,
}) => {
  const startItem = totalCount === 0 ? 0 : (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card overflow-hidden">
      <CardHeader className="pb-3 px-6 pt-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <CardTitle className="text-base font-bold text-foreground">
              All Groups Directory
            </CardTitle>
            <CardDescription className="text-xs text-muted-foreground">
              Comprehensive breakdown of all registered groups on Hosté
            </CardDescription>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="flex flex-wrap items-center gap-3 pt-3">
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
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Pending">Pending</SelectItem>
                <SelectItem value="Completed">Completed</SelectItem>
                <SelectItem value="Cancelled">Cancelled</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Bookings Filter */}
          <div className="w-32">
            <Select
              value={filters.bookings}
              onValueChange={(val) => onFilterChange({ bookings: val || "All" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="Bookings: All" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All">Bookings: All</SelectItem>
                <SelectItem value="1-5 Bookings">1-5 Bookings</SelectItem>
                <SelectItem value="6-10 Bookings">6-10 Bookings</SelectItem>
                <SelectItem value="10+ Bookings">10+ Bookings</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Size Filter */}
          <div className="w-32">
            <Select
              value={filters.size}
              onValueChange={(val) => onFilterChange({ size: val || "All Sizes" })}
            >
              <SelectTrigger className="h-8.5 text-xs rounded-xl border-border bg-background">
                <SelectValue placeholder="Size: All Sizes" />
              </SelectTrigger>
              <SelectContent className="rounded-xl">
                <SelectItem value="All Sizes">Size: All Sizes</SelectItem>
                <SelectItem value="2-5 Members">2-5 Members</SelectItem>
                <SelectItem value="6-10 Members">6-10 Members</SelectItem>
                <SelectItem value="11-20 Members">11-20 Members</SelectItem>
                <SelectItem value="20+ Members">20+ Members</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Search Leader */}
          <div className="relative flex-1 min-w-[180px]">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search Leader..."
              value={filters.searchLeader}
              onChange={(e) => onFilterChange({ searchLeader: e.target.value })}
              className="h-8.5 pl-9 text-xs rounded-xl border-border bg-background"
            />
          </div>

          {/* Reset Filters Link */}
          <button
            type="button"
            onClick={onResetFilters}
            className="text-xs font-semibold text-primary hover:text-primary/80 transition-colors cursor-pointer px-2"
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
                <th className="py-3 px-5">GROUP NAME</th>
                <th className="py-3 px-4">GROUP LEADER</th>
                <th className="py-3 px-3">MEMBERS</th>
                <th className="py-3 px-4">BOOKINGS (C/C)</th>
                <th className="py-3 px-4">REVENUE (₦)</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4">CREATED DATE</th>
                <th className="py-3 px-4">LAST ACTIVITY</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {groups.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-8 text-center text-muted-foreground">
                    No groups found matching the selected filters.
                  </td>
                </tr>
              ) : (
                groups.map((group) => (
                  <tr
                    key={group.id}
                    className="hover:bg-muted/20 transition-colors group cursor-pointer"
                    onClick={() => onViewGroup(group)}
                  >
                    <td className="py-3 px-5 font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap">
                      {group.groupName}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {group.groupLeader}
                    </td>

                    <td className="py-3 px-3 font-semibold text-foreground">
                      {group.members}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {group.bookingsFormatted}
                    </td>

                    <td className="py-3 px-4 font-bold text-secondary whitespace-nowrap">
                      {group.revenue}
                    </td>

                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          group.status === "Active"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : group.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : group.status === "Completed"
                            ? "bg-blue-500/10 text-blue-600 border-blue-500/20"
                            : group.status === "Cancelled"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {group.status}
                      </Badge>
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {group.createdDate}
                    </td>

                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {group.lastActivity}
                    </td>

                    <td
                      className="py-3 px-4 text-right"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <DropdownMenu>
                        <DropdownMenuTrigger className="inline-flex items-center justify-center h-7 w-7 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground cursor-pointer">
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-40 rounded-xl shadow-lg border border-border"
                        >
                          <DropdownMenuItem
                            onClick={() => onViewGroup(group)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Eye className="w-3.5 h-3.5 text-primary" />
                            <span>View Group</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewGroup(group)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Users className="w-3.5 h-3.5 text-secondary" />
                            <span>View Members</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewGroup(group)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Calendar className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Bookings</span>
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
            Showing <span className="font-semibold text-foreground">{startItem} to {endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> entries
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
