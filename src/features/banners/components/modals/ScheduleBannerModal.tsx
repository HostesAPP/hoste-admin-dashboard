"use client";

import React from "react";

interface ScheduleBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  startDate?: string;
  endDate?: string;
  placements?: string[];
  targetAudience?: string;
}

export default function ScheduleBannerModal({
  isOpen,
  onClose,
  onConfirm,
  startDate = "Sep 01, 2026 at 09:00 AM",
  endDate = "Sep 30, 2026 at 11:59 PM",
  placements = ["Homepage", "Customer Dashboard"],
  targetAudience = "Everyone",
}: ScheduleBannerModalProps): React.ReactElement | null {
  if (!isOpen) return null;

  const handleScheduleClick = () => {
    onConfirm();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] font-[Arial,sans-serif]">
      <div className="w-full max-w-[460px] overflow-hidden rounded-[14px] bg-white shadow-xl animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center gap-[12px] border-b border-[#f0f1f4] p-[20px] pb-[16px]">
          <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#FFFFDC]">
            <div className="h-[14px] w-[14px] rounded-[3px] bg-[#EF5A22]" />
          </div>

          <div>
            <h3 className="text-[15px] font-bold leading-[18px] text-[#1A1A1A]">
              Schedule Banner?
            </h3>
            <p className="mt-[1px] text-[9px] text-[#858b98]">
              Automated Platform Launch Confirmation
            </p>
          </div>
        </div>

        {/* Body */}
        <div className="space-y-[14px] p-[20px]">
          <p className="text-[11px] leading-[15px] text-[#555b68]">
            This banner will automatically become active at the scheduled date
            and time across the selected placements.
          </p>

          {/* Banner Details */}
          <div className="space-y-[6px] rounded-[8px] border border-[#e8eaf0] bg-[#f9fafb] p-[12px] text-[10px]">
            <div className="flex items-start justify-start gap-[6px]">
              <span className="min-w-[100px] text-[#858b98]">
                Start Date &amp; Time:
              </span>
              <strong className="font-bold text-[#1A1A1A]">{startDate}</strong>
            </div>

            <div className="flex items-start justify-start gap-[6px]">
              <span className="min-w-[100px] text-[#858b98]">
                End Date &amp; Time:
              </span>
              <strong className="font-bold text-[#1A1A1A]">{endDate}</strong>
            </div>

            <div className="flex items-start justify-start gap-[6px]">
              <span className="min-w-[100px] text-[#858b98]">Placements:</span>
              <strong className="font-bold text-[#1A1A1A]">
                {placements.join(", ")}
              </strong>
            </div>

            <div className="flex items-start justify-start gap-[6px]">
              <span className="min-w-[100px] text-[#858b98]">
                Target Audience:
              </span>
              <strong className="font-bold text-[#1A1A1A]">
                {targetAudience}
              </strong>
            </div>
          </div>
        </div>

        {/* Footer Actions */}
        <div className="flex items-center justify-end gap-[10px] border-t border-[#f0f1f4] p-[16px] pt-[8px]">
          <button
            type="button"
            onClick={onClose}
            className="h-[34px] rounded-[6px] bg-[#f1f2f5] px-[18px] text-[10px] font-semibold text-[#424854] transition hover:bg-[#e4e6ea]"
          >
            Cancel
          </button>

          <button
            type="button"
            onClick={handleScheduleClick}
            className="h-[34px] rounded-[6px] bg-[#EF5A22] px-[18px] text-[10px] font-bold text-white shadow-sm transition hover:bg-[#d94d10]"
          >
            Schedule Banner
          </button>
        </div>
      </div>
    </div>
  );
}
