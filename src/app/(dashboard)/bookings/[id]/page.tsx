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
  "min-w-0 bg-white p-4 lg:p-5 shadow-none border border-gray-200 rounded-none";
const labelStyle = "text-[11px] font-medium text-gray-400";
const valueStyle = "mt-1 text-xs font-semibold text-slate-900";

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
    Pending: "bg-amber-50 text-amber-700 border-amber-200",
    Confirmed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Completed: "bg-emerald-50 text-emerald-700 border-emerald-200",
    Cancelled: "bg-red-50 text-red-700 border-red-200",
  };

  if (!booking) {
    return (
      <div className="flex min-h-screen flex-col items-start justify-center gap-3 bg-[#F8F9FA] p-8 text-sm text-slate-700">
        <h1 className="text-lg font-bold text-slate-900">Booking not found</h1>
        <p>
          No booking was found for ID <strong>{bookingId}</strong>.
        </p>
        <Link
          href="/bookings"
          className="font-semibold text-[#EF5A22] hover:underline"
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
      color: "bg-[#EF5A22]",
    },
    ...(paymentIsPaid
      ? [
          {
            title: "Payment received",
            time: "Aug 21 · 10:24 AM",
            color: "bg-emerald-600",
          },
        ]
      : []),
    {
      title: "Hostés assigned",
      time: "Aug 21 · 11:05 AM",
      color: "bg-emerald-600",
    },
    ...(bookingStatus === "Confirmed" || bookingStatus === "Completed"
      ? [
          {
            title:
              bookingStatus === "Completed"
                ? "Booking completed"
                : "Booking confirmed",
            time: "Aug 21 · 11:12 AM",
            color: "bg-emerald-600",
          },
        ]
      : []),
    ...(bookingStatus === "Cancelled"
      ? [
          {
            title: "Booking cancelled",
            time: "Aug 21 · 11:15 AM",
            color: "bg-red-500",
          },
        ]
      : []),
  ];

  return (
    <div className="min-h-screen bg-[#F8F9FA] font-sans text-xs text-[#333333]">
      {/* HEADER */}
      <header className="sticky top-0 z-30 flex flex-wrap items-center justify-between gap-4 border-b border-gray-200 bg-white px-5 py-3 lg:px-8">
        <div>
          <h1 className="text-lg font-bold tracking-tight text-slate-900">
            Booking Details
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-400">
            Bookings <span className="mx-1">/</span> All Bookings
            <span className="mx-1">/</span>
            <span className="font-semibold text-slate-700">{bookingId}</span>
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-none border border-gray-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 hover:bg-gray-50"
          >
            <SlidersHorizontal className="h-3.5 w-3.5" />
            Filter
          </button>

          <div className="relative w-full sm:w-56 lg:w-64">
            <Search className="absolute left-3 top-2 h-3.5 w-3.5 text-gray-400" />
            <input
              type="search"
              placeholder="Search anything..."
              aria-label="Search anything"
              className="w-full rounded-none bg-[#F3F4F6] py-1.5 pl-9 pr-3 text-xs text-slate-800 outline-none focus:ring-2 focus:ring-orange-200"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1.5 hover:bg-gray-50"
          >
            <Bell className="h-4 w-4 text-gray-600" />
            <span className="absolute right-0 top-0 flex h-3.5 w-3.5 items-center justify-center rounded-full bg-[#EF5A22] text-[8px] font-bold text-white">
              12
            </span>
          </button>

          <div className="flex items-center gap-2.5 border-l border-gray-200 pl-3">
            <Image
              src="/Image/name.png"
              alt="John Admin"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />
            <div className="hidden leading-tight sm:block">
              <p className="text-xs font-bold text-slate-900">John Admin</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      {/* PAGE CONTENT */}
      <main className="mx-auto w-full max-w-[1600px] space-y-4 p-4 sm:p-5 lg:space-y-4 lg:p-6">
        <div className="flex items-center justify-between">
          <Link
            href="/bookings"
            className="inline-flex items-center gap-1.5 font-semibold text-[#EF5A22] hover:underline"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            Back to Bookings
          </Link>

          <button
            type="button"
            aria-label="More booking options"
            className="border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50"
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
                <p className="mt-1 text-sm font-extrabold text-slate-900">
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
                      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                      : "border-amber-200 bg-amber-50 text-amber-700"
                  }`}
                >
                  <span className="h-1.5 w-1.5 rounded-full bg-current" />
                  {paymentStatus}
                </span>
              </div>

              <div>
                <p className={labelStyle}>Booking Date</p>
                <p className="mt-1 font-semibold text-slate-800">
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
                    className="rounded-none border border-red-300 bg-white px-5 py-2.5 text-xs font-semibold text-[#EF5A22] shadow-none hover:bg-red-50"
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
                  className="rounded-none border border-[#EF5A22] bg-[#EF5A22] px-5 py-2.5 text-xs font-semibold text-white shadow-none hover:bg-[#D94B18]"
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
                  className="rounded-none border border-[#EF5A22] bg-[#EF5A22] px-5 py-2.5 text-xs font-semibold text-white shadow-none hover:bg-[#D94B18]"
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
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                Event Information
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className={labelStyle}>Event Name</p>
                  <p className="mt-1 font-bold text-slate-900">
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
                  <p className="mt-1 font-bold text-slate-900">8 Hostés</p>
                </div>

                <div>
                  <p className={labelStyle}>Requested Services</p>
                  <div className="mt-1.5 flex flex-wrap gap-1.5">
                    {["Event Hosting", "Ushering", "Guest Reception"].map(
                      (service) => (
                        <span
                          key={service}
                          className="bg-gray-100 px-2.5 py-1 text-[11px] text-slate-700"
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
                  <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                    Assigned Hostés
                  </h2>
                  <p className="mt-0.5 text-[11px] text-gray-400">
                    (2 of 8 Displayed)
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(true)}
                  className="px-2 py-1 text-xs font-bold text-[#EF5A22] hover:bg-orange-50"
                >
                  + Reassign Hosté
                </button>
              </div>

              <div className="divide-y divide-gray-100">
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
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-slate-100 text-xs font-bold text-slate-600">
                        {hoste.initials}
                      </div>
                      <div>
                        <p className="font-bold text-slate-900">{hoste.name}</p>
                        <p className="text-[11px] text-gray-400">
                          {hoste.role}
                        </p>
                      </div>
                    </div>

                    <div className="flex flex-wrap items-center gap-3 sm:justify-end">
                      <span className="inline-flex items-center gap-1 font-semibold text-slate-700">
                        <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
                        {hoste.rating}
                      </span>

                      <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[11px] font-semibold text-emerald-700">
                        Confirmed
                      </span>

                      <button
                        type="button"
                        className="inline-flex items-center gap-1 font-semibold text-[#EF5A22] hover:underline"
                      >
                        View Profile
                        <ArrowRight className="h-3.5 w-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-3 border-t border-gray-100 pt-3">
                <Link
                  href={`/bookings/${rawId}/staff`}
                  className="inline-flex flex-wrap items-center gap-1.5 font-semibold text-[#EF5A22] hover:underline"
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
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                Client Information
              </h2>

              <div className="grid grid-cols-1 gap-x-6 gap-y-4 sm:grid-cols-2">
                <div>
                  <p className={labelStyle}>Company</p>
                  <p className={valueStyle}>ABC Events Limited</p>
                </div>

                <div className="min-w-0">
                  <p className={labelStyle}>Email</p>
                  <p className="mt-1 break-words text-xs font-semibold text-slate-900">
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
                className="mt-4 inline-flex items-center gap-1.5 border-t border-gray-100 pt-3 font-semibold text-[#EF5A22] hover:underline"
              >
                View Client Profile
                <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </section>

            {/* PAYMENT SUMMARY */}
            <section className={cardStyle}>
              <h2 className="mb-4 text-xs font-bold uppercase tracking-wider text-slate-900">
                Payment Summary
              </h2>

              <div className="space-y-3">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Booking Amount</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Hosté Commission (20%)</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(amount * 0.2)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3">
                  <span className="text-gray-500">Hosté Payout</span>
                  <span className="font-semibold text-slate-900">
                    {formatCurrency(amount * 0.8)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 border-t border-gray-100 pt-3">
                  <span className="font-bold text-slate-900">Total Paid</span>
                  <span className="text-base font-extrabold text-[#EF5A22]">
                    {formatCurrency(amount)}
                  </span>
                </div>

                <div className="flex items-center justify-between gap-3 text-xs">
                  <span className="text-gray-400">Payment Method</span>
                  <span className="font-semibold text-slate-700">Paystack</span>
                </div>
              </div>

              <Link
                href={`/bookings/${rawId}/payments`}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-gray-100 pt-3 font-semibold text-[#EF5A22] hover:underline"
              >
                View Payment Details
                <ArrowRight className="h-3.5 w-3.5" />
              </Link>
            </section>

            {/* BOOKING ACTIVITY */}
            <section className={cardStyle}>
              <div className="mb-4 flex items-center justify-between gap-3">
                <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900">
                  Booking Activity
                </h2>
                <Link
                  href={`/bookings/${rawId}/activity`}
                  aria-label="View full booking activity"
                  className="p-1 text-gray-500 hover:bg-gray-100"
                >
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>

              <div className="relative ml-1 space-y-4 border-l border-gray-200 pl-4">
                {activity.map((item) => (
                  <div key={item.title} className="relative">
                    <span
                      className={`absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full border-2 border-white ${item.color}`}
                    />
                    <p className="font-semibold text-slate-800">{item.title}</p>
                    <p className="mt-0.5 text-[11px] text-gray-400">
                      {item.time}
                    </p>
                  </div>
                ))}
              </div>

              <Link
                href={`/bookings/${rawId}/activity`}
                className="mt-4 inline-flex items-center gap-1.5 border-t border-gray-100 pt-3 font-semibold text-[#EF5A22] hover:underline"
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
