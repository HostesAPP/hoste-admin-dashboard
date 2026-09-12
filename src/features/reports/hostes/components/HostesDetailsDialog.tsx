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
import { Sparkles, Star, Calendar, ShieldCheck, Mail } from "lucide-react";
import type { HosteDirectoryItem } from "../types/hostes.types";

interface HostesDetailsDialogProps {
  hoste: HosteDirectoryItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const HostesDetailsDialog: React.FC<HostesDetailsDialogProps> = ({
  hoste,
  open,
  onOpenChange,
}) => {
  if (!hoste) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg rounded-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Hosté Profile Audit — {hoste.name}
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Detailed verification records, fulfillment efficiency, and earnings history
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main Earnings Card */}
          <div className="bg-muted/40 border border-border/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Lifetime Earnings
              </span>
              <div className="text-2xl font-extrabold text-foreground mt-0.5">
                {hoste.totalEarnings}
              </div>
            </div>

            <div className="text-right space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Account Status
              </span>
              <div>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-bold bg-secondary/15 text-secondary border border-secondary/30">
                  {hoste.accountStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Grid Information */}
          <div className="grid grid-cols-2 gap-3">
            {/* Email & Contact */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address</span>
              </div>
              <div className="font-bold text-foreground truncate">{hoste.email}</div>
            </div>

            {/* Verification Status */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>KYC Verification</span>
              </div>
              <div className="font-bold text-secondary">{hoste.verification}</div>
            </div>

            {/* Performance Stats */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Bookings (Total / Done / Cancelled)
              </span>
              <div className="font-bold text-foreground">
                {hoste.bookings.total} / {hoste.bookings.completed} / {hoste.bookings.cancelled}
              </div>
              <span className="text-[10px] text-secondary font-bold">
                {hoste.completionRate} Completion Rate
              </span>
            </div>

            {/* Rating & Joined */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Member Since</span>
              </div>
              <div className="font-bold text-foreground">{hoste.joinedDate}</div>
              <div className="flex items-center gap-1 text-[10px] font-bold text-foreground">
                <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                <span>{hoste.rating.toFixed(2)} / 5.00 Rating</span>
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
