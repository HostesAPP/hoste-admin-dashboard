"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Calendar,
  Search,
  Filter,
  Eye,
  CheckCircle2,
  Clock,
  AlertTriangle,
  XCircle,
  TrendingUp,
  CreditCard,
  ChevronRight,
  MoreVertical,
  ChevronLeft,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { BookingStatus } from "@/features/bookings/bookings.types";

export default function BookingsPage() {
  const { bookings, kpis, filters, setFilters, updateBookingStatus } = useBookings();
  const [activeTab, setActiveTab] = useState<string>("All");

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFilters({
      ...filters,
      status: tab === "All" ? "All" : (tab as BookingStatus),
    });
  };

  const getStatusBadge = (status: BookingStatus) => {
    switch (status) {
      case "Confirmed":
        return <Badge className="bg-emerald-500/10 text-emerald-600 border-emerald-200">Confirmed</Badge>;
      case "Ongoing":
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-200">Ongoing</Badge>;
      case "Completed":
        return <Badge className="bg-primary/10 text-primary border-primary/20">Completed</Badge>;
      case "Pending":
        return <Badge className="bg-amber-500/10 text-amber-600 border-amber-200">Pending</Badge>;
      case "Cancelled":
        return <Badge className="bg-muted text-muted-foreground border-border">Cancelled</Badge>;
      case "Disputed":
        return <Badge className="bg-destructive/10 text-destructive border-destructive/20">Disputed</Badge>;
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="p-6 space-y-6 max-w-[1600px] mx-auto">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-foreground">
            Bookings Management
          </h1>
          <p className="text-xs text-muted-foreground mt-1">
            Overview of all customer bookings, schedules, payment states, and status workflows.
          </p>
        </div>
      </div>

      {/* KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Total Bookings</span>
            <Calendar className="w-4 h-4 text-primary" />
          </div>
          <div className="text-2xl font-bold text-foreground">{kpis.totalBookings}</div>
          <div className="text-[11px] text-muted-foreground">
            Revenue: <span className="font-semibold text-foreground">₦{(kpis.totalRevenue / 1000000).toFixed(1)}M</span>
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Active & Confirmed</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {kpis.confirmedBookings + kpis.ongoingBookings}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {kpis.ongoingBookings} currently ongoing
          </div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Completed</span>
            <TrendingUp className="w-4 h-4 text-blue-500" />
          </div>
          <div className="text-2xl font-bold text-foreground">{kpis.completedBookings}</div>
          <div className="text-[11px] text-muted-foreground">Successful events</div>
        </div>

        <div className="bg-card border border-border/80 rounded-2xl p-4 space-y-2 shadow-2xs">
          <div className="flex items-center justify-between text-muted-foreground">
            <span className="text-xs font-semibold">Disputed / Cancelled</span>
            <AlertTriangle className="w-4 h-4 text-destructive" />
          </div>
          <div className="text-2xl font-bold text-foreground">
            {kpis.disputedBookings + kpis.cancelledBookings}
          </div>
          <div className="text-[11px] text-muted-foreground">
            {kpis.disputedBookings} open disputes
          </div>
        </div>
      </div>

      {/* Main Table Card */}
      <div className="bg-card border border-border/80 rounded-2xl shadow-2xs space-y-4 p-5">
        {/* Status Filter Tabs */}
        <div className="flex items-center gap-2 border-b border-border/60 pb-3 overflow-x-auto">
          {["All", "Pending", "Confirmed", "Ongoing", "Completed", "Cancelled", "Disputed"].map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabChange(tab)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-colors cursor-pointer whitespace-nowrap ${
                activeTab === tab
                  ? "bg-primary text-primary-foreground shadow-2xs"
                  : "text-muted-foreground hover:bg-muted/50 hover:text-foreground"
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Search & Date Controls */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" />
            <Input
              placeholder="Search booking ID, customer, host, event..."
              value={filters.search || ""}
              onChange={(e) => setFilters({ ...filters, search: e.target.value })}
              className="pl-9 h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <Input
              type="date"
              value={filters.startDate || ""}
              onChange={(e) => setFilters({ ...filters, startDate: e.target.value })}
              className="h-9 rounded-xl text-xs bg-background border-border/80"
            />
            <span className="text-xs text-muted-foreground">to</span>
            <Input
              type="date"
              value={filters.endDate || ""}
              onChange={(e) => setFilters({ ...filters, endDate: e.target.value })}
              className="h-9 rounded-xl text-xs bg-background border-border/80"
            />
          </div>
        </div>

        {/* Bookings Table */}
        <div className="rounded-xl border border-border/80 overflow-hidden">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow>
                <TableHead className="text-xs font-bold text-foreground">Booking Code</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Customer</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Host / Brand</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Event & Date</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Total Amount</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Status</TableHead>
                <TableHead className="text-xs font-bold text-foreground">Payment</TableHead>
                <TableHead className="text-xs font-bold text-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {bookings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={8} className="text-center py-10 text-xs text-muted-foreground">
                    No bookings found matching your filters.
                  </TableCell>
                </TableRow>
              ) : (
                bookings.map((booking) => (
                  <TableRow key={booking.id} className="hover:bg-muted/20 transition-colors">
                    <TableCell className="font-bold text-xs text-primary">
                      <Link href={`/bookings/${booking.id}`} className="hover:underline">
                        {booking.bookingCode}
                      </Link>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{booking.customerName}</span>
                        <span className="text-[10px] text-muted-foreground">{booking.customerEmail}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{booking.hostName}</span>
                        {booking.brandName && (
                          <span className="text-[10px] text-muted-foreground">{booking.brandName}</span>
                        )}
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-xs font-semibold text-foreground">{booking.eventName}</span>
                        <span className="text-[10px] text-muted-foreground">{booking.eventDate} ({booking.location})</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs font-bold text-foreground">
                      ₦{booking.totalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell>{getStatusBadge(booking.status)}</TableCell>
                    <TableCell>
                      <span
                        className={`text-xs font-semibold ${
                          booking.paymentStatus === "Paid"
                            ? "text-emerald-600"
                            : booking.paymentStatus === "Refunded"
                            ? "text-muted-foreground"
                            : "text-amber-600"
                        }`}
                      >
                        {booking.paymentStatus}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          type="button"
                          className="p-1 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                        >
                          <MoreVertical className="w-4 h-4" />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end" className="rounded-xl border-border">
                          <DropdownMenuItem onClick={() => window.location.href = `/bookings/${booking.id}`}>
                            <Eye className="w-3.5 h-3.5 text-muted-foreground" />
                            <span>View Details</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Confirmed")}>
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
                            <span>Mark Confirmed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Completed")}>
                            <TrendingUp className="w-3.5 h-3.5 text-blue-500" />
                            <span>Mark Completed</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Disputed", "Disputed by admin action")}>
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-500" />
                            <span>Flag Dispute</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem onClick={() => updateBookingStatus(booking.id, "Cancelled", "Cancelled by admin")}>
                            <XCircle className="w-3.5 h-3.5 text-destructive" />
                            <span>Cancel Booking</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </div>
  );
}
