"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface ConfirmBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  bookingId?: string;
  eventName?: string;
  eventDate?: string;
  assignedHostesCount?: number;
  onConfirm?: () => void;
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
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[480px] bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 text-gray-400 hover:text-gray-600"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#E6F4EA] text-[#0F9D58]">
          <Check className="h-5 w-5 stroke-[2.5]" />
        </div>

        <h2 className="text-xl font-bold text-slate-900">
          Mark booking as completed?
        </h2>

        <p className="mt-2 text-sm leading-snug text-slate-600">
          You’re about to mark booking{" "}
          <span className="font-bold text-slate-900">{bookingId}</span> as
          completed. This will close the booking and record it as successfully
          fulfilled.
        </p>

        <div className="mt-6 border border-gray-200 bg-[#F8FAFC]/50 p-4">
          <div className="grid grid-cols-2 gap-y-4 gap-x-4">
            <div>
              <p className="text-xs text-slate-400">Booking ID</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {bookingId}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Event</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {eventName}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Date</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {eventDate}
              </p>
            </div>
            <div>
              <p className="text-xs text-slate-400">Assigned Hostés</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {assignedHostesCount} Hostés
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 px-6 py-2.5 text-sm font-medium text-slate-700 hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => {
              if (onConfirm) onConfirm();
              onClose();
            }}
            className="bg-[#E65100] px-6 py-2.5 text-sm font-bold text-white hover:bg-[#cc4700] transition"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
}
