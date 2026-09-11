"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Calendar, User, Sparkles, Receipt } from "lucide-react";
import type { BookingReportItem } from "../types/bookings.types";

interface BookingDetailsDialogProps {
  booking: BookingReportItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const BookingDetailsDialog: React.FC<BookingDetailsDialogProps> = ({
  booking,
  open,
  onOpenChange,
}) => {
  if (!booking) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Receipt className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Booking Details — {booking.bookingId}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Overview of booking request, assigned hosté, and transaction status
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main Amount Card */}
          <div className="bg-muted/40 border border-border/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Total Amount
              </span>
              <div className="text-2xl font-extrabold text-foreground mt-0.5">
                {booking.amount}
              </div>
            </div>

            <div className="text-right">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Booking Status
              </span>
              <div className="mt-0.5">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold bg-primary/10 text-primary border border-primary/20">
                  {booking.bookingStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-3">
            {/* Customer */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span>Customer / Client</span>
              </div>
              <div className="font-bold text-foreground">
                {booking.customerName}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {booking.customerType}
              </span>
            </div>

            {/* Hosté */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Assigned Hosté</span>
              </div>
              <div className="font-bold text-foreground">{booking.hosteName}</div>
              <span className="text-[10px] text-muted-foreground">
                {booking.hosteRole}
              </span>
            </div>

            {/* Event Date */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Event Date</span>
              </div>
              <div className="font-bold text-foreground">{booking.eventDate}</div>
            </div>

            {/* Payment Status */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Payment Status
              </span>
              <div className="font-bold text-foreground">
                {booking.paymentStatus}
              </div>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
