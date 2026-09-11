"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Building2,
  Calendar,
  CheckCircle2,
  XCircle,
  CreditCard,
  TrendingUp,
  Download,
} from "lucide-react";
import type { BrandDirectoryItem } from "../types/brand-users.types";

interface BrandUserDetailsDialogProps {
  brand: BrandDirectoryItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function BrandUserDetailsDialog({
  brand,
  isOpen,
  onOpenChange,
}: BrandUserDetailsDialogProps) {
  if (!brand) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-foreground">
              Brand Account Profile
            </DialogTitle>
            <Badge
              variant="outline"
              className={
                brand.status === "Active"
                  ? "bg-secondary/10 text-secondary border-secondary/20"
                  : brand.status === "Pending"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : brand.status === "Suspended"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted text-muted-foreground"
              }
            >
              {brand.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Account details, performance metrics, and lifetime booking summary
          </DialogDescription>
        </DialogHeader>

        {/* Brand identity header */}
        <div className="flex items-center gap-3.5 p-4 rounded-xl bg-muted/20 border border-border mt-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base ${brand.avatarColor}`}
          >
            {brand.initial}
          </div>
          <div>
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5">
              <Building2 className="w-4 h-4 text-primary" />
              {brand.name}
            </h4>
            <p className="text-xs text-muted-foreground mt-0.5">{brand.email}</p>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground mt-1">
              <Calendar className="w-3 h-3" />
              Member since {brand.joinedDate}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-4">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Total Bookings
            </div>
            <p className="text-xl font-bold text-foreground">
              {brand.totalBookings}
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-0.5 text-secondary">
                <CheckCircle2 className="w-3 h-3" /> {brand.completed}
              </span>
              <span className="flex items-center gap-0.5 text-destructive">
                <XCircle className="w-3 h-3" /> {brand.cancelled}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5 text-secondary" />
              Total Spend
            </div>
            <p className="text-xl font-bold text-foreground">{brand.totalSpend}</p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Avg: {brand.avgBookingValue}
            </p>
          </div>
        </div>

        <DialogFooter className="flex items-center justify-between sm:justify-between gap-2 mt-4 pt-2 border-t border-border">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onOpenChange(false)}
            className="text-xs"
          >
            Close
          </Button>
          <Button
            size="sm"
            className="bg-primary text-primary-foreground text-xs gap-1.5"
          >
            <Download className="w-3.5 h-3.5" />
            Export Brand Statement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
