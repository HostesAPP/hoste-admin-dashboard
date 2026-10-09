"use client";

import React from "react";
import { AlertTriangle } from "lucide-react";

interface DeleteModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeleteConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
}: DeleteModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      {/* Modal Container */}
      <div className="w-full max-w-[420px] rounded-[28px] bg-white p-8 text-center shadow-xl transition-all">
        {/* Yellow Circle Icon Container */}
        <div className="mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full bg-[#FEF9C3]">
          <AlertTriangle className="h-9 w-9 text-[#D97706]" size={36} />
        </div>

        {/* Title */}
        <h2 className="text-lg font-bold text-[#111827]">
          Delete Notification
        </h2>

        {/* Subtitle / Description */}
        <p className="mt-3 text-sm leading-relaxed text-[#6B7280]">
          Are you sure you want to delete this notification?
          <br />
          This action cannot be undone.
        </p>

        {/* Buttons Group */}
        <div className="mt-8 flex items-center justify-center gap-4">
          <button
            type="button"
            onClick={onClose}
            className="flex-1 rounded-[14px] border border-[#E5E7EB] bg-white py-3 text-xs font-semibold text-[#374151] transition hover:bg-gray-50 focus:outline-none"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={onConfirm}
            className="flex-1 rounded-[14px] bg-[#EF4444] py-3 text-xs font-semibold text-white transition hover:bg-[#DC2626] focus:outline-none"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
