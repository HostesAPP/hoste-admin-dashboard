"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface CancelBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  onConfirmCancel: (reason: string, notes: string) => void;
  onKeepBooking: () => void;
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
    onClose();
    onKeepBooking();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          type="button"
          onClick={onClose}
          aria-label="Close modal"
          className="absolute right-5 top-5 rounded-full p-1 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-lg font-bold text-[#D92D20]">
          !
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Cancel this booking?
        </h2>

        <p className="mt-1 text-sm text-slate-500">
          This action will cancel booking{" "}
          <span className="font-bold text-slate-800">{bookingId}</span>. Please
          provide a reason for the cancellation.
        </p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-5">
          <div>
            <label className="mb-3 block text-sm font-bold text-slate-800">
              Cancellation reason
            </label>

            <div className="space-y-3">
              {CANCELLATION_REASONS.map((reason) => (
                <label
                  key={reason}
                  className="flex cursor-pointer items-center space-x-3 text-sm font-medium text-slate-700"
                >
                  <input
                    type="radio"
                    name="cancellationReason"
                    value={reason}
                    checked={selectedReason === reason}
                    onChange={(e) => setSelectedReason(e.target.value)}
                    className="h-4 w-4 accent-[#EE6038]"
                  />

                  <span>{reason}</span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-sm font-bold text-slate-800">
              Additional notes{" "}
              <span className="font-normal text-slate-400">(optional)</span>
            </label>

            <textarea
              rows={3}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              placeholder="Add context or specifics for internal audit records..."
              className="w-full rounded-none border border-gray-200 p-3 text-sm text-slate-800 outline-none placeholder:text-gray-400 focus:border-[#EE6038]"
            />
          </div>

          <div className="flex items-center justify-end space-x-3 pt-3">
            <button
              type="button"
              onClick={handleKeepBooking}
              className="rounded-lg border border-gray-200 px-5 py-2.5 text-sm font-bold text-slate-700 transition hover:bg-gray-50"
            >
              Keep Booking
            </button>

            <button
              type="submit"
              className="rounded-lg bg-[#D92D20] px-5 py-2.5 text-sm font-bold text-white transition hover:bg-[#b82418]"
            >
              Cancel Booking
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
