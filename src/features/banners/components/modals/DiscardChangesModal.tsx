"use client";

import React from "react";

interface DiscardChangesModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DiscardChangesModal({
  isOpen,
  onClose,
  onConfirm,
}: DiscardChangesModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] font-[Arial,sans-serif]">
      {/* Modal Container */}
      <div className="w-full max-w-[460px] rounded-[16px] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Section */}
        <div className="flex items-center gap-[12px] p-[20px] pb-[16px] border-b border-[#f0f1f4]">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#FFFFDC]">
            <span className="text-[16px] font-bold text-[#b45309]">!</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-[18px]">
              Discard Changes?
            </h3>
            <p className="text-[9px] text-[#858b98] mt-[1px]">
              Unsaved Work Warning
            </p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-[20px] space-y-[14px]">
          <p className="text-[11px] text-[#555b68] leading-[16px]">
            You have unsaved changes in this banner creation form.
            <br />
            Are you sure you want to leave without saving your draft?
          </p>

          {/* Warning Banner Card */}
          <div className="rounded-[8px] bg-[#FFFFDC]/60 border border-[#fef08a] p-[12px] space-y-[4px]">
            <div className="text-[10px] font-bold text-[#78350f]">Warning:</div>
            <div className="text-[9.5px] text-[#a16207] leading-[14px]">
              All entered text fields, schedule dates, and uploaded image will
              be lost.
            </div>
          </div>
        </div>

        {/* Footer Actions Section */}
        <div className="flex items-center justify-end gap-[10px] p-[16px] border-t border-[#f0f1f4]">
          <button
            onClick={onClose}
            className="h-[34px] rounded-[6px] bg-[#EF5A22] px-[18px] text-[10px] font-bold text-white hover:bg-[#d94d10] transition shadow-sm"
          >
            Keep Editing
          </button>
          <button
            onClick={onConfirm}
            className="h-[34px] rounded-[6px] bg-[#f1f2f5] border border-[#dfe3ea] px-[18px] text-[10px] font-bold text-[#d92d20] hover:bg-[#fee2e2] hover:border-[#fca5a5] transition"
          >
            Discard Changes
          </button>
        </div>
      </div>
    </div>
  );
}
