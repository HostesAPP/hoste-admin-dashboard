"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
  CustomerDirectoryItem,
  CustomerReportFilterParams,
} from "../types/customers.types";

interface CustomersDirectoryTableProps {
  customers: CustomerDirectoryItem[];
  totalCount: number;
  currentPage: number;
  totalPages: number;
  pageSize: number;
  filters: CustomerReportFilterParams;
  onPageChange: (page: number) => void;
  onViewDetails: (customer: CustomerDirectoryItem) => void;
}

export const CustomersDirectoryTable: React.FC<CustomersDirectoryTableProps> = ({
  customers,
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
          Customer Directory
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
                <th className="py-3 px-5">CUSTOMER</th>
                <th className="py-3 px-4">EMAIL</th>
                <th className="py-3 px-3">BOOKINGS</th>
                <th className="py-3 px-3">COMPLETED</th>
                <th className="py-3 px-3">CANCELLED</th>
                <th className="py-3 px-4">TOTAL SPEND</th>
                <th className="py-3 px-4">AVG BOOKING</th>
                <th className="py-3 px-4">LAST ACTIVITY</th>
                <th className="py-3 px-3">STATUS</th>
                <th className="py-3 px-4">JOINED</th>
                <th className="py-3 px-4 text-right">ACTIONS</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/60">
              {customers.length === 0 ? (
                <tr>
                  <td colSpan={11} className="py-8 text-center text-muted-foreground">
                    No customers found matching the selected filters.
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr
                    key={customer.id}
                    className="hover:bg-muted/30 transition-colors group cursor-pointer"
                    onClick={() => onViewDetails(customer)}
                  >
                    {/* Customer with Avatar */}
                    <td className="py-3 px-5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 ${customer.avatarBg}`}
                        >
                          {customer.initial}
                        </div>
                        <span className="font-bold text-foreground hover:text-primary transition-colors whitespace-nowrap">
                          {customer.name}
                        </span>
                      </div>
                    </td>

                    {/* Email */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {customer.email}
                    </td>

                    {/* Bookings */}
                    <td className="py-3 px-3 font-semibold text-foreground">
                      {customer.bookings}
                    </td>

                    {/* Completed */}
                    <td className="py-3 px-3 font-bold text-secondary">
                      {customer.completed}
                    </td>

                    {/* Cancelled */}
                    <td className="py-3 px-3 font-medium text-muted-foreground">
                      {customer.cancelled}
                    </td>

                    {/* Total Spend */}
                    <td className="py-3 px-4 font-bold text-foreground whitespace-nowrap">
                      {customer.totalSpend}
                    </td>

                    {/* Avg Booking */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {customer.avgBooking}
                    </td>

                    {/* Last Activity */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {customer.lastActivity}
                    </td>

                    {/* Status */}
                    <td className="py-3 px-3">
                      <Badge
                        variant="outline"
                        className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${
                          customer.status === "Active"
                            ? "bg-secondary/10 text-secondary border-secondary/20"
                            : customer.status === "Pending"
                            ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                            : customer.status === "Suspended"
                            ? "bg-destructive/10 text-destructive border-destructive/20"
                            : "bg-muted text-muted-foreground border-border"
                        }`}
                      >
                        {customer.status}
                      </Badge>
                    </td>

                    {/* Joined Date */}
                    <td className="py-3 px-4 text-muted-foreground whitespace-nowrap">
                      {customer.joinedDate}
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
                            onClick={() => onViewDetails(customer)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <User className="w-3.5 h-3.5 text-primary" />
                            <span>View Profile</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewDetails(customer)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Calendar className="w-3.5 h-3.5 text-secondary" />
                            <span>View Bookings</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => onViewDetails(customer)}
                            className="text-xs cursor-pointer gap-2 py-2"
                          >
                            <Activity className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Activity</span>
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
            Showing <span className="font-semibold text-foreground">{startItem}-{endItem}</span> of{" "}
            <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span> customers
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
