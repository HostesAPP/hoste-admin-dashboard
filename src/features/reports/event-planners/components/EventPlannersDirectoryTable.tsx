"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
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
  Activity,
} from "lucide-react";
import type {
  EventPlannerDirectoryItem,
  EventPlannerReportFilterParams,
} from "../types/event-planners.types";

interface EventPlannersDirectoryTableProps {
  planners: EventPlannerDirectoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: EventPlannerReportFilterParams;
  onPageChange: (page: number) => void;
  onViewDetails: (planner: EventPlannerDirectoryItem) => void;
}

export const EventPlannersDirectoryTable: React.FC<
  EventPlannersDirectoryTableProps
> = ({
  planners,
  totalCount,
  currentPage,
  totalPages,
  pageSize,
  onPageChange,
  onViewDetails,
}) => {
  const startItem = (currentPage - 1) * pageSize + 1;
  const endItem = Math.min(currentPage * pageSize, totalCount);

  return (
    <Card className="rounded-2xl border border-border shadow-xs bg-card overflow-hidden">
      <CardHeader className="flex flex-row items-center justify-between pb-3 px-6 pt-5">
        <CardTitle className="text-base font-bold text-foreground">
          Event Planner Directory
        </CardTitle>
        <span className="text-xs text-muted-foreground font-medium">
          Showing {startItem}-{endItem} of {totalCount.toLocaleString()}
        </span>
      </CardHeader>

      <CardContent className="p-0">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-muted/40 text-muted-foreground text-[10px] font-bold tracking-wider uppercase border-y border-border/70 whitespace-nowrap">
              <tr>
                <th className="py-3 px-5">EVENT PLANNER</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-3">BOOKINGS</th>
                <th className="py-3 px-3">EVENTS</th>
                <th className="py-3 px-3">CANCELLED</th>
                <th className="py-3 px-3">RATE</th>
                <th className="py-3 px-4">TOTAL SPEND</th>
                <th className="py-3 px-4">AVG BOOKING</th>
                <th className="py-3 px-4">LAST ACTIVITY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4">JOINED</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {planners.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-8 text-center text-muted-foreground">
                    No event planners found matching the selected filters.
                  </td>
                </tr>
              ) : (
                planners.map((planner) => {
                  const rateNum = parseFloat(planner.completionRate);
                  const rateColor =
                    rateNum >= 90
                      ? "text-secondary"
                      : rateNum >= 75
                      ? "text-amber-600"
                      : "text-destructive";

                  return (
                    <tr
                      key={planner.id}
                      className="hover:bg-muted/30 transition-colors group cursor-pointer"
                      onClick={() => onViewDetails(planner)}
                    >
                      {/* Event Planner with Avatar */}
                      <td className="py-3 px-5">
                        <div className="flex items-center gap-2.5">
                          <div
                            className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${planner.avatarBg}`}
                          >
                            {planner.initial}
                          </div>
                          <span className="font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap">
                            {planner.name}
                          </span>
                        </div>
                      </td>

                      {/* Email */}
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {planner.email}
                      </td>

                      {/* Bookings */}
                      <td className="py-3 px-3 font-semibold text-foreground">
                        {planner.bookings}
                      </td>

                      {/* Events */}
                      <td className="py-3 px-3 font-bold text-secondary">
                        {planner.events}
                      </td>

                      {/* Cancelled */}
                      <td className="py-3 px-3 font-medium text-muted-foreground">
                        {planner.cancelled}
                      </td>

                      {/* Rate */}
                      <td className={`py-3 px-3 font-bold ${rateColor}`}>
                        {planner.completionRate}
                      </td>

                      {/* Total Spend */}
                      <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">
                        {planner.totalSpend}
                      </td>

                      {/* Avg Booking */}
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {planner.avgBooking}
                      </td>

                      {/* Last Activity */}
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {planner.lastActivity}
                      </td>

                      {/* Status */}
                      <td className="py-3 px-3">
                        <Badge
                          variant="outline"
                          className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                            planner.status === "Active"
                              ? "bg-secondary/10 text-secondary border-secondary/20"
                              : planner.status === "Pending"
                              ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                              : planner.status === "Suspended"
                              ? "bg-destructive/10 text-destructive border-destructive/20"
                              : "bg-muted text-muted-foreground border-border"
                          }`}
                        >
                          {planner.status}
                        </Badge>
                      </td>

                      {/* Joined Date */}
                      <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                        {planner.joinedDate}
                      </td>

                      {/* Actions */}
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
                            className="w-44 rounded-xl shadow-lg border border-border"
                          >
                            <DropdownMenuItem
                              onClick={() => onViewDetails(planner)}
                              className="text-xs cursor-pointer gap-2 py-2"
                            >
                              <User className="w-3.5 h-3.5 text-primary" />
                              <span>View Profile</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onViewDetails(planner)}
                              className="text-xs cursor-pointer gap-2 py-2"
                            >
                              <Calendar className="w-3.5 h-3.5 text-secondary" />
                              <span>View Bookings</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem
                              onClick={() => onViewDetails(planner)}
                              className="text-xs cursor-pointer gap-2 py-2"
                            >
                              <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                              <span>View Activity</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Pagination */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-border/70 text-xs">
          <span className="text-muted-foreground">
            Showing <span className="font-semibold text-foreground">{startItem}-{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> event planners
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
