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
import { BOOKINGS_DATA } from "@/features/bookings/data/bookings.data";

interface PageProps {
  params: Promise<{ id: string }>;
}

type PaymentStatus = "Paid" | "Pending" | "Failed" | "Refunded";

const COMMISSION_RATE = 20;

const formatMoney = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");

const formatDate = (dateString?: string) => {
  if (!dateString) return "August 21, 2026";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) return dateString;

  return parsedDate.toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
};

const formatTime = (dateString?: string) => {
  if (!dateString) return "10:24 AM WAT";

  const parsedDate = new Date(dateString);

  if (Number.isNaN(parsedDate.getTime())) return "10:24 AM WAT";

  return (
    parsedDate.toLocaleTimeString("en-NG", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
      timeZone: "Africa/Lagos",
    }) + " WAT"
  );
};

const getStaffCount = (assigned?: string) => {
  if (!assigned) return 8;

  const match = assigned.match(/\+\s*(\d+)/);

  return match ? Number(match[1]) + 1 : assigned.trim() ? 1 : 8;
};

const getNextDay = (dateString?: string) => {
  const parsedDate = new Date(dateString || "2026-08-28");

  if (Number.isNaN(parsedDate.getTime())) return "August 29, 2026";

  parsedDate.setDate(parsedDate.getDate() + 1);

  return parsedDate.toLocaleDateString("en-NG", {
    month: "long",
    day: "numeric",
    year: "numeric",
    timeZone: "Africa/Lagos",
  });
};

const statusStyles: Record<PaymentStatus, string> = {
  Paid: "border-success/20 bg-success/10 text-success",
  Pending: "border-warning-border bg-warning-surface text-warning",
  Failed: "border-destructive/20 bg-destructive/10 text-destructive",
  Refunded: "border-primary/20 bg-primary/10 text-primary",
};

export default function PaymentDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const router = useRouter();

  const routeId = decodeURIComponent(resolvedParams.id).replace(/^#/, "");
  const bookingId = `#${routeId}`;

  const [menuOpen, setMenuOpen] = React.useState(false);

  const booking = BOOKINGS_DATA.find(
    (item) =>
      item.id.replace(/^#/, "") === routeId ||
      item.paymentDetails?.id === routeId,
  );

  const payment = booking?.paymentDetails;

  const issueRefund = () => {
    setMenuOpen(false);

    if (!booking) return;

    const bookingCleanId = booking.id.replace(/^#/, "");

    router.push(`/payments/${encodeURIComponent(bookingCleanId)}/refund`);
  };

  if (!booking || !payment) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-background p-6 font-sans text-foreground">
        <div className="w-full max-w-md border border-border bg-card p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold text-card-foreground">
            Payment Not Found
          </h1>

          <p className="mt-2 text-sm text-muted-foreground">
            No payment record found for {bookingId}.
          </p>

          <Link
            href="/bookings"
            className="mt-5 inline-flex items-center gap-2 bg-primary-orange px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-primary-orange/90"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Bookings
          </Link>
        </div>
      </div>
    );
  }

  // Dynamic calculations based on the selected booking.
  const rawAmount =
    typeof booking.amount === "number"
      ? booking.amount
      : Number(String(booking.amount).replace(/[₦,\s]/g, "")) || 0;

  const totalPaid = Number(payment.grossAmount) || rawAmount || 250000;
  const commission = totalPaid * (COMMISSION_RATE / 100);
  const netPayout = Math.max(0, totalPaid - commission);
  const staffCount = getStaffCount(booking.hosteAssigned);

  const paymentStatus: PaymentStatus =
    payment.status === "Successful"
      ? "Paid"
      : payment.status === "Refunded"
        ? "Refunded"
        : payment.status === "Failed"
          ? "Failed"
          : "Paid";

  const paymentDateStr = payment.createdAt;
  const transactionId = payment.id || "PSK-8F72K91X";
  const reference = payment.referenceId || `HOST-${routeId}`;

  const escrowStatus =
    paymentStatus === "Refunded"
      ? "Refunded"
      : booking.status === "Completed"
        ? "Released"
        : "Held in Escrow";

  const eventDate = booking.date || "August 28, 2026";
  const payoutDate = getNextDay(booking.date);

  return (
    <div className="min-h-screen bg-background p-4 font-sans text-xs text-foreground sm:p-6 lg:p-8">
      <main className="mx-auto max-w-[1400px] space-y-6">
        {/* TOP NAVIGATION HEADER */}
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-muted-foreground">
            <Link
              href="/bookings"
              className="transition hover:text-primary-orange"
            >
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
              className="inline-flex items-center gap-1.5 border border-border bg-card px-3.5 py-2 text-xs font-semibold text-card-foreground transition hover:bg-accent"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-muted-foreground" />
              Back to Booking
            </Link>

            <div className="relative">
              <button
                type="button"
                aria-label="Payment actions"
                aria-expanded={menuOpen}
                onClick={() => setMenuOpen((open) => !open)}
                className="border border-border bg-card p-2 text-muted-foreground transition hover:bg-accent"
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

                  <div className="absolute right-0 top-full z-20 mt-2 w-48 border border-border bg-popover p-1.5 text-popover-foreground shadow-lg">
                    <button
                      type="button"
                      onClick={() => {
                        setMenuOpen(false);
                        window.print();
                      }}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-foreground transition hover:bg-accent"
                    >
                      <Download className="h-4 w-4" />
                      Print payment details
                    </button>

                    <button
                      type="button"
                      onClick={issueRefund}
                      className="flex w-full items-center gap-2 px-3 py-2.5 text-left text-xs text-destructive transition hover:bg-destructive/10"
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

        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Payment Details
        </h1>

        {/* PAYMENT OVERVIEW HEADER CARD */}
        <div className="grid grid-cols-1 gap-6 border border-border bg-card p-6 shadow-none sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 xl:gap-4">
          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Total Paid
            </p>

            <p className="mt-1 text-2xl font-extrabold text-card-foreground">
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

            <p className="mt-1 text-xs font-bold text-card-foreground">
              Paystack
            </p>

            <p className="text-[10px] text-muted-foreground">
              Card (•••• 4092)
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-muted-foreground">
              Payment Date
            </p>

            <p className="mt-1 text-xs font-bold text-card-foreground">
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

            <p className="mt-1 break-words text-xs font-bold text-card-foreground">
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
              <span
                className={`inline-block px-2.5 py-0.5 text-[11px] font-semibold ${
                  escrowStatus === "Held in Escrow"
                    ? "border border-warning-border bg-warning-surface text-warning"
                    : "border border-success/20 bg-success/10 text-success"
                }`}
              >
                {escrowStatus}
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
              <h2 className="mb-5 text-sm font-bold text-card-foreground">
                Payment Breakdown
              </h2>

              <div className="space-y-4">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Booking Amount (Gross)
                  </span>

                  <span className="font-bold text-card-foreground">
                    {formatMoney(totalPaid)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Hosté Service Commission ({COMMISSION_RATE}%)
                  </span>

                  <span className="font-bold text-success">
                    + {formatMoney(commission)}
                  </span>
                </div>

                <div className="flex items-center justify-between text-xs">
                  <span className="text-muted-foreground">
                    Hosté Net Payout Pool ({staffCount} Staff)
                  </span>

                  <span className="font-bold text-primary-orange">
                    {formatMoney(netPayout)}
                  </span>
                </div>

                <div className="flex items-center justify-between border-t border-border bg-muted p-4">
                  <span className="text-xs font-bold text-card-foreground">
                    Total Paid by Client
                  </span>

                  <span className="text-base font-extrabold text-card-foreground">
                    {formatMoney(totalPaid)}
                  </span>
                </div>
              </div>
            </section>

            {/* ESCROW */}
            <section className="border border-border bg-card p-6 shadow-none">
              <div className="mb-5 flex items-center gap-2">
                <h2 className="text-sm font-bold text-card-foreground">
                  Escrow
                </h2>

                <span
                  className={`px-2 py-0.5 text-[10px] font-semibold ${
                    escrowStatus === "Held in Escrow"
                      ? "bg-warning-surface text-warning"
                      : escrowStatus === "Refunded"
                        ? "bg-destructive/10 text-destructive"
                        : "bg-success/10 text-success"
                  }`}
                >
                  {escrowStatus === "Held in Escrow" ? "Held" : escrowStatus}
                </span>
              </div>

              <div className="mb-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Amount Held in Escrow
                  </p>

                  <p className="mt-1 text-2xl font-extrabold text-card-foreground">
                    {formatMoney(
                      escrowStatus === "Held in Escrow" ? netPayout : 0,
                    )}
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Expected Hosté Payout Date
                  </p>

                  <p className="mt-1 text-xs font-bold text-card-foreground">
                    {payoutDate}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    (24 hours post-event completion)
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2.5 rounded-md border border-success/20 bg-success/10 p-3 text-xs text-success">
                <Lock className="h-4 w-4 shrink-0" />

                <span className="text-[11px] font-medium">
                  Funds are held securely until the booking is completed
                  according to Hosté&apos;s payment policy.
                </span>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <div className="space-y-6 lg:col-span-5">
            {/* CLIENT & BOOKING */}
            <section className="border border-border bg-card p-6 shadow-none">
              <h2 className="mb-5 text-sm font-bold text-card-foreground">
                Client &amp; Booking
              </h2>

              <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Client
                  </p>

                  <p className="mt-1 text-xs font-bold text-card-foreground">
                    {booking.client}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    Contact: John Okafor
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Booking &amp; Event
                  </p>

                  <p className="mt-1 text-xs font-bold text-card-foreground">
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

                  <p className="mt-1 text-xs font-bold text-card-foreground">
                    {eventDate}
                  </p>
                </div>

                <Link
                  href={`/bookings/${encodeURIComponent(routeId)}`}
                  className="border border-border bg-muted px-4 py-2 text-xs font-bold text-card-foreground transition hover:bg-accent"
                >
                  View Booking
                </Link>
              </div>
            </section>

            {/* TRANSACTION ACTIVITY */}
            <section className="border border-border bg-card p-6 shadow-none">
              <h2 className="mb-5 text-sm font-bold text-card-foreground">
                Transaction Activity
              </h2>

              <div className="relative space-y-6 border-l border-border pl-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card bg-success" />

                  <p className="font-bold text-card-foreground">
                    Payment initiated
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatDate(paymentDateStr)} · 10:20 AM
                  </p>
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card ${
                      paymentStatus === "Failed"
                        ? "bg-destructive"
                        : paymentStatus === "Refunded"
                          ? "bg-primary"
                          : "bg-success"
                    }`}
                  />

                  <p className="font-bold text-card-foreground">
                    {paymentStatus === "Refunded"
                      ? "Payment refunded"
                      : paymentStatus === "Failed"
                        ? "Payment failed"
                        : "Payment successful"}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatDate(paymentDateStr)} · {formatTime(paymentDateStr)}
                  </p>
                </div>

                <div className="relative">
                  <span
                    className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card ${
                      escrowStatus === "Held in Escrow"
                        ? "bg-success"
                        : "bg-muted-foreground"
                    }`}
                  />

                  <p className="font-bold text-card-foreground">
                    {escrowStatus === "Held in Escrow"
                      ? "Funds placed in escrow"
                      : escrowStatus === "Released"
                        ? "Funds released"
                        : "Escrow refunded"}
                  </p>

                  <p className="mt-0.5 text-[10px] text-muted-foreground">
                    {formatDate(paymentDateStr)} · 10:25 AM
                  </p>
                </div>
              </div>
            </section>

            {/* REFUND */}
            <section className="border border-border bg-card p-6 shadow-none">
              <div className="mb-5 flex flex-wrap items-center justify-between gap-2">
                <h2 className="text-sm font-bold text-card-foreground">
                  Refund
                </h2>

                <span
                  className={`px-2 py-1 text-[10px] font-semibold ${
                    paymentStatus === "Refunded"
                      ? "bg-success/10 text-success"
                      : "bg-muted text-muted-foreground"
                  }`}
                >
                  {paymentStatus === "Refunded"
                    ? "Refund issued"
                    : "No refund issued"}
                </span>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <p className="text-[10px] font-medium text-muted-foreground">
                    Refundable Amount
                  </p>

                  <p className="mt-1 text-xl font-extrabold text-card-foreground">
                    {formatMoney(paymentStatus === "Refunded" ? 0 : totalPaid)}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={issueRefund}
                  disabled={paymentStatus === "Refunded"}
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
