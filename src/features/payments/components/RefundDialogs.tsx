"use client";
import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  CheckCircle2,
  Clock3,
  CreditCard,
  Download,
  ImageIcon,
  Loader2,
  ReceiptText,
  ShieldCheck,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatPaymentAmount, PAYMENT_METHOD_LABELS } from "./PaymentTable";
import { RefundReceiptViewer } from "./RefundReceiptViewer";
import type {
  RefundContext,
  RefundDraft,
  RefundQuote,
  RefundReceipt,
} from "../types/transactions.types";

export function RefundReviewDialog({
  context,
  draft,
  quote,
  busy,
  error,
  onClose,
  onConfirm,
}: {
  context: RefundContext;
  draft: RefundDraft;
  quote: RefundQuote;
  busy: boolean;
  error: string;
  onClose: () => void;
  onConfirm: () => Promise<void>;
}) {
  const { booking, transaction } = context;
  const { payment } = transaction;
  const [imageFailed, setImageFailed] = useState(false);
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !busy) onClose();
      }}
    >
      <DialogContent
        showCloseButton={!busy}
        className="max-h-[90vh] overflow-y-auto sm:max-w-[940px] tracking-normal"
      >
        <DialogHeader>
          <DialogTitle className="text-lg font-bold">Review Refund</DialogTitle>
          <DialogDescription>
            Please review the details below before confirming this refund.
          </DialogDescription>
        </DialogHeader>
        <div className="grid grid-cols-[minmax(0,1.6fr)_minmax(0,1fr)] gap-4">
          <div className="space-y-3">
            <section className="border border-border p-4">
              <h2 className="mb-3 text-xs font-bold">1. Booking Information</h2>
              {booking ? (
                <div className="flex gap-3">
                  <div className="flex size-16 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                    {imageFailed || !booking.imageUrl ? (
                      <ImageIcon className="size-5" />
                    ) : (
                      <Image
                        unoptimized
                        src={booking.imageUrl}
                        width={64}
                        height={64}
                        alt={booking.title}
                        className="size-16 object-cover"
                        onError={() => setImageFailed(true)}
                      />
                    )}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold">{booking.title}</p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {new Date(booking.date).toLocaleString("en-US", {
                        dateStyle: "medium",
                        ...(booking.date.includes("T") ? { timeStyle: "short" as const } : {}),
                        timeZone: "UTC",
                      })}{" "}
                      {booking.date.includes("T") ? "UTC" : ""}
                    </p>
                    <p className="mt-1 text-[11px] text-muted-foreground">
                      {booking.location}{booking.hostCount !== null ? ` · ${booking.hostCount} Hostés` : ""}
                    </p>
                    <div className="mt-3 grid grid-cols-2 gap-3">
                      <Detail label="Booking ID" value={booking.reference} />
                      <Detail
                        label="Customer"
                        value={payment.payerProfileName}
                      />
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-muted-foreground">
                  No booking linked to this payment.
                </p>
              )}
            </section>
            <section className="border border-border p-4">
              <h2 className="mb-3 text-xs font-bold">2. Payment Information</h2>
              <div className="grid grid-cols-2 gap-4">
                <Detail label="Payment ID" value={payment.referenceId} />
                <Detail
                  label="Payment Date"
                  value={
                    new Date(payment.createdAt).toLocaleString("en-US", {
                      dateStyle: "medium",
                      timeStyle: "short",
                      timeZone: "UTC",
                    }) + " UTC"
                  }
                />
                <Detail
                  label="Payment Method"
                  value={PAYMENT_METHOD_LABELS[transaction.method]}
                />
                <Detail label="Payment Status" value={payment.status} />
              </div>
              <p className="mt-4 text-[11px] text-muted-foreground">
                Original Amount Paid
              </p>
              <p className="mt-1 font-bold text-secondary">
                {formatPaymentAmount(payment.grossAmount)}
              </p>
            </section>
            <section className="border border-border p-4">
              <h2 className="mb-3 text-xs font-bold">3. Refund Details</h2>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-4">
                  <Detail
                    label="Refund Amount"
                    value={formatPaymentAmount(quote.amount)}
                  />
                  <Detail
                    label="Refund Reason"
                    value={
                      context.reasons.find(
                        (reason) => reason.value === draft.reason,
                      )?.label ?? draft.reason
                    }
                  />
                  <Detail
                    label="Refund Description"
                    value={draft.description || "No admin note"}
                  />
                </div>
                <div>
                  <p className="text-[11px] text-muted-foreground">Refund To</p>
                  <div className="mt-2 flex gap-2 rounded-md border border-border p-3 text-xs font-semibold">
                    <CreditCard className="size-4 shrink-0" />
                    <div>
                      {draft.destination}
                      <p className="mt-1 text-[11px] font-normal text-muted-foreground">
                        {PAYMENT_METHOD_LABELS[transaction.method]}
                      </p>
                    </div>
                  </div>
                  <p className="mt-3 text-[11px] leading-5 text-muted-foreground">
                    The refund will be sent to the customer&apos;s original
                    payment method.
                  </p>
                </div>
              </div>
            </section>
          </div>
          <aside className="space-y-5 bg-muted/30 p-4">
            <h2 className="flex items-center gap-2 text-xs font-bold">
              <ReceiptText className="size-4 text-secondary" />
              Refund Summary
            </h2>
            <dl className="space-y-4 text-xs">
              <Row
                label="Amount Paid"
                value={formatPaymentAmount(payment.grossAmount)}
              />
              <Row
                label="Refund Amount"
                value={formatPaymentAmount(quote.amount)}
              />
              <Row
                label="Processing Fee"
                value={formatPaymentAmount(quote.processingFee)}
              />
              <div className="border-t border-border pt-4">
                <Row
                  label="Total Refund"
                  value={formatPaymentAmount(quote.totalRefund)}
                  total
                />
              </div>
            </dl>
            <div className="flex gap-2 rounded-md border border-secondary/20 bg-secondary/5 p-3 text-secondary">
              <ShieldCheck className="size-5 shrink-0" />
              <div>
                <p className="text-xs font-bold">Before you continue</p>
                <p className="mt-1 text-[11px] leading-5">
                  This refund uses the original payment method. Live refunds may
                  not be reversible once confirmed.
                </p>
              </div>
            </div>
            <div className="flex gap-2 rounded-md border border-yellow/20 bg-yellow/5 p-3">
              <Clock3 className="size-4 shrink-0 text-primary" />
              <p className="text-[11px] leading-5 text-muted-foreground">
                {context.policy}
              </p>
            </div>
          </aside>
        </div>
        {error && (
          <p role="alert" className="text-xs text-destructive">
            {error}
          </p>
        )}
        <footer className="flex items-center justify-between gap-3 border-t border-border pt-4">
          <Button variant="outline" disabled={busy} onClick={onClose}>
            <ArrowLeft className="size-3.5" />
            Back to Edit
          </Button>
          <div className="flex gap-3">
            <Button variant="outline" disabled={busy} onClick={onClose}>
              Cancel
            </Button>
            <Button disabled={busy} onClick={() => void onConfirm()}>
              {busy ? (
                <Loader2 className="size-4 animate-spin" />
              ) : (
                <Check className="size-4" />
              )}
              Confirm Refund
            </Button>
          </div>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
export function RefundReceiptDialog({
  receipt,
  message,
  onClose,
}: {
  receipt: RefundReceipt;
  message: string;
  onClose: () => void;
}) {
  const [viewingReceipt, setViewingReceipt] = useState(false);
  if (viewingReceipt)
    return (
      <RefundReceiptViewer
        receipt={receipt}
        onClose={() => setViewingReceipt(false)}
      />
    );
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent className="sm:max-w-[500px] tracking-normal">
        <DialogHeader className="items-center text-center">
          <div className="flex size-16 items-center justify-center rounded-full bg-secondary/10">
            <CheckCircle2 className="size-10 text-secondary" />
          </div>
          <DialogTitle className="mt-2 text-lg font-bold">
            Refund Reviewed Successfully
          </DialogTitle>
          <DialogDescription className="text-xs">{message}</DialogDescription>
        </DialogHeader>
        <section className="rounded-md border border-border p-5">
          <p className="text-center text-[10px] font-semibold uppercase text-muted-foreground">
            Total Refund (Preview)
          </p>
          <p className="mt-1 text-center text-2xl font-bold text-secondary">
            {formatPaymentAmount(receipt.totalRefund)}
          </p>
          <dl className="mt-5 space-y-3 border-t border-border pt-4 text-xs">
            <Row label="Refund Reference" value={receipt.reference} />
            <Row label="Customer" value={receipt.customer} />
            <Row
              label="Payment Method"
              value={`${PAYMENT_METHOD_LABELS[receipt.method]} (Original Method)`}
            />
            <Row label="Delivery" value={receipt.delivery} />
          </dl>
        </section>
        <footer className="grid grid-cols-2 gap-3">
          <Button variant="outline" onClick={() => setViewingReceipt(true)}>
            <Download className="size-4" />
            Download Receipt
          </Button>
          <Button
            className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
            nativeButton={false}
            render={<Link href="/payments" />}
          >
            Done
          </Button>
        </footer>
      </DialogContent>
    </Dialog>
  );
}
function Detail({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] text-muted-foreground">{label}</p>
      <p className="mt-1 break-words text-xs font-semibold">{value}</p>
    </div>
  );
}
function Row({
  label,
  value,
  total = false,
}: {
  label: string;
  value: string;
  total?: boolean;
}) {
  return (
    <div className="flex justify-between gap-3">
      <dt className={total ? "font-bold" : "text-muted-foreground"}>{label}</dt>
      <dd
        className={`max-w-[65%] break-words text-right font-bold ${total ? "text-lg text-secondary" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
