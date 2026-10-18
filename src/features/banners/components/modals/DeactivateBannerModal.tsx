"use client";

import React from "react";
import { Pause } from "lucide-react";

interface DeactivateBannerModalProps {
  isOpen: boolean;
  bannerTitle?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function DeactivateBannerModal({
  isOpen,
  bannerTitle = "Find the Right Hosté for Your Next Event",
  onClose,
  onConfirm,
}: DeactivateBannerModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#424548]/80 p-[16px] antialiased font-[Arial,sans-serif]">
      <div className="w-full max-w-[460px] rounded-[16px] bg-white shadow-2xl overflow-hidden text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="flex items-center gap-[12px] border-b border-[#f0f1f4] px-[24px] py-[18px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#fcebe9] text-[#78281f]">
            <Pause size={18} fill="#808897" className="text-[#808897]" />
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-[20px] tracking-[-0.2px] text-[#1A1A1A]">
              Deactivate Banner?
            </h3>
            <p className="text-[11px] text-[#858b98] font-normal mt-[1px]">
              Immediate Platform Visibility Pause
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-[24px] py-[20px] space-y-[16px]">
          <p className="text-[11px] leading-[16px] text-[#555b68]">
            This banner will immediately stop appearing to users across all
            assigned platform placements. You can reactivate it anytime later.
          </p>

          {/* Target Banner Info Box */}
          <div className="rounded-[10px] border border-[#eef0f3] bg-[#f8f9fa] p-[12px] space-y-[3px]">
            <span className="text-[9px] font-bold text-[#858b98] uppercase tracking-wider block">
              TARGET BANNER:
            </span>
            <strong className="text-[12px] font-bold text-[#1A1A1A] block">
              {bannerTitle}
            </strong>
          </div>
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
            className="h-[36px] rounded-[8px] bg-[#d92d20] px-[20px] text-[11px] font-bold text-white hover:bg-[#b91c1c] transition shadow-sm"
          >
            Deactivate Banner
          </button>
        </div>
      </div>
    </div>
  );
}
