"use client";

import React from "react";
import { Clock } from "lucide-react";

interface CancelScheduledBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function CancelScheduledBannerModal({
  isOpen,
  onClose,
  onConfirm,
}: CancelScheduledBannerModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#424548]/80 p-[16px] antialiased font-[Arial,sans-serif]">
      <div className="w-full max-w-[460px] rounded-[16px] bg-white shadow-2xl overflow-hidden text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="flex items-center gap-[12px] border-b border-[#f0f1f4] px-[24px] py-[18px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#fef3c7] text-[#d97706]">
            <Clock size={18} className="text-[#d97706]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-[20px] tracking-[-0.2px] text-[#1A1A1A]">
              Cancel Scheduled Banner?
            </h3>
            <p className="text-[11px] text-[#858b98] font-normal mt-[1px]">
              Future Launch Cancellation
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-[24px] py-[24px] space-y-[16px]">
          <p className="text-[11px] leading-[17px] text-[#555b68]">
            This banner will no longer be automatically published at its
            scheduled time. Its status will revert to Draft.
          </p>
        </div>

        {/* Modal Footer / Actions */}
        <div className="flex items-center justify-end gap-[10px] bg-white px-[24px] pb-[20px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] bg-[#f1f2f5] px-[20px] text-[11px] font-bold text-[#424854] hover:bg-[#e5e7eb] transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="h-[36px] rounded-[8px] bg-[#d97706] px-[20px] text-[11px] font-bold text-white hover:bg-[#b45309] transition shadow-sm"
          >
            Cancel Schedule
          </button>
        </div>
      </div>
    </div>
  );
}
