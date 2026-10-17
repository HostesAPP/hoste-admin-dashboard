"use client";
import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  ArrowLeft,
  Bell,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  CreditCard,
  ImageIcon,
  Info,
  Loader2,
  MapPin,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { mockRefundAdapter } from "../refund.adapter";
import { RefundReviewDialog, RefundReceiptDialog } from "./RefundDialogs";
import { createRefundSchema } from "../schemas/refund.schema";
import type {
  RefundAdapter,
  RefundContext,
  RefundDraft,
  RefundQuote,
  RefundReceipt,
} from "../types/transactions.types";
import { formatPaymentAmount, PAYMENT_METHOD_LABELS } from "./PaymentTable";

const dateLabel = (date: string) =>
  new Date(date).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "UTC",
  });
export function RefundPage({
  context,
  adapter = mockRefundAdapter,
}: {
  context: RefundContext;
  adapter?: RefundAdapter;
}) {
  const { transaction, booking } = context;
  const { payment } = transaction;
  const form = useForm<RefundDraft>({
    resolver: zodResolver(
      createRefundSchema(
        context.availableAmount,
        context.reasons.map((reason) => reason.value),
      ),
    ),
    defaultValues: {
      amount: "",
      reason: "",
      description: "",
      destination: "Original Payment Method",
    },
  });
  const description = useWatch({ control: form.control, name: "description" });
  const [quote, setQuote] = useState<RefundQuote | null>(null);
  const [review, setReview] = useState<{
    draft: RefundDraft;
    quote: RefundQuote;
  } | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [receipt, setReceipt] = useState<RefundReceipt | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [imageFailed, setImageFailed] = useState(false);
  const disabled = busy || !transaction.canRefund;
  const reviewRefund = form.handleSubmit(async (draft) => {
    setError("");
    setMessage("");
    setBusy(true);
    try {
      const result = await adapter.quote(payment.id, draft);
      setQuote(result);
      setReview({ draft, quote: result });
    } catch (cause) {
      setError(
        cause instanceof Error ? cause.message : "Unable to review the refund.",
      );
    } finally {
      setBusy(false);
    }
  });
  const confirm = async () => {
    if (!review) return;
    setBusy(true);
    setError("");
    try {
      const result = await adapter.review(payment.id, review.draft);
      setMessage(result.message);
      setReceipt(result.receipt);
      setReview(null);
    } catch (cause) {
      setError(
        cause instanceof Error
          ? cause.message
          : "Unable to confirm the refund.",
      );
    } finally {
      setBusy(false);
    }
  };
  const history = () =>
    context.recentRefunds.length ? (
      <div className="divide-y divide-border">
        {context.recentRefunds.map((refund) => (
          <div key={refund.id} className="space-y-2 py-3">
            <div className="flex items-center justify-between gap-2">
              <p className="break-all text-xs font-semibold">
                {refund.reference}
              </p>
              <span
                className={`rounded-full px-2 py-1 text-[10px] font-semibold ${!refund.status ? "bg-muted text-muted-foreground" : refund.status === "Completed" ? "bg-secondary/10 text-secondary" : "bg-destructive/10 text-destructive"}`}
              >
                {refund.status ?? "Status unavailable"}
              </span>
            </div>
            <div className="flex items-center justify-between gap-2 text-xs">
              <span className="text-muted-foreground">
                {dateLabel(refund.date)}
              </span>
              <strong>{formatPaymentAmount(refund.amount)}</strong>
            </div>
          </div>
        ))}
      </div>
    ) : (
      <p className="py-4 text-xs text-muted-foreground">
        No recent refunds for this customer.
      </p>
    );
  return (
    <div className="min-w-[1024px] tracking-normal">
      <header className="flex h-[76px] items-center justify-between border-b border-border bg-card px-8">
        <nav
          aria-label="Refund breadcrumb"
          className="flex items-center gap-2 text-xs"
        >
          <Link
            href="/payments"
            className="text-muted-foreground hover:text-primary"
          >
            Payments
          </Link>
          <ChevronDown className="size-3 -rotate-90 text-muted-foreground" />
          <span className="font-semibold">Issue Refund</span>
        </nav>
        <div className="flex items-center gap-6">
          <Button
            variant="ghost"
            size="icon"
            nativeButton={false}
            aria-label="Open notifications"
            render={<Link href="/notifications" />}
          >
            <Bell className="size-5" />
          </Button>
          <div className="flex items-center gap-3">
            <Avatar className="size-9">
              <AvatarFallback className="bg-secondary/10 text-xs text-secondary">
                JA
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold">John Admin</p>
              <p className="text-[11px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </header>
      <div className="grid grid-cols-[minmax(0,1fr)_300px] items-start gap-6 p-8">
        <div className="space-y-5">
          <div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                size="icon"
                className="size-8"
                nativeButton={false}
                aria-label="Back to payments"
                render={<Link href="/payments" />}
              >
                <ArrowLeft className="size-4" />
              </Button>
              <h1 className="text-2xl font-bold">Issue Refund</h1>
            </div>
            <p className="mt-2 text-xs text-muted-foreground">
              Process a refund for a booking
            </p>
          </div>
          {message && (
            <p
              role="status"
              className="flex gap-2 rounded-md border border-secondary/20 bg-secondary/10 p-3 text-xs text-secondary"
            >
              <CheckCircle2 className="size-4 shrink-0" />
              {message}
            </p>
          )}
          {!transaction.canRefund && (
            <p
              role="alert"
              className="rounded-md bg-destructive/10 p-3 text-xs text-destructive"
            >
              This payment is not eligible for a refund.
            </p>
          )}
          {error && !review && (
            <p role="alert" className="text-xs text-destructive">
              {error}
            </p>
          )}
          <section className="border-b border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">
              1. Booking Information
            </h2>
            {booking ? (
              <div className="flex items-center gap-4">
                <div className="flex size-20 shrink-0 items-center justify-center overflow-hidden rounded-md bg-muted">
                  {imageFailed || !booking.imageUrl ? (
                    <ImageIcon className="size-6 text-muted-foreground" />
                  ) : (
                    <Image
                      unoptimized
                      src={booking.imageUrl}
                      width={80}
                      height={80}
                      alt={booking.title}
                      className="size-20 object-cover"
                      onError={() => setImageFailed(true)}
                    />
                  )}
                </div>
                <div className="grid flex-1 grid-cols-[minmax(0,1.4fr)_minmax(0,1fr)] gap-4">
                  <div>
                    <h3 className="text-sm font-semibold">{booking.title}</h3>
                    <span className="mt-1 inline-block rounded-full bg-secondary/10 px-2 py-0.5 text-[10px] font-semibold text-secondary">
                      {booking.status}
                    </span>
                    <p className="mt-2 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <CalendarDays className="size-3.5 shrink-0" />
                      {dateLabel(booking.date)}
                      {booking.date.includes("T") && <> · {new Date(booking.date).toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        timeZone: "UTC",
                      })}{" "}
                      UTC</>}
                    </p>
                    <p className="mt-1 flex items-center gap-1.5 text-[11px] text-muted-foreground">
                      <MapPin className="size-3.5 shrink-0" />
                      {booking.location}
                    </p>
                  </div>
                  <dl className="space-y-2 text-xs">
                    <div>
                      <dt className="text-[10px] uppercase text-muted-foreground">
                        Booking ID
                      </dt>
                      <dd className="break-all font-semibold">
                        {booking.reference}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase text-muted-foreground">
                        Hostés
                      </dt>
                      <dd className="font-semibold text-secondary">
                        {booking.hostCount === null ? "Not provided" : `${booking.hostCount} Hostés`}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[10px] uppercase text-muted-foreground">
                        Customer
                      </dt>
                      <dd className="font-semibold text-secondary">
                        {payment.payerProfileName}
                      </dd>
                    </div>
                  </dl>
                </div>
              </div>
            ) : (
              <p className="text-xs text-muted-foreground">
                No booking is linked to this {payment.paymentType.toLowerCase()}{" "}
                payment.
              </p>
            )}
          </section>
          <section className="border-b border-border bg-card p-5">
            <h2 className="mb-5 text-sm font-semibold">
              2. Payment Information
            </h2>
            <dl className="grid grid-cols-3 gap-4 text-xs">
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">
                  Payment ID
                </dt>
                <dd className="mt-1 break-all font-semibold">
                  {payment.referenceId}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">
                  Payment Method
                </dt>
                <dd className="mt-1 inline-flex items-center gap-1.5 font-semibold">
                  <CreditCard className="size-4 text-secondary" />
                  {PAYMENT_METHOD_LABELS[transaction.method]}
                </dd>
              </div>
              <div>
                <dt className="text-[10px] uppercase text-muted-foreground">
                  Payment Date
                </dt>
                <dd className="mt-1 font-semibold">
                  {dateLabel(payment.createdAt)}
                </dd>
              </div>
            </dl>
            <div className="mt-5 flex items-center justify-between gap-4 rounded-md bg-muted/35 p-4">
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Amount Paid
                </p>
                <p className="mt-1 text-lg font-bold text-secondary">
                  {formatPaymentAmount(payment.grossAmount)}
                </p>
              </div>
              <div>
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">
                  Payment Status
                </p>
                <span
                  className={`mt-1 inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${payment.status === "Successful" ? "bg-secondary/10 text-secondary" : "bg-muted text-muted-foreground"}`}
                >
                  {payment.status}
                </span>
              </div>
            </div>
          </section>
          <section className="border-b border-border bg-card p-5">
            <h2 className="mb-5 text-sm font-semibold">3. Refund Details</h2>
            <form
              onSubmit={reviewRefund}
              onChange={() => {
                setQuote(null);
                setMessage("");
              }}
              className="space-y-5"
            >
              <div className="grid grid-cols-2 gap-4">
                <Controller
                  control={form.control}
                  name="amount"
                  render={({ field, fieldState }) => (
                    <label className="space-y-2 text-xs">
                      <span className="font-semibold">
                        Refund Amount (₦){" "}
                        <span className="text-primary">*</span>
                      </span>
                      <Input
                        {...field}
                        inputMode="decimal"
                        placeholder="50,000.00"
                        disabled={disabled}
                        aria-invalid={!!fieldState.error}
                        className="h-10 text-xs"
                      />
                      <span className="block text-[10px] text-muted-foreground">
                        Max Refundable:{" "}
                        {formatPaymentAmount(context.availableAmount)}
                      </span>
                      {fieldState.error && (
                        <span
                          role="alert"
                          className="block text-xs text-destructive"
                        >
                          {fieldState.error.message}
                        </span>
                      )}
                    </label>
                  )}
                />
                <Controller
                  control={form.control}
                  name="reason"
                  render={({ field, fieldState }) => (
                    <label className="space-y-2 text-xs">
                      <span className="font-semibold">
                        Refund Reason <span className="text-primary">*</span>
                      </span>
                      <div className="relative">
                        <select
                          {...field}
                          disabled={disabled}
                          aria-invalid={!!fieldState.error}
                          className="h-10 w-full appearance-none rounded-md border border-input bg-card pl-3 pr-10 text-xs outline-none focus-visible:ring-2 focus-visible:ring-primary"
                        >
                          <option value="">Select reason</option>
                          {context.reasons.map((reason) => (
                            <option key={reason.value} value={reason.value}>
                              {reason.label}
                            </option>
                          ))}
                        </select>
                        <ChevronDown
                          aria-hidden
                          className="pointer-events-none absolute right-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
                        />
                      </div>
                      {fieldState.error && (
                        <span
                          role="alert"
                          className="block text-xs text-destructive"
                        >
                          {fieldState.error.message}
                        </span>
                      )}
                    </label>
                  )}
                />
                <Controller
                  control={form.control}
                  name="description"
                  render={({ field, fieldState }) => (
                    <label className="space-y-2 text-xs">
                      <span className="font-semibold">
                        Refund Description (Optional)
                      </span>
                      <div className="relative">
                        <Textarea
                          {...field}
                          disabled={disabled}
                          maxLength={250}
                          placeholder="Add a note for this refund (visible to admin only)"
                          aria-invalid={!!fieldState.error}
                          className="min-h-28 pb-6 text-xs"
                        />
                        <span className="absolute bottom-2 right-3 text-[10px] text-muted-foreground">
                          {description.length}/250
                        </span>
                      </div>
                      {fieldState.error && (
                        <span role="alert" className="block text-destructive">
                          {fieldState.error.message}
                        </span>
                      )}
                    </label>
                  )}
                />
                <fieldset className="space-y-3 text-xs">
                  <legend className="mb-3 font-semibold">
                    Refund to <span className="text-primary">*</span>
                  </legend>
                  <label className="flex items-start gap-2">
                    <input
                      type="radio"
                      checked
                      readOnly
                      name="refund-destination"
                      className="mt-0.5 accent-secondary"
                    />
                    <span>
                      <strong>Original Payment Method</strong>
                      <span className="mt-1 block text-[11px] text-muted-foreground">
                        Refund will be sent to the customer&apos;s original
                        payment method.
                      </span>
                    </span>
                  </label>
                  <label className="flex items-start gap-2 text-muted-foreground">
                    <input
                      type="radio"
                      disabled
                      name="refund-destination"
                      className="mt-0.5"
                    />
                    <span>
                      <strong>Hosté Wallet</strong>
                      <span className="mt-1 block text-[11px]">
                        Unavailable for this payment.
                      </span>
                    </span>
                  </label>
                </fieldset>
              </div>
              <footer className="flex justify-end gap-3 border-t border-border pt-4">
                <Button
                  variant="outline"
                  nativeButton={false}
                  render={<Link href="/payments" />}
                >
                  Cancel
                </Button>
                <Button type="submit" disabled={disabled}>
                  {busy && <Loader2 className="size-4 animate-spin" />}Review
                  Refund
                </Button>
              </footer>
            </form>
          </section>
        </div>
        <aside className="space-y-5 pt-1">
          <section className="border-b border-border bg-card p-5">
            <h2 className="mb-4 text-sm font-semibold">Refund Summary</h2>
            <dl className="space-y-3 text-xs">
              <SummaryRow
                label="Amount Paid"
                value={formatPaymentAmount(payment.grossAmount)}
              />
              <SummaryRow
                label="Available for Refund"
                value={formatPaymentAmount(context.availableAmount)}
                success
              />
              <SummaryRow
                label="Refund Amount"
                value={quote ? formatPaymentAmount(quote.amount) : "—"}
              />
              <SummaryRow
                label="Processing Fee"
                value={quote ? formatPaymentAmount(quote.processingFee) : "—"}
              />
              <div className="border-t border-border pt-4">
                <SummaryRow
                  label="Total Refund"
                  value={quote ? formatPaymentAmount(quote.totalRefund) : "—"}
                  total
                />
              </div>
            </dl>
          </section>
          <section className="flex gap-3 border border-yellow/20 bg-yellow/5 p-4">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" />
            <div>
              <h2 className="text-xs font-semibold">Refund Policy</h2>
              <p className="mt-1 text-[11px] leading-5 text-muted-foreground">
                {context.policy}
              </p>
            </div>
          </section>
          <section className="border-b border-border bg-card p-5">
            <h2 className="text-sm font-semibold">
              Recent Refunds for this Customer
            </h2>
            {history()}
            <Button
              variant="outline"
              size="sm"
              className="mt-3 w-full"
              onClick={() => setHistoryOpen(true)}
            >
              View All Refunds
            </Button>
          </section>
        </aside>
      </div>
      {review && (
        <RefundReviewDialog
          context={context}
          draft={review.draft}
          quote={review.quote}
          busy={busy}
          error={error}
          onClose={() => setReview(null)}
          onConfirm={confirm}
        />
      )}
      {receipt && (
        <RefundReceiptDialog
          receipt={receipt}
          message={message}
          onClose={() => setReceipt(null)}
        />
      )}
      {historyOpen && (
        <Dialog
          open
          onOpenChange={(open) => {
            if (!open) setHistoryOpen(false);
          }}
        >
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Customer Refunds</DialogTitle>
              <DialogDescription>{payment.payerProfileName}</DialogDescription>
            </DialogHeader>
            {history()}
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
function SummaryRow({
  label,
  value,
  success = false,
  total = false,
}: {
  label: string;
  value: string;
  success?: boolean;
  total?: boolean;
}) {
  return (
    <div className="flex items-start justify-between gap-3">
      <dt className={total ? "font-bold" : "text-muted-foreground"}>{label}</dt>
      <dd
        className={`max-w-[60%] break-words text-right font-semibold ${total ? "text-base text-primary" : success ? "text-secondary" : ""}`}
      >
        {value}
      </dd>
    </div>
  );
}
