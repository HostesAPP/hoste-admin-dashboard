"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  SlidersHorizontal,
  MoreHorizontal,
  ArrowLeft,
  ArrowRight,
  Star,
} from "lucide-react";

import { BOOKINGS_DATA } from "@/features/bookings/data/bookings.data";

import ReassignHosteModal from "@/components/modals/ReassignHosteModal";
import CancelBookingModal from "@/components/modals/CancelBookingModal";
import ConfirmBookingModal from "@/components/modals/ConfirmBookingModal";
import MarkCompletedModal from "@/components/modals/MarkCompletedModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

type BookingStatus = "Pending" | "Confirmed" | "Completed" | "Cancelled";

const cardStyle =
  "min-w-0 rounded-none border border-border bg-card p-4 shadow-none lg:p-5";

const labelStyle = "text-[11px] font-medium text-muted-foreground";
const valueStyle = "mt-1 text-xs font-semibold text-foreground";

const formatCurrency = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    maximumFractionDigits: 0,
  })
    .format(amount)
    .replace("NGN", "₦");

export default function BookingDetailPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const rawId = decodeURIComponent(resolvedParams?.id || "BK-10482").replace(
    /^#/,
    "",
  );

  const booking = BOOKINGS_DATA.find(
    (item) => item.id.replace(/^#/, "") === rawId,
  );

  const [bookingStatus, setBookingStatus] = useState<BookingStatus>(
    () => (booking?.status as BookingStatus) || "Pending",
  );

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [isMarkCompletedModalOpen, setIsMarkCompletedModalOpen] =
    useState(false);

  const bookingId = `#${rawId}`;

  const closeOtherModals = () => {
    setIsCancelModalOpen(false);
    setIsConfirmModalOpen(false);
    setIsMarkCompletedModalOpen(false);
  };

  const handleReassign = (selectedHosteId: string) => {
    console.log("Reassigning to Hosté ID:", selectedHosteId);
    setIsReassignModalOpen(false);
  };

  const handleConfirmCancel = (reason: string, notes: string) => {
    console.log("Cancelling booking:", { bookingId: rawId, reason, notes });
    setBookingStatus("Cancelled");
    setIsCancelModalOpen(false);
  };

  const handleKeepBooking = () => {
    setIsCancelModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    console.log("Booking confirmed:", rawId);
    setBookingStatus("Confirmed");
    setIsConfirmModalOpen(false);
  };

  const handleConfirmCompleted = () => {
    console.log("Booking marked as completed:", rawId);
    setBookingStatus("Completed");
    setIsMarkCompletedModalOpen(false);
  };

  const statusStyle: Record<BookingStatus, string> = {
    Pending: "bg-warning-surface text-warning border-warning-border",
    Confirmed: "bg-success/10 text-success border-success/20",
    Completed: "bg-success/10 text-success border-success/20",
    Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  };

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-start justify-center gap-3 bg-background p-8 text-sm text-foreground">
        <h1 className="text-lg font-bold text-foreground">Booking not found</h1>
        <p>
          No booking was found for ID <strong>{bookingId}</strong>.
        </p>
        <Link
          href="/bookings"
          className="font-semibold text-primary hover:underline"
        >
          Back to Bookings
        </Link>
      </div>
    );
  }

  const payment = booking.paymentDetails;

  const amount =
    typeof booking.amount === "number"
      ? booking.amount
      : Number(String(booking.amount).replace(/[₦,\s]/g, "")) || 0;

  const paymentStatus = booking.payment || "Pending";

  const paymentIsPaid =
    paymentStatus === "Paid" || payment?.status === "Successful";

  const activity = [
    {
      title: "Booking created",
      time: "Aug 21 · 10:20 AM",
      color: "bg-primary",
    },
    ...(paymentIsPaid
      ? [
          {
            title: "Payment received",
            time: "Aug 21 · 10:24 AM",
            color: "bg-success",
          },
        ]
      : []),
    {
      title: "Hostés assigned",
      time: "Aug 21 · 11:05 AM",
      color: "bg-success",
    },
    ...(bookingStatus === "Confirmed" || bookingStatus === "Completed"
      ? [
          {
            title:
              bookingStatus === "Completed"
                ? "Booking completed"
                : "Booking confirmed",
            time: "Aug 21 · 11:12 AM",
            color: "bg-success",
          },
        ]
      : []),
    ...(bookingStatus === "Cancelled"
      ? [
          {
            title: "Booking cancelled",
            time: "Aug 21 · 11:15 AM",
            color: "bg-destructive",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-xs text-foreground">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-5 py-3 lg:px-8">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-foreground">
            Booking Details
          </h1>
          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Bookings <span className="mx-1">/</span> All Bookings
            <span className="mx-1">/</span>
            <span className="font-semibold text-foreground">{bookingId}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-none border border-border bg-card px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-muted"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>

          <div className="relative w-full sm:w-56 lg:w-64">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Search anything..."
              aria-label="Search anything"
              className="w-full rounded-none border border-input bg-muted py-1.5 pl-9 pr-3 text-xs text-foreground outline-none focus:ring-2 focus:ring-ring/30"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 hover:bg-muted"
          >
            <Bell className="h-4 w-4 text-muted-foreground" />
            <span className="absolute right-0 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-primary text-[8px] font-bold text-primary-foreground">
              12
            </span>
          </button>

          <div className="flex items-center gap-2.5 border-l border-border pl-3">
            <Image
              src="/Image/name.png"
              alt="John Admin"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full border border-border object-cover"
            />
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold text-foreground">John Admin</p>
              <p className="text-[10px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="mx-auto w-full max-w-[1600px] space-y-4 p-4 sm:p-5 lg:space-y-4 lg:p-6">
        <div className="flex items-center justify-between">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 font-semibold text-primary hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Bookings
          </Link>

          <button
            type="button"
            aria-label="More booking options"
            className="border border-border bg-card p-1.5 text-muted-foreground hover:bg-muted"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
        </div>

        {/* BOOKING SUMMARY */}
        <section className={cardStyle}>
          <div className="flex flex-col gap-4 xl:flex-row xl:items-center xl:justify-between">
            <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 sm:gap-x-8">
              <div>
                <p className={labelStyle}>Booking ID</p>
                <p className="mt-1 text-sm font-extrabold text-foreground">
                  {bookingId}
                </p>
              </div>

              <div>
                <p className={labelStyle}>Booking Status</p>
                <span
                  className={`mt-1 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold ${statusStyle[bookingStatus]}`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {bookingStatus}
                </span>
              </div>

              <div>
                <p className={labelStyle}>Payment Status</p>
                <span
                  className={`mt-1 inline-flex items-center gap-1.5 border px-2 py-0.5 text-[11px] font-semibold ${
                    paymentIsPaid
                      ? "border-success/20 bg-success/10 text-success"
                      : "border-warning-border bg-warning-surface text-warning"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {paymentStatus}
                </span>
              </div>

              <div>
                <p className={labelStyle}>Booking Date</p>
                <p className="mt-1 font-semibold text-foreground">
                  August 21, 2026
                </p>
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {bookingStatus !== "Cancelled" &&
                bookingStatus !== "Completed" && (
                  <button
                    type="button"
                    onClick={() => {
                      closeOtherModals();
                      setIsCancelModalOpen(true);
                    }}
                    className="rounded-none border border-destructive/40 bg-card px-5 py-2.5 text-xs font-semibold text-destructive shadow-none hover:bg-destructive/5"
                  >
                    Cancel Booking
                  </button>
                )}

              {bookingStatus === "Pending" && (
                <button
                  type="button"
                  onClick={() => {
                    closeOtherModals();
                    setIsConfirmModalOpen(true);
                  }}
                  className="rounded-none border border-primary bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-none hover:opacity-90"
                >
                  Mark as Completed
                </button>
              )}

              {bookingStatus === "Confirmed" && (
                <button
                  type="button"
                  onClick={() => {
                    closeOtherModals();
                    setIsMarkCompletedModalOpen(true);
                  }}
                  className="rounded-none border border-primary bg-primary px-5 py-2.5 text-xs font-semibold text-primary-foreground shadow-none hover:opacity-90"
                >
                  Mark as Completed
                </button>
              )}
            </div>
          </div>
        </section>

        {/* TWO-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 items-start gap-4 xl:grid-cols-12 xl:gap-4">
          {/* LEFT COLUMN */}
          <div className="min-w-0 space-y-4 xl:col-span-8 xl:space-y-4">
            {/* EVENT INFORMATION */}
            <section className={cardStyle}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                Event Information
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className={labelStyle}>Event Name</p>
                  <p className="mt-1 font-bold text-foreground">
                    Luxury Corporate Dinner
                  </p>
                </div>

                <div>
                  <p className={labelStyle}>Event Type</p>
                  <p className={valueStyle}>Corporate Event</p>
                </div>

                <div>
                  <p className={labelStyle}>Date &amp; Time</p>
                  <p className={valueStyle}>
                    August 28, 2026 – 6:00 PM – 11:00 PM
                  </p>
                </div>

                <div>
                  <p className={labelStyle}>Location</p>
                  <p className={valueStyle}>Eko Hotel &amp; Suites, Lagos</p>
                </div>

                <div>
                  <p className={labelStyle}>Number of Staff</p>
                  <p className="mt-1 font-bold text-foreground">8 Hostés</p>
                </div>

                <div>
                  <p className={labelStyle}>Requested Services</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {["Event Hosting", "Ushering", "Guest Reception"].map(
                      (service) => (
                        <span
                          key={service}
                          className="bg-muted px-2.5 py-1 text-[11px] text-foreground"
                        >
                          {service}
                        </span>
                      ),
                    )}
                  </div>
                </div>
              </div>
            </section>

            {/* ASSIGNED HOSTÉS */}
            <section className={cardStyle}>
              <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
                <div>
                  <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                    Assigned Hostés
                  </h2>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    (2 of 8 Displayed)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(true)}
                  className="px-2 py-1 text-xs font-bold text-primary hover:bg-primary/5"
                >
                  + Reassign Hosté
                </button>
              </div>

              <div className="divide-y divide-border">
                {[
                  {
                    initials: "AO",
                    name: "Amaka Okafor",
                    role: "Event Host",
                    rating: "4.8",
                  },
                  {
                    initials: "BE",
                    name: "Blessing Eze",
                    role: "Usher",
                    rating: "4.9",
                  },
                ].map((hoste) => (
                  <div
                    key={hoste.name}
                    className="flex flex-col gap-3 py-3 sm:flex-row sm:items-center sm:justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-bold text-muted-foreground">
                        {hoste.initials}
                      </div>
                      <div>
                        <p className="font-bold text-foreground">
                          {hoste.name}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {hoste.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span className="inline-flex items-center gap-1 font-semibold text-foreground">
                        <Star className="h-3.5 w-3.5 fill-yellow text-yellow" />
                        {hoste.rating}
                      </span>

                      <span className="border border-success/20 bg-success/10 px-2 py-0.5 text-[11px] font-semibold text-success">
                        Confirmed
                      </span>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-semibold text-primary hover:underline"
                      >
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-border pt-3">
                <Link
                  href={`/bookings/${rawId}/staff`}
                  className="inline-flex flex-wrap items-center gap-1.5 font-semibold text-primary hover:underline"
                >
                  View All 8 Assigned Staff Members
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </section>
          </div>

          {/* RIGHT COLUMN */}
          <aside className="min-w-0 space-y-4 xl:col-span-4 xl:space-y-4">
            {/* CLIENT INFORMATION */}
            <section className={cardStyle}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                Client Information
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className={labelStyle}>Company</p>
                  <p className={valueStyle}>ABC Events Limited</p>
                </div>

                <div className="min-w-0">
                  <p className={labelStyle}>Email</p>
                  <p className="mt-1 break-words text-xs font-semibold text-foreground">
                    john@abcevents.com
                  </p>
                </div>

                <div>
                  <p className={labelStyle}>Contact Person</p>
                  <p className={valueStyle}>John Okafor</p>
                </div>

                <div>
                  <p className={labelStyle}>Phone</p>
                  <p className={valueStyle}>+234 803 000 0000</p>
                </div>
              </div>

              <button
                type="button"
                className="mt-4 inline-flex items-center gap-1.5 border-t border-border pt-3 font-semibold text-primary hover:underline"
              >
                View Client Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </section>

            {/* PAYMENT SUMMARY */}
            <section className={cardStyle}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-foreground">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Booking Amount</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">
                    Hosté Commission (20%)
                  </span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(amount * 0.2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-muted-foreground">Hosté Payout</span>
                  <span className="font-semibold text-foreground">
                    {formatCurrency(amount * 0.8)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-border pt-3">
                  <span className="font-bold text-foreground">Total Paid</span>
                  <span className="text-base font-extrabold text-primary">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-muted-foreground">Payment Method</span>
                  <span className="font-semibold text-foreground">
                    Paystack
                  </span>
                </div>
              </div>

              <Link
                href={`/bookings/${rawId}/payments`}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-border pt-3 font-semibold text-primary hover:underline"
              >
                View Payment Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            {/* BOOKING ACTIVITY */}
            <section className={cardStyle}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-foreground">
                  Booking Activity
                </h2>
                <Link
                  href={`/bookings/${rawId}/activity`}
                  aria-label="View full booking activity"
                  className="p-1 text-muted-foreground hover:bg-muted"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="relative ml-1 space-y-4 border-l border-border pl-4">
                {activity.map((item) => (
                  <div key={item.title} className="relative">
                    <span
                      className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-card ${item.color}`}
                    />
                    <p className="font-semibold text-foreground">
                      {item.title}
                    </p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={`/bookings/${rawId}/activity`}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-border pt-3 font-semibold text-primary hover:underline"
              >
                View Full Activity
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>
          </aside>
        </div>
      </main>

      {/* MODALS */}
      <ReassignHosteModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        bookingId={bookingId}
        onReassign={handleReassign}
      />

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        bookingId={bookingId}
        onConfirmCancel={handleConfirmCancel}
        onKeepBooking={handleKeepBooking}
      />

      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
        bookingId={bookingId}
      />

      <MarkCompletedModal
        isOpen={isMarkCompletedModalOpen}
        onClose={() => setIsMarkCompletedModalOpen(false)}
        onConfirm={handleConfirmCompleted}
        bookingId={bookingId}
      />
    </div>
  );
}
