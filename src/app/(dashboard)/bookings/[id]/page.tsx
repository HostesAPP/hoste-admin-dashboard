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

import ReassignHosteModal from "@/components/modals/ReassignHosteModal";
import CancelBookingModal from "@/components/modals/CancelBookingModal";
import ConfirmBookingModal from "@/components/modals/ConfirmBookingModal";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function BookingDetailPage({ params }: PageProps) {
  // Unwrap params
  const resolvedParams = React.use(params);

  const rawId = resolvedParams?.id || "BK-10482";

  const bookingId = rawId.startsWith("#") ? rawId : `#${rawId}`;

  const [isReassignModalOpen, setIsReassignModalOpen] = useState(false);
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const handleReassign = (selectedHosteId: string) => {
    console.log("Reassigning to hosté ID:", selectedHosteId);
    // Add API update logic here
    setIsReassignModalOpen(false);
  };

  const handleConfirmCancel = (reason: string, notes: string) => {
    console.log("Cancelling booking:", {
      bookingId: rawId,
      reason,
      notes,
    });
    setIsCancelModalOpen(false);
  };

  const handleKeepBooking = () => {
    console.log("Keeping booking:", rawId);
    setIsCancelModalOpen(false);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmBooking = () => {
    console.log("Booking confirmed:", rawId);
    setIsConfirmModalOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#F8F9FA] text-[#333333] font-sans text-xs">
      <header className="bg-white border-b border-gray-200 px-8 py-3 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-bold text-slate-900 tracking-tight">
            Booking Details
          </h1>

          <p className="text-[11px] text-gray-400 mt-0.5">
            Bookings <span className="mx-1">/</span> All Bookings{" "}
            <span className="mx-1">/</span>{" "}
            <span className="font-semibold text-slate-700">{bookingId}</span>
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 border border-gray-200 bg-white px-3.5 py-1.5 rounded-md text-xs font-medium text-slate-600 hover:bg-gray-50">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter</span>
          </button>

          <div className="relative w-72">
            <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />

            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#F3F4F6] text-xs rounded-md focus:outline-none placeholder-gray-400 text-slate-800"
            />
          </div>

          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-600" />

            <span className="absolute -top-1 -right-1 bg-[#EF5A22] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              12
            </span>
          </div>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-gray-200">
            <Image
              src="/Image/name.png"
              alt="John Admin Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900">John Admin</p>

              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 space-y-4 max-w-[1400px] mx-auto">
        <div className="flex items-center justify-between">
          <Link
            href="/bookings"
            className="inline-flex items-center space-x-1 text-[#EF5A22] font-bold text-xs hover:underline"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Back to Bookings</span>
          </Link>

          <button className="p-1.5 border border-gray-200 rounded-md bg-white text-gray-500 hover:bg-gray-50">
            <MoreHorizontal className="w-4 h-4" />
          </button>
        </div>

        <div className="bg-white border border-gray-200 p-5 flex items-center justify-between shadow-xs">
          <div className="flex items-center space-x-12">
            <div>
              <p className="text-[10px] text-gray-400 font-medium">
                Booking ID
              </p>

              <p className="text-lg font-black text-slate-900 mt-0.5">
                {bookingId}
              </p>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-medium">
                Booking Status
              </p>

              <div className="mt-1">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[11px] font-semibold bg-[#E6F0EB] text-[#006837] border border-[#B3D4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                  <span>Confirmed</span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-medium">
                Payment Status
              </p>

              <div className="mt-1">
                <span className="inline-flex items-center space-x-1 px-2.5 py-0.5 text-[11px] font-semibold bg-[#E6F0EB] text-[#006837] border border-[#B3D4C4]">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#006837]" />
                  <span>Paid</span>
                </span>
              </div>
            </div>

            <div>
              <p className="text-[10px] text-gray-400 font-medium">
                Booking Date
              </p>

              <p className="text-xs font-semibold text-slate-800 mt-1">
                August 21, 2026
              </p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="px-4 py-2 border border-[#FCA5A5] text-[#DC2626] font-semibold bg-white hover:bg-red-50 text-xs transition"
            >
              Cancel Booking
            </button>

            <button
              type="button"
              className="px-4 py-2 bg-[#EF5A22] text-white font-semibold hover:bg-[#d84d1a] text-xs transition"
            >
              Mark as Completed
            </button>
          </div>
        </div>

        <div className="grid grid-cols-12 gap-5">
          <div className="col-span-8 space-y-5">
            <div className="bg-white border border-gray-200 p-6 shadow-xs">
              <h2 className="text-sm font-bold text-slate-900 mb-5">
                Event Information
              </h2>

              <div className="grid grid-cols-2 gap-y-5 gap-x-8">
                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Event Name
                  </p>

                  <p className="text-xs font-bold text-slate-900 mt-1">
                    Luxury Corporate Dinner
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Event Type
                  </p>

                  <p className="text-xs font-medium text-slate-800 mt-1">
                    Corporate Event
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Date & Time
                  </p>

                  <p className="text-xs font-medium text-slate-800 mt-1">
                    August 28, 2026 &nbsp;; &nbsp;6:00 PM – 11:00 PM
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Location
                  </p>

                  <p className="text-xs font-medium text-slate-800 mt-1">
                    Eko Hotel & Suites, Lagos
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Number of Staff
                  </p>

                  <p className="text-xs font-bold text-slate-900 mt-1">
                    8 Hostés
                  </p>
                </div>

                <div>
                  <p className="text-[10px] text-gray-400 font-medium">
                    Requested Services
                  </p>

                  <div className="flex flex-wrap gap-1.5 mt-1.5">
                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-slate-700 text-[10px] font-medium">
                      Event Hosting
                    </span>

                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-slate-700 text-[10px] font-medium">
                      Ushering
                    </span>

                    <span className="px-2.5 py-1 bg-[#F3F4F6] text-slate-700 text-[10px] font-medium">
                      Guest Reception
                    </span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-white border border-gray-200 p-6 shadow-xs">
              <div className="flex items-center justify-between mb-5">
                <div className="flex items-center space-x-2">
                  <h2 className="text-sm font-bold text-slate-900">
                    Assigned Hostés
                  </h2>

                  <span className="text-xs font-normal text-gray-400">
                    (2 of 8 Displayed)
                  </span>
                </div>

                <button
                  type="button"
                  onClick={() => setIsReassignModalOpen(true)}
                  className="text-[#EF5A22] font-bold text-xs hover:underline"
                >
                  + Reassign Hosté
                </button>
              </div>

              <div className="divide-y divide-gray-100">
                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#E2E8F0] text-slate-600 font-bold flex items-center justify-center text-xs">
                      AO
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        Amaka Okafor
                      </p>

                      <p className="text-[10px] text-gray-400">Event Host</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 text-slate-700 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>4.8</span>
                    </div>

                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-[#E6F0EB] text-[#006837] border border-[#B3D4C4]">
                      Confirmed
                    </span>

                    <button className="text-[#EF5A22] font-bold text-xs hover:underline flex items-center space-x-0.5">
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <div className="py-3 flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <div className="w-9 h-9 rounded-full bg-[#E2E8F0] text-slate-600 font-bold flex items-center justify-center text-xs">
                      BE
                    </div>

                    <div>
                      <p className="font-bold text-slate-900 text-xs">
                        Blessing Eze
                      </p>

                      <p className="text-[10px] text-gray-400">Usher</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-1 text-slate-700 font-bold text-xs">
                      <Star className="w-3.5 h-3.5 fill-[#F59E0B] text-[#F59E0B]" />
                      <span>4.9</span>
                    </div>

                    <span className="px-2.5 py-0.5 text-[10px] font-semibold bg-[#E6F0EB] text-[#006837] border border-[#B3D4C4]">
                      Confirmed
                    </span>

                    <button className="text-[#EF5A22] font-bold text-xs hover:underline flex items-center space-x-0.5">
                      <span>View Profile</span>
                      <ArrowRight className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>

              <div className="mt-4 pt-2">
                <Link
                  href={`/bookings/${rawId}/staff`}
                  className="text-[#EF5A22] font-bold text-xs hover:underline inline-flex items-center space-x-1"
                >
                  <span>View All 8 Assigned Staff Members</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>

          <div className="col-span-4 space-y-5">
            <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900">
                Client Information
              </h2>

              <div className="space-y-3">
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Company
                    </p>

                    <p className="font-bold text-slate-900 text-xs mt-0.5">
                      ABC Events Limited
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Email
                    </p>

                    <p className="text-slate-800 font-medium text-xs mt-0.5 truncate">
                      john@abcevents.com
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Contact Person
                    </p>

                    <p className="font-medium text-slate-800 text-xs mt-0.5">
                      John Okafor
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] text-gray-400 font-medium">
                      Phone
                    </p>

                    <p className="text-slate-800 font-medium text-xs mt-0.5">
                      +234 803 000 0000
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <button className="text-[#EF5A22] font-bold text-xs hover:underline flex items-center space-x-1">
                  <span>View Client Profile</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            </div>

            {/* Payment Summary */}

            <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-3">
              <h2 className="text-sm font-bold text-slate-900 mb-2">
                Payment Summary
              </h2>

              <div className="space-y-2 text-xs">
                <div className="flex justify-between text-gray-500">
                  <span>Booking Amount</span>
                  <span className="font-bold text-slate-900">₦250,000</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Hosté Commission (20%)</span>
                  <span className="font-bold text-slate-900">₦50,000</span>
                </div>

                <div className="flex justify-between text-gray-500">
                  <span>Hosté Payout</span>
                  <span className="font-bold text-slate-900">₦200,000</span>
                </div>

                <div className="pt-2 border-t border-gray-100 flex justify-between items-baseline">
                  <span className="font-bold text-slate-900 text-sm">
                    Total Paid
                  </span>

                  <span className="font-black text-[#EF5A22] text-base">
                    ₦250,000
                  </span>
                </div>

                <div className="flex justify-between text-gray-400 text-[11px]">
                  <span>Payment Method</span>

                  <span className="font-semibold text-slate-700">Paystack</span>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/bookings/${rawId}/payments`}
                  className="inline-flex items-center space-x-1 text-[#EF5A22] font-bold text-xs hover:underline"
                >
                  <span>View Payment Details</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>

            {/* Booking Activity */}

            <div className="bg-white border border-gray-200 p-6 shadow-xs space-y-4">
              <h2 className="text-sm font-bold text-slate-900">
                Booking Activity
              </h2>

              <div className="relative pl-4 border-l border-gray-200 space-y-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#EF5A22]" />

                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800">
                      Booking created
                    </span>

                    <span className="text-[10px] text-gray-400">
                      Aug 21 - 10:20 AM
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#006837]" />

                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800">
                      Payment received
                    </span>

                    <span className="text-[10px] text-gray-400">
                      Aug 21 - 10:24 AM
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#006837]" />

                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800">
                      Hostés assigned
                    </span>

                    <span className="text-[10px] text-gray-400">
                      Aug 21 - 11:05 AM
                    </span>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#006837]" />

                  <div className="flex justify-between items-start">
                    <span className="font-semibold text-slate-800">
                      Booking confirmed
                    </span>

                    <span className="text-[10px] text-gray-400">
                      Aug 21 - 11:12 AM
                    </span>
                  </div>
                </div>
              </div>

              <div className="pt-2">
                <Link
                  href={`/bookings/${rawId}/activity`}
                  className="inline-flex items-center space-x-1 text-[#EF5A22] font-bold text-xs hover:underline"
                >
                  <span>View Full Activity</span>
                  <ArrowRight className="w-3 h-3" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* =========================
          REASSIGN MODAL
      ========================== */}

      <ReassignHosteModal
        isOpen={isReassignModalOpen}
        onClose={() => setIsReassignModalOpen(false)}
        bookingId={bookingId}
        onReassign={handleReassign}
      />

      {/* =========================
          CANCEL BOOKING MODAL
      ========================== */}

      <CancelBookingModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        bookingId={bookingId}
        onConfirmCancel={handleConfirmCancel}
        onKeepBooking={handleKeepBooking}
      />

      {/* =========================
          CONFIRM BOOKING MODAL
      ========================== */}

      <ConfirmBookingModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmBooking}
      />
    </div>
  );
}
