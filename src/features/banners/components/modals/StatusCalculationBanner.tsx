"use client";

import React from "react";

interface StatusCalculationBannerProps {
  status?: "SCHEDULED" | "ACTIVE" | "EXPIRED" | "DRAFT";
  launchDate?: string;
}

export default function StatusCalculationBanner({
  status = "SCHEDULED",
  launchDate = "Sep 1, 2026",
}: StatusCalculationBannerProps): React.ReactElement {
  return (
    <div className="flex items-center justify-between rounded-[10px] bg-[#f0f5ff] border border-[#d6e4ff] px-[18px] py-[12px] font-[Arial,sans-serif] text-[11px] text-[#1d39c4] shadow-sm">
      <div className="flex items-center gap-[12px]">
        <span className="font-bold text-[#1d39c4]">
          System Status Auto-Calculation:
        </span>

        <span className="rounded-full bg-[#2f54eb] px-[12px] py-[3px] text-[9.5px] font-bold text-white uppercase tracking-wider">
          {status}
        </span>

        <span className="text-[#2f54eb]">
          • Will go live automatically on {launchDate}.
        </span>
      </div>
    </div>
  );
}
