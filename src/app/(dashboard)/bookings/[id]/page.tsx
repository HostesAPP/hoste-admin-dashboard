"use client";

import React, { use } from "react";
import Link from "next/link";
import {
  ChevronLeft,
  Calendar,
  User,
  Building,
  CreditCard,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  FileText,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useBookings } from "@/features/bookings/hooks/useBookings";
import { BookingStatus } from "@/features/bookings/bookings.types";

export default function BookingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const resolvedParams = use(params);
  const { getBookingById, updateBookingStatus } = useBookings();
  const booking = getBookingById(resolvedParams.id);

  if (!booking) {
    return (
      <div className="p-6 max-w-4xl mx-auto space-y-4 text-center py-20">
        <h2 className="text-xl font-bold text-foreground">Booking Not Found</h2>
        <p className="text-xs text-muted-foreground">
          The booking ID standard &quot;{resolvedParams.id}&quot; does not exist or has been removed.
        </p>
        <Link href="/bookings">
          <Button variant="outline" className="text-xs rounded-xl">
            Return to Bookings
          </Button>
        </Link>
      </div>
    );
  }

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
    <div className="p-6 space-y-6 max-w-5xl mx-auto">
      {/* Back Link & Actions Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground transition-colors"
          >
            <ChevronLeft className="w-3.5 h-3.5" />
            <span>Back to Bookings</span>
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-foreground">
              Booking {booking.bookingCode}
            </h1>
            {getStatusBadge(booking.status)}
          </div>
        </div>

        <div className="flex items-center gap-2">
          {booking.status !== "Cancelled" && (
            <Button
              variant="outline"
              onClick={() => updateBookingStatus(booking.id, "Cancelled", "Admin initiated cancellation")}
              className="text-xs font-semibold rounded-xl border-destructive/60 text-destructive hover:bg-destructive/5"
            >
              Cancel Booking
            </Button>
          )}
          {booking.status !== "Completed" && (
            <Button
              onClick={() => updateBookingStatus(booking.id, "Completed")}
              className="text-xs font-semibold rounded-xl bg-primary text-primary-foreground hover:bg-primary/90"
            >
              Mark as Completed
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column - Event Details & Parties */}
        <div className="md:col-span-2 space-y-6">
          {/* Event Card */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              <span>Event Details</span>
            </h3>

            <div className="grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-muted-foreground block text-[11px]">Event Name</span>
                <span className="font-semibold text-foreground text-sm">{booking.eventName}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Category</span>
                <span className="font-semibold text-foreground">{booking.eventCategory}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Event Date</span>
                <span className="font-semibold text-foreground">{booking.eventDate}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Location</span>
                <span className="font-semibold text-foreground">{booking.location}</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Expected Guests</span>
                <span className="font-semibold text-foreground">{booking.guestCount} guests</span>
              </div>
              <div>
                <span className="text-muted-foreground block text-[11px]">Created Date</span>
                <span className="font-semibold text-foreground">{booking.createdAt}</span>
              </div>
            </div>

            {booking.specialRequests && (
              <div className="pt-2">
                <span className="text-muted-foreground block text-[11px] mb-1">Special Requests</span>
                <div className="p-3 bg-muted/30 border border-border/60 rounded-xl text-xs text-foreground">
                  {booking.specialRequests}
                </div>
              </div>
            )}
          </div>

          {/* Parties Involved */}
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <User className="w-4 h-4 text-primary" />
              <span>Parties Involved</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-xs">
              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Customer
                </span>
                <div className="font-bold text-foreground text-sm">{booking.customerName}</div>
                <div className="text-muted-foreground">{booking.customerEmail}</div>
              </div>

              <div className="p-4 bg-muted/20 border border-border/60 rounded-xl space-y-2">
                <span className="text-[11px] font-bold text-muted-foreground uppercase tracking-wider block">
                  Host / Agency
                </span>
                <div className="font-bold text-foreground text-sm">{booking.hostName}</div>
                {booking.brandName && (
                  <div className="text-muted-foreground font-medium">{booking.brandName}</div>
                )}
              </div>
            </div>
          </div>

          {/* Cancellation or Dispute Box */}
          {(booking.cancellationReason || booking.disputeReason) && (
            <div className="bg-destructive/5 border border-destructive/20 rounded-2xl p-5 space-y-2 text-xs">
              <div className="flex items-center gap-2 text-destructive font-bold text-sm">
                <AlertTriangle className="w-4 h-4" />
                <span>
                  {booking.cancellationReason ? "Cancellation Notice" : "Dispute Details"}
                </span>
              </div>
              <p className="text-foreground">
                {booking.cancellationReason || booking.disputeReason}
              </p>
              {booking.disputeNotes && (
                <p className="text-muted-foreground italic pt-1">{booking.disputeNotes}</p>
              )}
            </div>
          )}
        </div>

        {/* Right Column - Payment & Payout Info */}
        <div className="space-y-6">
          <div className="bg-card border border-border/80 rounded-2xl p-6 space-y-4 shadow-2xs">
            <h3 className="text-sm font-bold text-foreground border-b border-border/60 pb-3 flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-primary" />
              <span>Payment Summary</span>
            </h3>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Booking Fee</span>
                <span className="font-bold text-foreground text-sm">
                  ₦{booking.totalAmount.toLocaleString()}
                </span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Payment Status</span>
                <span className="font-semibold text-emerald-600">{booking.paymentStatus}</span>
              </div>

              <div className="flex justify-between items-center py-1 border-b border-border/40">
                <span className="text-muted-foreground">Host Payout Status</span>
                <span className="font-semibold text-foreground">{booking.payoutStatus}</span>
              </div>

              <div className="flex justify-between items-center py-1">
                <span className="text-muted-foreground">Platform Commission (10%)</span>
                <span className="font-semibold text-foreground">
                  ₦{(booking.totalAmount * 0.1).toLocaleString()}
                </span>
              </div>
            </div>

            <div className="pt-2">
              <Link href="/payments">
                <Button variant="outline" className="w-full text-xs font-semibold rounded-xl">
                  View Payment Records
                </Button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
