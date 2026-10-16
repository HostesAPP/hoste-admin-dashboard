"use client";

import React from "react";

interface RemoveBannerImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  fileName?: string;
  fileSize?: string;
  dimensions?: string;
}

export default function RemoveBannerImageModal({
  isOpen,
  onClose,
  onConfirm,
  fileName = "summer_event_banner_v2.png",
  fileSize = "1.4 MB",
  dimensions = "1200 × 400 px",
}: RemoveBannerImageModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] font-[Arial,sans-serif]">
      {/* Modal Container */}
      <div className="w-full max-w-[460px] rounded-[16px] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header Section */}
        <div className="flex items-center gap-[12px] p-[20px] pb-[16px] border-b border-[#f0f1f4]">
          <div className="flex h-[38px] w-[38px] shrink-0 items-center justify-center rounded-full bg-[#fee2e2]">
            <span className="text-[16px] font-bold text-[#dc2626]">!</span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-[18px]">
              Remove Banner Image?
            </h3>
            <p className="text-[9px] text-[#858b98] mt-[1px]">Asset Deletion</p>
          </div>
        </div>

        {/* Body Section */}
        <div className="p-[20px] space-y-[14px]">
          <p className="text-[11px] text-[#555b68] leading-[15px]">
            The uploaded image file will be permanently removed from this
            banner. You will need to upload a new image before publishing.
          </p>

          {/* File Card Preview */}
          <div className="rounded-[10px] bg-[#f9fafb] border border-[#e8eaf0] p-[12px] flex items-center gap-[12px]">
            <div className="h-[48px] w-[80px] rounded-[6px] bg-[#EF5A22] shrink-0" />

            <div className="space-y-[2px]">
              <div className="text-[11px] font-bold text-[#1A1A1A] truncate max-w-[240px]">
                {fileName}
              </div>
              <div className="text-[9px] text-[#858b98]">
                {fileSize} • {dimensions}
              </div>
            </div>
          </div>
        </div>

        {/* Footer Actions Section */}
        <div className="flex items-center justify-end gap-[10px] p-[16px] border-t border-[#f0f1f4]">
          <button
            onClick={onClose}
            className="h-[34px] rounded-[6px] bg-[#f1f2f5] px-[18px] text-[10px] font-semibold text-[#424854] hover:bg-[#e4e6ea] transition"
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="h-[34px] rounded-[6px] bg-[#d92d20] px-[18px] text-[10px] font-bold text-white hover:bg-[#b82417] transition shadow-sm"
          >
            Remove Image
          </button>
        </div>
      </div>
    </div>
  );
}
