"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  onConfirmCancel: (reason: string, notes: string) => void;
  onKeepBooking?: () => void;
}

const CANCELLATION_REASONS = [
  "Client requested cancellation",
  "Hosté unavailable",
  "Payment issue",
  "Scheduling conflict",
  "Other",
];

export default function CancelBookingModal({
  isOpen,
  onClose,
  bookingId = "#BK-10482",
  onConfirmCancel,
  onKeepBooking,
}: CancelBookingModalProps) {
  const [selectedReason, setSelectedReason] = useState(
    "Client requested cancellation",
  );
  const [notes, setNotes] = useState("");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onConfirmCancel(selectedReason, notes);
  };

  const handleKeepBooking = () => {
    onKeepBooking?.();
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
      {/* Main Container - Border Radius Removed */}
      <div className="relative w-full max-w-[460px] rounded-none bg-white p-7 text-xs font-sans shadow-2xl">
        {/* Close Button */}
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 text-gray-400 transition hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        {/* Warning Icon Badge */}
        <div className="mb-4 flex h-11 w-11 items-center justify-center rounded-full bg-[#FFF1F0] text-base font-bold text-[#D92D20]">
          !
        </div>

        {/* Header */}
        <h2 className="text-lg font-bold text-[#0F172A]">
          Cancel this booking?
        </h2>

        {/* Description */}
        <p className="mt-1.5 leading-relaxed text-slate-600 text-[13px]">
          This action will cancel booking{" "}
          <strong className="font-bold text-slate-900">{bookingId}</strong>.
          Please provide a reason for the cancellation.
        </p>

        {/* Form */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          {/* Radio Options */}
          <div>
            <label className="mb-3 block text-xs font-bold text-[#1E293B]">
              Cancellation reason
            </label>

            <div className="space-y-3">
              {CANCELLATION_REASONS.map((reason) => {
                const isSelected = selectedReason === reason;

                return (
                  <label
                    key={reason}
                    className="flex cursor-pointer select-none items-center space-x-3 text-xs"
                  >
                    <input
                      type="radio"
                      name="cancellationReason"
                      value={reason}
                      checked={isSelected}
                      onChange={(e) => setSelectedReason(e.target.value)}
                      className="hidden"
                    />

                    {/* Radio Custom Circle */}
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border transition-colors ${
                        isSelected
                          ? "border-[#EA580C] bg-white"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-[#EA580C]" />
                      )}
                    </div>

                    <span
                      className={`text-xs ${
                        isSelected
                          ? "font-medium text-[#0F172A]"
                          : "text-[#334155]"
                      }`}
                    >
                      {reason}
                    </span>
                  </label>
                );
              })}
            </div>
          </div>

          {/* Notes Input - Border Radius Removed */}
          <div>
            <label className="mb-2 block text-xs font-bold text-[#1E293B]">
              Additional notes{" "}
              <span className="font-normal text-slate-500">(optional)</span>
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context or specifics for internal audit records..."
              className="w-full resize-none rounded-none border border-gray-200 p-3 text-xs text-slate-800 outline-none placeholder:text-gray-400 focus:border-[#EA580C] focus:ring-1 focus:ring-[#EA580C]"
            />
          </div>

          {/* Subtle Divider */}
          <div className="pt-2 border-t border-gray-100" />

          {/* Footer Buttons */}
          <div className="flex items-center justify-end space-x-3">
            <button
              type="button"
              onClick={handleKeepBooking}
              className="rounded-lg border border-gray-300 bg-white px-5 py-2.5 text-xs font-bold text-[#1E293B] shadow-xs transition hover:bg-gray-50"
            >
              Keep Booking
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#D92D20] px-5 py-2.5 text-xs font-bold text-white shadow-xs transition hover:bg-[#b82418]"
            >
              Cancel Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
