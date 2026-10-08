"use client";

import React from "react";
import { X } from "lucide-react";

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  eventName?: string;
  eventDate?: string;
  assignedHostesCount?: number;
  onConfirm: () => void;
}

export default function ConfirmBookingModal({
  isOpen,
  onClose,
  bookingId = "#BK-10482",
  eventName = "Luxury Corporate Dinner",
  eventDate = "August 28, 2026",
  assignedHostesCount = 8,
  onConfirm,
}: ConfirmBookingModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-orange-50 text-lg font-bold text-[#EE6038]">
          !
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Confirm this booking?
        </h2>

        <p className="mt-2 text-xs leading-relaxed text-slate-500">
          You&apos;re about to confirm booking{" "}
          <span className="font-bold text-slate-800">{bookingId}</span> for{" "}
          <span className="font-bold text-slate-800">{eventName}</span>. The
          assigned Hostés will be notified and the booking will move to
          Confirmed.
        </p>

        <div className="mt-5 rounded-xl border border-gray-100 bg-[#F9FAFB] p-4">
          <div className="grid grid-cols-2 gap-x-2 gap-y-4">
            <div>
              <p className="text-[11px] font-medium text-gray-400">
                Booking ID
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {bookingId}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-400">Event</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {eventName}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-400">Date</p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {eventDate}
              </p>
            </div>

            <div>
              <p className="text-[11px] font-medium text-gray-400">
                Assigned Hostés
              </p>
              <p className="mt-0.5 text-xs font-bold text-slate-900">
                {assignedHostesCount} Hostés
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg border border-gray-200 px-6 py-2.5 text-xs font-bold text-slate-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-lg bg-[#EE6038] px-6 py-2.5 text-xs font-bold text-white transition hover:bg-[#d94f29]"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
