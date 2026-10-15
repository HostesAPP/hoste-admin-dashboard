"use client";
import { useState } from "react";
import { ArrowLeft, Download, FileText, Loader2, Printer } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  downloadRefundReceipt,
  printRefundReceipt,
  receiptDate,
  receiptFilename,
  receiptMoney,
  receiptRows,
} from "../refund.receipt";
import type { RefundReceipt } from "../types/transactions.types";

export function RefundReceiptViewer({
  receipt,
  onClose,
}: {
  receipt: RefundReceipt;
  onClose: () => void;
}) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open && !saving) onClose();
      }}
    >
      <DialogContent
        showCloseButton={false}
        className="flex h-[90vh] max-h-[90vh] flex-col gap-0 overflow-hidden p-0 tracking-normal sm:max-w-[900px]"
      >
        <DialogTitle className="sr-only">Refund Receipt</DialogTitle>
        <DialogDescription className="sr-only">
          Preview refund receipt with printing and PDF download.
        </DialogDescription>
        <header className="flex shrink-0 items-center justify-between gap-4 border-b border-border bg-card px-4 py-3">
          <div className="flex min-w-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-7 shrink-0"
              aria-label="Back to refund confirmation"
              title="Back to confirmation"
              disabled={saving}
              onClick={onClose}
            >
              <ArrowLeft className="size-4" />
            </Button>
            <FileText className="size-4 shrink-0 text-primary" />
            <span
              className="truncate text-xs font-semibold"
              title={receiptFilename(receipt)}
            >
              {receiptFilename(receipt)}
            </span>
          </div>
          <div className="flex shrink-0 items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              title="Print receipt"
              aria-label="Print receipt"
              onClick={() => {
                setError("");
                try {
                  printRefundReceipt(receipt, () =>
                    setError(
                      "Unable to print the receipt. Please use Save PDF.",
                    ),
                  );
                } catch {
                  setError("Unable to print the receipt. Please use Save PDF.");
                }
              }}
            >
              <Printer className="size-4" />
            </Button>
            <Button
              size="sm"
              disabled={saving}
              className="bg-secondary text-secondary-foreground hover:bg-secondary/90"
              onClick={async () => {
                setSaving(true);
                setError("");
                try {
                  await downloadRefundReceipt(receipt);
                } catch (cause) {
                  setError(
                    cause instanceof Error
                      ? cause.message
                      : "Unable to save the PDF receipt.",
                  );
                } finally {
                  setSaving(false);
                }
              }}
            >
              {saving ? (
                <Loader2 className="size-3.5 animate-spin" />
              ) : (
                <Download className="size-3.5" />
              )}
              Save PDF
            </Button>
          </div>
        </header>
        {error && (
          <p
            role="alert"
            className="shrink-0 bg-destructive/10 px-4 py-3 text-xs text-destructive"
          >
            {error}
          </p>
        )}
        <div className="flex-1 overflow-y-auto bg-muted/60 p-8">
          <RefundReceiptDocument receipt={receipt} />
        </div>
      </DialogContent>
    </Dialog>
  );
}
function RefundReceiptDocument({ receipt }: { receipt: RefundReceipt }) {
  const booking = receipt.booking;
  return (
    <article
      aria-label="Refund receipt document"
      className="mx-auto min-h-[990px] w-full max-w-[700px] bg-card px-10 py-10 text-xs shadow-sm"
    >
      <header className="flex items-center justify-between gap-4 border-b border-border pb-6">
        <div className="flex items-center gap-3">
          <div className="flex size-10 shrink-0 items-center justify-center rounded-md bg-primary/5 text-[9px] font-bold text-primary">
            HOSTÉ
          </div>
          <span className="text-lg font-bold">HOSTÉ</span>
          <span className="text-[10px] text-muted-foreground">
            Admin Console
          </span>
        </div>
        <div className="text-right">
          <h1 className="text-lg font-bold">REFUND RECEIPT</h1>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Preview - Not proof of a transaction
          </p>
        </div>
      </header>
      <div className="my-6 grid grid-cols-2 gap-8">
        <div>
          <p className="text-[10px] text-muted-foreground">Issued To</p>
          <p className="mt-1 break-words font-bold">{receipt.customer}</p>
          {receipt.customerEmail && (
            <p className="mt-1 break-all text-[10px] text-muted-foreground">
              Email: {receipt.customerEmail}
            </p>
          )}
        </div>
        <dl className="space-y-2 text-[10px]">
          <ReceiptDetail label="Receipt Number" value={receipt.reference} />
          <ReceiptDetail
            label="Date Issued"
            value={receiptDate(receipt.createdAt)}
          />
          <ReceiptDetail label="Payment ID" value={receipt.paymentReference} />
          <div className="flex justify-between gap-4">
            <dt className="text-muted-foreground">Status</dt>
            <dd className="rounded-full bg-secondary/10 px-3 py-0.5 font-bold text-secondary">
              PREVIEW
            </dd>
          </div>
        </dl>
      </div>
      {booking && (
        <dl className="my-6 grid grid-cols-[130px_minmax(0,1fr)] gap-2 rounded-md border border-border bg-muted/25 p-4 text-[10px]">
          <dt className="text-muted-foreground">Associated Booking:</dt>
          <dd className="break-words font-bold">
            {booking.title} ({booking.reference})
          </dd>
          <dt className="text-muted-foreground">Event Date:</dt>
          <dd className="break-words font-bold">
            {receiptDate(booking.date)} · {booking.location}
          </dd>
        </dl>
      )}
      <table className="my-6 w-full table-fixed text-[11px]">
        <thead>
          <tr className="bg-muted/35">
            <th className="w-[55%] px-3 py-3 text-left font-semibold text-muted-foreground">
              Description
            </th>
            <th className="w-[20%] px-3 py-3 text-left font-semibold text-muted-foreground">
              Method
            </th>
            <th className="w-[25%] px-3 py-3 text-right font-semibold text-muted-foreground">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {receiptRows(receipt).map((row) => (
            <tr key={row.description} className="border-b border-border">
              <td className="px-3 py-4 font-semibold">{row.description}</td>
              <td className="px-3 py-4 text-[10px] text-muted-foreground">
                {row.method}
              </td>
              <td className="px-3 py-4 text-right font-bold">{row.amount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className="my-7 flex items-center justify-between gap-5 px-3">
        <div>
          <h2 className="text-sm font-bold">Net Refund Amount (Preview)</h2>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Return to original payment method
          </p>
        </div>
        <strong className="text-xl text-secondary">
          {receiptMoney(receipt.totalRefund)}
        </strong>
      </div>
      <section className="my-7 rounded-md border border-secondary/20 bg-secondary/5 p-4 text-secondary">
        <h2 className="text-xs font-bold">Payout Destination</h2>
        <p className="mt-1 text-[11px]">
          {receipt.destination} · {receipt.delivery}
        </p>
        <p className="mt-1 text-[10px]">Transaction Reference: Not submitted</p>
      </section>
      <footer className="mt-8 flex items-center justify-between gap-5 border-t border-border pt-5">
        <div>
          <p className="text-[10px] text-muted-foreground">Prepared By</p>
          <p className="mt-1 font-bold">Hosté Admin Preview</p>
          <p className="mt-1 text-[10px] text-muted-foreground">
            Payment Operations
          </p>
        </div>
        <div className="rounded-md border border-dashed border-primary px-5 py-3 text-center text-[9px] font-bold text-primary">
          PREVIEW
          <br />
          HOSTÉ SYSTEM
        </div>
      </footer>
      <p className="mt-7 text-center text-[9px] leading-4 text-muted-foreground">
        PREVIEW ONLY - No money was refunded. This is not proof of a completed
        transaction.
        <br />
        Quote receipt reference {receipt.reference} when contacting support.
      </p>
    </article>
  );
}
function ReceiptDetail({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex justify-between gap-3">
      <dt className="text-muted-foreground">{label}:</dt>
      <dd className="max-w-[70%] break-words text-right font-bold">{value}</dd>
    </div>
  );
}
