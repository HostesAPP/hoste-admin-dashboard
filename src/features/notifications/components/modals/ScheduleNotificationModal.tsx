"use client";

import React, { useState } from "react";
import { X } from "lucide-react";

interface ScheduleNotificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSchedule?: (date: string, time: string) => void;
}

export default function ScheduleNotificationModal({
  isOpen,
  onClose,
  onSchedule,
}: ScheduleNotificationModalProps) {
  const [date, setDate] = useState("Aug 6, 2026");
  const [time, setTime] = useState("10:00 AM");

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onSchedule) {
      onSchedule(date, time);
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4">
      <div className="relative w-full max-w-[380px] rounded-[28px] bg-white p-7 shadow-2xl transition-all">
        {/* Header */}
        <div className="flex items-center justify-between">
          <h2 className="text-[18px] font-bold text-[#0f172a]">
            Schedule Notification
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full p-1 text-[#94a3b8] hover:bg-[#f1f5f9] hover:text-[#64748b] transition"
            aria-label="Close modal"
          >
            <X size={20} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          {/* Date Input */}
          <div>
            <label className="block text-[13px] font-medium text-[#475569] mb-1.5">
              Date
            </label>
            <input
              type="text"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              placeholder="Aug 6, 2026"
              className="w-full rounded-[14px] border border-[#cbd5e1] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#E04F16] focus:ring-1 focus:ring-[#E04F16]"
            />
          </div>

          {/* Time Input */}
          <div>
            <label className="block text-[13px] font-medium text-[#475569] mb-1.5">
              Time
            </label>
            <input
              type="text"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              placeholder="10:00 AM"
              className="w-full rounded-[14px] border border-[#cbd5e1] px-4 py-3 text-[14px] text-[#0f172a] outline-none transition focus:border-[#E04F16] focus:ring-1 focus:ring-[#E04F16]"
            />
          </div>

          {/* Action Buttons */}
          <div className="pt-6 flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-[14px] border border-[#cbd5e1] bg-white py-3 text-[14px] font-semibold text-[#475569] transition hover:bg-[#f8fafc]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 rounded-[14px] bg-[#FF4500] py-3 text-[14px] font-semibold text-white transition hover:bg-[#e03e00]"
            >
              Schedule
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
