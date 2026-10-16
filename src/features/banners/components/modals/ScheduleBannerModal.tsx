"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import CancelScheduledBannerModal from "./CancelScheduledBannerModal";

interface ScheduleBannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  startDate?: string;
  endDate?: string;
  placements?: string[];
  targetAudience?: string;
  bannerId?: string;
}

export default function ScheduleBannerModal({
  isOpen,
  onClose,
  onConfirm,
  startDate = "Sep 01, 2026 at 09:00 AM",
  endDate = "Sep 30, 2026 at 11:59 PM",
  placements = ["Homepage", "Customer Dashboard"],
  targetAudience = "Everyone",
  bannerId = "summer-event-staffing-campaign",
}: ScheduleBannerModalProps): React.ReactElement | null {
  const router = useRouter();
  const [isCancelModalOpen, setIsCancelModalOpen] = useState(false);

  if (!isOpen) return null;

  const handleScheduleClick = () => {
    // 1. Run any custom confirm logic passed from parent
    onConfirm();

    // 2. Navigate directly to the Banner Details page
    router.push(`/banners/${bannerId}`);
  };

  const handleConfirmCancelSchedule = () => {
    setIsCancelModalOpen(false);
    onClose(); // Close the parent schedule modal as well
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-[16px] font-[Arial,sans-serif]">
        {/* Modal Container */}
        <div className="w-full max-w-[460px] rounded-[14px] bg-white shadow-xl overflow-hidden animate-in fade-in zoom-in-95 duration-150">
          {/* Header Section */}
          <div className="flex items-center gap-[12px] p-[20px] pb-[16px] border-b border-[#f0f1f4]">
            <div className="flex h-[36px] w-[36px] shrink-0 items-center justify-center rounded-[10px] bg-[#FFFFDC]">
              <div className="h-[14px] w-[14px] rounded-[3px] bg-[#EF5A22]" />
            </div>
            <div>
              <h3 className="text-[15px] font-bold text-[#1A1A1A] leading-[18px]">
                Schedule Banner?
              </h3>
              <p className="text-[9px] text-[#858b98] mt-[1px]">
                Automated Platform Launch Confirmation
              </p>
            </div>
          </div>

          {/* Body Section */}
          <div className="p-[20px] space-y-[14px]">
            <p className="text-[11px] text-[#555b68] leading-[15px]">
              This banner will automatically become active at the scheduled date
              and time across the selected placements.
            </p>

            {/* Details Card */}
            <div className="rounded-[8px] bg-[#f9fafb] border border-[#e8eaf0] p-[12px] space-y-[6px] text-[10px]">
              <div className="flex items-center justify-start gap-[6px]">
                <span className="text-[#858b98] min-w-[100px]">
                  Start Date & Time:
                </span>
                <strong className="text-[#1A1A1A] font-bold">
                  {startDate}
                </strong>
              </div>

              <div className="flex items-center justify-start gap-[6px]">
                <span className="text-[#858b98] min-w-[100px]">
                  End Date & Time:
                </span>
                <strong className="text-[#1A1A1A] font-bold">{endDate}</strong>
              </div>

              <div className="flex items-center justify-start gap-[6px]">
                <span className="text-[#858b98] min-w-[100px]">
                  Placements:
                </span>
                <strong className="text-[#1A1A1A] font-bold">
                  {Array.isArray(placements)
                    ? placements.join(", ")
                    : placements}
                </strong>
              </div>

              <div className="flex items-center justify-start gap-[6px]">
                <span className="text-[#858b98] min-w-[100px]">
                  Target Audience:
                </span>
                <strong className="text-[#1A1A1A] font-bold">
                  {targetAudience}
                </strong>
              </div>
            </div>
          </div>

          {/* Footer Actions Section */}
          <div className="flex items-center justify-end gap-[10px] p-[16px] pt-[8px] border-t border-[#f0f1f4]">
            {/* Cancel Button - Opens CancelScheduledBannerModal */}
            <button
              type="button"
              onClick={() => setIsCancelModalOpen(true)}
              className="h-[34px] rounded-[6px] bg-[#f1f2f5] px-[18px] text-[10px] font-semibold text-[#424854] hover:bg-[#e4e6ea] transition"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleScheduleClick}
              className="h-[34px] rounded-[6px] bg-[#EF5A22] px-[18px] text-[10px] font-bold text-white hover:bg-[#d94d10] transition shadow-sm"
            >
              Schedule Banner
            </button>
          </div>
        </div>
      </div>

      {/* Linked Cancel Scheduled Banner Confirmation Modal */}
      <CancelScheduledBannerModal
        isOpen={isCancelModalOpen}
        onClose={() => setIsCancelModalOpen(false)}
        onConfirm={handleConfirmCancelSchedule}
      />
    </>
  );
}
