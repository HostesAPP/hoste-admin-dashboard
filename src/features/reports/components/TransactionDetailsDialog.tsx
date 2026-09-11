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
import { Receipt, CreditCard, Calendar, User } from "lucide-react";
import type { ReportTransaction } from "../types/reports.types";

interface TransactionDetailsDialogProps {
  transaction: ReportTransaction | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const TransactionDetailsDialog: React.FC<TransactionDetailsDialogProps> = ({
  transaction,
  open,
  onOpenChange,
}) => {
  if (!transaction) return null;

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
                Transaction Details
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Detailed financial receipt and transaction breakdown
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Main Amount Overview Card */}
          <div className="bg-muted/40 border border-border/80 rounded-xl p-4 flex items-center justify-between">
            <div>
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Gross Amount
              </span>
              <div className="text-2xl font-extrabold text-foreground mt-0.5">
                {transaction.amount}
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] font-semibold text-muted-foreground uppercase">
                Status
              </span>
              <div className="mt-0.5 font-bold">
                <span
                  className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs ${
                    transaction.status === "Successful"
                      ? "bg-secondary/15 text-secondary"
                      : transaction.status === "Pending"
                      ? "bg-amber-500/15 text-amber-500"
                      : transaction.status === "Refunded"
                      ? "bg-primary/15 text-primary"
                      : "bg-destructive/15 text-destructive"
                  }`}
                >
                  <span
                    className={`w-1.5 h-1.5 rounded-full ${
                      transaction.status === "Successful"
                        ? "bg-secondary"
                        : transaction.status === "Pending"
                        ? "bg-amber-500"
                        : transaction.status === "Refunded"
                        ? "bg-primary"
                        : "bg-destructive"
                    }`}
                  />
                  {transaction.status}
                </span>
              </div>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-3">
            {/* Transaction ID */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Transaction ID
              </span>
              <div className="font-bold text-foreground">{transaction.txnId}</div>
            </div>

            {/* Date */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <Calendar className="w-3.5 h-3.5" />
                <span>Date</span>
              </div>
              <div className="font-bold text-foreground">{transaction.date}</div>
            </div>

            {/* Customer / Brand */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <User className="w-3.5 h-3.5" />
                <span>Customer / Brand</span>
              </div>
              <div className="font-bold text-foreground">
                {transaction.customerName}
              </div>
              <span className="text-[10px] text-muted-foreground">
                {transaction.customerType}
              </span>
            </div>

            {/* Payment Method */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <div className="flex items-center gap-1.5 text-[11px] font-semibold text-muted-foreground">
                <CreditCard className="w-3.5 h-3.5" />
                <span>Payment Method</span>
              </div>
              <div className="font-bold text-foreground">
                {transaction.paymentMethod}
              </div>
            </div>

            {/* Booking Ref */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Booking Reference
              </span>
              <div className="font-bold text-foreground flex items-center gap-1">
                <span>{transaction.bookingId}</span>
                <span className="text-[10px] text-muted-foreground">
                  ({transaction.bookingType})
                </span>
              </div>
            </div>

            {/* Hosté Commission */}
            <div className="p-3 bg-card border border-border/70 rounded-xl space-y-1">
              <span className="text-[11px] font-semibold text-muted-foreground">
                Hosté Commission (15%)
              </span>
              <div className="font-bold text-secondary">
                {transaction.status === "Successful"
                  ? transaction.commission
                  : transaction.isReversed
                  ? "₦0 (Reversed)"
                  : "₦0"}
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
