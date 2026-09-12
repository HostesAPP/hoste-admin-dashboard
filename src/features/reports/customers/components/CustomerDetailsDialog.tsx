"use client";

import React from "react";
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
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  CreditCard,
  TrendingUp,
  Download,
  Mail,
  Phone,
  MapPin,
  ShieldCheck,
} from "lucide-react";
import type { CustomerDirectoryItem } from "../types/customers.types";

interface CustomerDetailsDialogProps {
  customer: CustomerDirectoryItem | null;
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}

export function CustomerDetailsDialog({
  customer,
  isOpen,
  onOpenChange,
}: CustomerDetailsDialogProps) {
  if (!customer) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md rounded-2xl p-6">
        <DialogHeader className="space-y-1">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-bold text-foreground">
              Customer Profile
            </DialogTitle>
            <Badge
              variant="outline"
              className={`text-xs px-2.5 py-0.5 rounded-full ${
                customer.status === "Active"
                  ? "bg-secondary/10 text-secondary border-secondary/20"
                  : customer.status === "Pending"
                  ? "bg-amber-500/10 text-amber-600 border-amber-500/20"
                  : customer.status === "Suspended"
                  ? "bg-destructive/10 text-destructive border-destructive/20"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {customer.status}
            </Badge>
          </div>
          <DialogDescription className="text-xs text-muted-foreground">
            Customer overview, venue booking history, and platform metrics
          </DialogDescription>
        </DialogHeader>

        {/* Customer Header Card */}
        <div className="flex items-start gap-3.5 p-4 rounded-xl bg-muted/20 border border-border mt-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center font-bold text-base shrink-0 ${customer.avatarBg}`}
          >
            {customer.initial}
          </div>
          <div className="space-y-1 min-w-0 flex-1">
            <h4 className="font-bold text-foreground text-sm flex items-center gap-1.5 truncate">
              <User className="w-4 h-4 text-primary shrink-0" />
              {customer.name}
            </h4>
            {customer.tier && (
              <p className="text-xs text-primary font-medium flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5" />
                {customer.tier}
              </p>
            )}
            <div className="space-y-0.5 pt-1 text-xs text-muted-foreground">
              <p className="flex items-center gap-1.5">
                <Mail className="w-3 h-3 text-muted-foreground" />
                {customer.email}
              </p>
              {customer.phone && (
                <p className="flex items-center gap-1.5">
                  <Phone className="w-3 h-3 text-muted-foreground" />
                  {customer.phone}
                </p>
              )}
              {customer.city && (
                <p className="flex items-center gap-1.5">
                  <MapPin className="w-3 h-3 text-muted-foreground" />
                  {customer.city}
                </p>
              )}
            </div>
            <div className="flex items-center gap-1 text-[11px] text-muted-foreground pt-1">
              <Calendar className="w-3 h-3" />
              Member since {customer.joinedDate}
            </div>
          </div>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-2 gap-3 mt-3">
          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <TrendingUp className="w-3.5 h-3.5 text-primary" />
              Bookings History
            </div>
            <p className="text-xl font-bold text-foreground">
              {customer.bookings}{" "}
              <span className="text-xs font-normal text-muted-foreground">
                total
              </span>
            </p>
            <div className="flex items-center gap-2 text-[11px] text-muted-foreground pt-1">
              <span className="flex items-center gap-0.5 text-secondary font-medium">
                <CheckCircle2 className="w-3 h-3" /> {customer.completed} completed
              </span>
              <span className="flex items-center gap-0.5 text-destructive font-medium">
                <XCircle className="w-3 h-3" /> {customer.cancelled}
              </span>
            </div>
          </div>

          <div className="p-3.5 rounded-xl border border-border/60 bg-muted/10 space-y-1">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <CreditCard className="w-3.5 h-3.5 text-secondary" />
              Total Spending
            </div>
            <p className="text-xl font-bold text-foreground">{customer.totalSpend}</p>
            <p className="text-[11px] text-muted-foreground pt-1">
              Avg: <span className="font-semibold text-foreground">{customer.avgBooking}</span>
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
            Export Statement
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
