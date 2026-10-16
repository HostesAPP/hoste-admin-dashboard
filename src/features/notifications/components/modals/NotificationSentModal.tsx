"use client";

import React from "react";
import { Check } from "lucide-react";

interface NotificationSentModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function NotificationSentModal({
  isOpen,
  onClose,
}: NotificationSentModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="w-full max-w-[360px] rounded-[28px] bg-white px-6 py-8 text-center shadow-2xl transition-all">
        {/* Success Icon Circle */}
        <div className="mx-auto flex h-20 w-20 items-center justify-center rounded-full bg-[#dcfce7]">
          <Check className="h-9 w-9 text-[#16a34a]" strokeWidth={2.5} />
        </div>

        {/* Heading */}
        <h2 className="mt-6 text-[20px] font-bold text-[#0f172a]">
          Notification Sent!
        </h2>

        {/* Description */}
        <p className="mt-2 text-[13px] leading-[20px] text-[#64748b]">
          Your notification has been sent successfully to the selected audience.
        </p>

        {/* Done Button */}
        <div className="mt-8 flex justify-center">
          <button
            type="button"
            onClick={onClose}
            className="w-[140px] rounded-[12px] bg-[#1e5338] py-3 text-[14px] font-semibold text-white transition hover:bg-[#17422c]"
          >
            Done
          </button>
        </div>
      </div>
    </div>
  );
}
