"use client";

import React from "react";
import { FileText } from "lucide-react";

interface SavedAsDraftModalProps {
  isOpen: boolean;
  onClose: () => void;
  onViewDrafts?: () => void;
}

export default function SavedAsDraftModal({
  isOpen,
  onClose,
  onViewDrafts,
}: SavedAsDraftModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[380px] rounded-[28px] bg-white px-6 py-8 text-center shadow-2xl transition-all">
        {/* Amber Icon Circle */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#fef3c7]">
          <FileText className="h-9 w-9 text-[#d97706]" strokeWidth={2} />
        </div>

        {/* Title */}
        <h2 className="mt-6 text-[20px] font-bold text-[#0f172a]">
          Saved as Draft
        </h2>

        {/* Message Body */}
        <p className="mt-2 text-[13px] leading-[20px] text-[#64748b]">
          Your notification has been saved <br /> as draft successfully.
        </p>

        {/* Action Buttons */}
        <div className="mt-7 flex flex-col items-center gap-3">
          {/* View Drafts Button */}
          <button
            type="button"
            onClick={onViewDrafts}
            className="w-[200px] rounded-[12px] border border-[#d97706] bg-white py-3 text-[14px] font-semibold text-[#d97706] transition hover:bg-[#fffbe2]"
          >
            View Drafts
          </button>

          {/* Cancel Button */}
          <button
            type="button"
            onClick={onClose}
            className="w-[160px] rounded-[12px] border border-[#cbd5e1] bg-white py-2.5 text-[13px] font-medium text-[#475569] transition hover:bg-[#f8fafc]"
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}
