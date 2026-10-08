"use client";

import React from "react";
import { X, Check } from "lucide-react";

interface MarkCompletedModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  bookingId: string;
}

export default function MarkCompletedModal({
  isOpen,
  onClose,
  onConfirm,
  bookingId,
}: MarkCompletedModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4 font-sans text-slate-900"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-lg bg-white p-6 shadow-xl border border-slate-100"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
            onClose();
          }}
          className="absolute right-5 top-5 text-slate-400 hover:text-slate-600 transition-colors"
          aria-label="Close modal"
        >
          <X className="h-6 w-6 stroke-[1.75]" />
        </button>

        {/* Icon */}
        <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-[#E6F0EB]">
          <Check className="h-6 w-6 text-[#006837] stroke-[2.5]" />
        </div>

        {/* Title */}
        <h2 className="text-2xl font-bold tracking-tight text-slate-900">
          Mark booking as completed?
        </h2>

        {/* Description */}
        <p className="mt-2 text-base leading-relaxed text-slate-600">
          You’re about to mark booking{" "}
          <span className="font-bold text-slate-900">{bookingId}</span> as
          completed. This will close the booking and record it as successfully
          fulfilled.
        </p>

        {/* Booking details */}
        <div className="mt-6 border border-slate-200/80 bg-slate-50/50 p-4">
          <div className="grid grid-cols-2 gap-y-4">
            <div>
              <p className="text-xs font-medium text-slate-500">Booking ID</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                {bookingId}
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Event</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                Luxury Corporate Dinner
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">Date</p>
              <p className="mt-1 text-sm font-bold text-slate-900">
                August 28, 2026
              </p>
            </div>

            <div>
              <p className="text-xs font-medium text-slate-500">
                Assigned Hostés
              </p>
              <p className="mt-1 text-sm font-bold text-slate-900">8 Hostés</p>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-8 flex justify-end gap-3">
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onClose();
            }}
            className="border border-slate-300 bg-white px-6 py-3 text-sm font-semibold text-slate-800 cursor-pointer transition-colors hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 active:bg-slate-100"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              onConfirm();
            }}
            className="bg-[#EF5A22] px-6 py-3 text-sm font-semibold text-white shadow-sm cursor-pointer transition-colors hover:bg-[#d84d1a] focus:outline-none focus:ring-2 focus:ring-[#EF5A22] focus:ring-offset-2 active:bg-[#c44315]"
          >
            Mark as Completed
          </button>
        </div>
      </div>
    </div>
  );
}
