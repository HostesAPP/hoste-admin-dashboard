"use client";

import React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  ArrowLeft,
  MoreHorizontal,
  Lock,
  Download,
  RefreshCcw,
} from "lucide-react";
import type { BookingWithPayment } from "@/features/bookings/data/bookings.data";
import type { RefundContext } from "../types/transactions.types";
import { PAYMENT_METHOD_LABELS } from "./PaymentTable";

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded" | "Cancelled";

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");

const formatDate = (dateString: string) => {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return dateString;

  return parsedDate.toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
};

const formatTime = (dateString: string) => {
  const parsedDate = new Date(dateString);
  if (Number.isNaN(parsedDate.getTime())) return "Not recorded";

  return (
    parsedDate.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    }) + " WAT"
  );
};

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "border-secondary/20 bg-secondary/10 text-secondary",
  Pending: "border-warning-border bg-warning-surface text-warning",
  Failed: "border-destructive/20 bg-destructive/10 text-destructive",
  Refunded: "border-border bg-muted text-muted-foreground",
  Cancelled: "border-border bg-muted text-muted-foreground",
};

export function PaymentDetails({
  booking,
  context,
}: {
  booking: BookingWithPayment;
  context: RefundContext;
}) {
  const router = useRouter();

  const routeId = booking.id.replace(/^#/, "");
  const bookingId = booking.reference;

  const [menuOpen, setMenuOpen] = React.useState(false);

  const payment = context.transaction.payment;
  const canRefund =
    context.transaction.canRefund && context.availableAmount > 0;

  const issueRefund = () => {
    setMenuOpen(false);

    if (!canRefund) return;
    router.push(`/payments/${encodeURIComponent(payment.id)}/refund`);
  };

  const totalPaid = payment.grossAmount;

  const paymentStatus: PaymentStatus =
    payment.status === "Successful"
      ? "Paid"
      : payment.status === "Refunded"
        ? "Refunded"
        : payment.status;

  const paymentDateStr = payment.createdAt;
  const transactionId = payment.id;
  const reference = payment.referenceId;
  const eventDate = formatDate(booking.date);

  return (
    <div className="min-h-screen bg-background p-4 font-sans text-xs text-foreground sm:p-6 lg:p-8">
      <main className="mx-auto max-w-[1400px] space-y-6">
        {/* TOP NAVIGATION HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            <Link href="/bookings" className="hover:text-primary">
              Bookings
            </Link>
            <span className="mx-1.5">/</span>
            <span>{bookingId}</span>
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-foreground">
              Payment Details
            </span>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href={`/bookings/${encodeURIComponent(routeId)}`}
              className="inline-flex items-center gap-1.5 border border-border bg-card px-3.5 py-2 text-xs font-semibold text-foreground hover:bg-muted/50"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
              Back to Booking
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Payment actions"
                onClick={() => setMenuOpen((open) => !open)}
                className="border border-border bg-card p-2 text-muted-foreground hover:bg-muted/50"
              >
                <MoreHorizontal className="h-4 w-4" />
              </button>

              {menuOpen && (
                <>
                  <button
                    type="button"
                    aria-label="Close menu"
                    className="fixed inset-0 z-10 cursor-default"
                    onClick={() => setMenuOpen(false)}
                  />
                  <div className="absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-card p-1.5 shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        window.print();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-foreground hover:bg-muted/50"
                    >
                      <Download className="h-4 w-4" />
                      Print payment details
                    </button>
                    <button
                      type="button"
                      onClick={issueRefund}
                      disabled={!canRefund}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-destructive hover:bg-destructive/10"
                    >
                      <RefreshCcw className="h-4 w-4" />
                      Issue refund
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>

        <h1 className="text-2xl font-bold tracking-normal text-foreground">
          Payment Details
        </h1>

        {/* PAYMENT OVERVIEW HEADER CARD */}
        <div className="grid grid-cols-1 gap-6 border border-border bg-card p-6 shadow-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Total Paid
            </p>
            <p className="mt-1 text-2xl font-extrabold text-foreground">
              {formatMoney(totalPaid)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Payment Status
            </p>
            <div className="mt-1.5">
              <span
                className={`inline-block border px-2.5 py-0.5 text-[11px] font-semibold ${statusStyles[paymentStatus]}`}
              >
                {paymentStatus}
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Payment Method
            </p>
            <p className="mt-1 text-xs font-bold text-foreground">
              {PAYMENT_METHOD_LABELS[context.transaction.method]}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Payment Date
            </p>
            <p className="mt-1 text-xs font-bold text-foreground">
              {formatDate(paymentDateStr)}
            </p>
            <p className="text-[10px] text-muted-foreground">
              {formatTime(paymentDateStr)}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Transaction ID
            </p>
            <p className="mt-1 break-words text-xs font-bold text-foreground">
              {transactionId}
            </p>
            <p className="break-words text-[10px] text-muted-foreground">
              Ref: {reference}
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Escrow Status
            </p>
            <div className="mt-1.5">
              <span className="inline-block bg-muted px-2.5 py-0.5 text-[11px] font-semibold text-muted-foreground">
                Not recorded
              </span>
            </div>
          </div>
        </div>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
          {/* LEFT COLUMN */}
          <div className="space-y-6 lg:col-span-7">
            {/* PAYMENT BREAKDOWN */}
            <section className="border border-border bg-card p-6 shadow-none">
              <h2 className="mb-5 text-sm font-bold text-foreground">
                Payment Breakdown
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Booking Amount (Gross)
                  </span>
                  <span className="font-bold text-foreground">
                    {formatMoney(totalPaid)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Hosté Service Fee
                  </span>
                  <span className="font-bold text-secondary">
                    {formatMoney(payment.serviceFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">Processing Fee</span>
                  <span className="font-bold text-primary">
                    {formatMoney(payment.processingFee)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted/30 p-4">
                  <span className="text-xs font-bold text-foreground">
                    Total Paid by Client
                  </span>
                  <span className="text-base font-extrabold text-foreground">
                    {formatMoney(totalPaid)}
                  </span>
                </div>
              </div>
            </section>

            {/* ESCROW */}
            <section className="border border-border bg-card p-6 shadow-none">
              <div className="mb-5 flex items-center gap-2">
                <h2 className="text-sm font-bold text-foreground">Escrow</h2>
                <span className="bg-warning-surface px-2 py-0.5 text-[10px] font-semibold text-warning">
                  Not recorded
                </span>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Amount Held in Escrow
                  </p>
                  <p className="mt-1 text-2xl font-extrabold text-foreground">
                    Not recorded
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Expected Hosté Payout Date
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground">
                    Not recorded
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    No payout schedule is included in this payment record.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-md border border-secondary/20 bg-secondary/10 p-3 text-xs text-secondary">
                <Lock className="h-4 w-4 shrink-0" />
                <span className="text-[11px] font-medium">
                  Escrow balances and payout schedules must be supplied by the
                  payment provider; they are not inferred from the booking
                  status.
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 lg:col-span-5">
            {/* CLIENT & BOOKING */}
            <section className="border border-border bg-card p-6 shadow-none">
              <h2 className="mb-5 text-sm font-bold text-foreground">
                Client &amp; Booking
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Client
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground">
                    {booking.client}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {booking.customerEmail}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Booking &amp; Event
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground">
                    {booking.event}
                  </p>
                  <p className="mt-0.5 break-all text-[10px] text-muted-foreground">
                    ID: {bookingId}
                  </p>
                </div>
              </div>

              <div className="mt-5 flex flex-wrap items-end justify-between gap-4 border-t border-border pt-4">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Event Date
                  </p>
                  <p className="mt-1 text-xs font-bold text-foreground">
                    {eventDate}
                  </p>
                </div>

                <Link
                  href={`/bookings/${encodeURIComponent(routeId)}`}
                  className="border border-border bg-background px-4 py-2 text-xs font-bold text-foreground hover:bg-muted"
                >
                  View Booking
                </Link>
              </div>
            </section>

            {/* TRANSACTION ACTIVITY */}
            <section className="border border-border bg-card p-6 shadow-none">
              <h2 className="mb-5 text-sm font-bold text-foreground">
                Transaction Activity
              </h2>

              <div className="relative space-y-6 border-l border-border pl-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-secondary" />
                  <p className="font-bold text-foreground">
                    Payment recorded: {paymentStatus}
                  </p>
                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatDate(paymentDateStr)} · {formatTime(paymentDateStr)}
                  </p>
                </div>
              </div>
            </section>

            {/* REFUND */}
            <section className="border border-border bg-card p-6 shadow-none">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-foreground">Refund</h2>
                <span className="bg-muted px-2 py-1 text-[10px] font-semibold text-muted-foreground">
                  {context.recentRefunds.length
                    ? `${context.recentRefunds.length} refund record(s)`
                    : "No refund issued"}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Refundable Amount
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-foreground">
                    {formatMoney(context.availableAmount)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={issueRefund}
                  disabled={!canRefund}
                  className="inline-flex items-center border border-destructive/30 bg-card px-4 py-2 text-xs font-bold text-destructive transition hover:bg-destructive/10 disabled:cursor-not-allowed disabled:opacity-50"
                >
                  Refund Payment
                </button>
              </div>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
