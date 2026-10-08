"use client";

import React from "react";
import { X } from "lucide-react";

type ConfirmationModalProps = {
  isOpen?: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingId?: string;
};

export default function ConfirmationModal({
  isOpen = false,
  onClose,
  onConfirm,
  bookingId = "#BK-10482",
}: ConfirmationModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4 font-sans text-slate-900">
      {" "}
      <div className="relative w-full max-w-lg border border-slate-100 bg-white p-6 shadow-xl">
        {/* Close Button */}{" "}
        <button
          type="button"
          onClick={onClose}
          className="absolute right-5 top-5 rounded-full p-1 text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-600"
          aria-label="Close modal"
        >
          {" "}
          <X className="h-5 w-5 stroke-[1.75]" />{" "}
        </button>
        {/* Warning Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-amber-50">
          <span className="text-2xl font-semibold text-amber-500">!</span>
        </div>
        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Confirm this booking?
        </h2>
        {/* Description */}
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          You’re about to confirm booking{" "}
          <span className="font-bold text-slate-900">{bookingId}</span> for{" "}
          <span className="font-bold text-slate-900">
            Luxury Corporate Dinner
          </span>
          . The assigned Hostés will be notified and the booking will move to
          Confirmed.
        </p>
        {/* Info Card */}
        <div className="mt-6 rounded-xl border border-slate-200/80 bg-slate-50/50 p-4">
          <div className="grid grid-cols-2 gap-y-4">
            {/* Booking ID */}
            <div>
              <p className="text-xs font-medium text-slate-500">Booking ID</p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                {bookingId}
              </p>
            </div>

            {/* Event */}
            <div>
              <p className="text-xs font-medium text-slate-500">Event</p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                Luxury Corporate Dinner
              </p>
            </div>

            {/* Date */}
            <div>
              <p className="text-xs font-medium text-slate-500">Date</p>

              <p className="mt-1 text-sm font-bold text-slate-900">
                August 28, 2026
              </p>
            </div>

            {/* Assigned Hostés */}
            <div>
              <p className="text-xs font-medium text-slate-500">
                Assigned Hostés
              </p>

              <p className="mt-1 text-sm font-bold text-slate-900">8 Hostés</p>
            </div>
          </div>
        </div>
        {/* Action Buttons */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 transition-colors hover:bg-slate-50"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="rounded-xl bg-[#ea580c] px-6 py-3 text-sm font-semibold text-white shadow-sm transition-colors hover:bg-[#c2410c]"
          >
            Confirm Booking
          </button>
        </div>
      </div>
    </div>
  );
}
