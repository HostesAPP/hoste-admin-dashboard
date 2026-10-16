"use client";

import React from "react";
import { Play } from "lucide-react";

interface ActivateBannerModalProps {
  isOpen: boolean;
  placements?: string;
  audience?: string;
  startDate?: string;
  endDate?: string;
  onClose: () => void;
  onConfirm: () => void;
}

export default function ActivateBannerModal({
  isOpen,
  placements = "Homepage, Customer Dashboard",
  audience = "Customers",
  startDate = "August 20, 2026 at 9:00 AM",
  endDate = "September 20, 2026 at 11:59 PM",
  onClose,
  onConfirm,
}: ActivateBannerModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-[#424548]/80 p-[16px] antialiased font-[Arial,sans-serif]">
      <div className="w-full max-w-[460px] rounded-[16px] bg-white shadow-2xl overflow-hidden text-[#1A1A1A]">
        {/* Modal Header */}
        <div className="flex items-center gap-[12px] border-b border-[#f0f1f4] px-[24px] py-[18px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-full bg-[#e6f4ea] text-[#137333]">
            <Play
              size={16}
              fill="#137333"
              className="text-[#137333] ml-[1px]"
            />
          </div>
          <div>
            <h3 className="text-[16px] font-bold leading-[20px] tracking-[-0.2px] text-[#1A1A1A]">
              Activate Banner?
            </h3>
            <p className="text-[11px] text-[#858b98] font-normal mt-[1px]">
              Set Banner Live
            </p>
          </div>
        </div>

        {/* Modal Body */}
        <div className="px-[24px] py-[20px] space-y-[16px]">
          <p className="text-[11px] leading-[16px] text-[#555b68]">
            This banner will become visible to its selected audience according
            to its placement and scheduling configurations.
          </p>

          {/* Details Container */}
          <div className="rounded-[10px] border border-[#eef0f3] bg-[#f8f9fa] p-[14px] space-y-[6px] text-[11px]">
            <div>
              <span className="text-[#858b98]">Placements:</span>{" "}
              <strong className="text-[#1A1A1A] font-bold">{placements}</strong>
            </div>
            <div>
              <span className="text-[#858b98]">Audience:</span>{" "}
              <strong className="text-[#1A1A1A] font-bold">{audience}</strong>
            </div>
            <div>
              <span className="text-[#858b98]">Start Date:</span>{" "}
              <strong className="text-[#1A1A1A] font-bold">{startDate}</strong>
            </div>
            <div>
              <span className="text-[#858b98]">End Date:</span>{" "}
              <strong className="text-[#1A1A1A] font-bold">{endDate}</strong>
            </div>
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
            className="h-[36px] rounded-[8px] bg-[#1b733b] px-[20px] text-[11px] font-bold text-white hover:bg-[#155d2f] transition shadow-sm"
          >
            Activate Banner
          </button>
        </div>
      </div>
    </div>
  );
}
