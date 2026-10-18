"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  X,
  Check,
  ArrowRight,
  Edit,
  Copy,
  MoreVertical,
  Trash2,
  BarChart2,
  PauseCircle,
} from "lucide-react";

// Import your custom modal components from your project structure

import DeactivateBannerModal from "@/features/banners/components/modals/DeactivateBannerModal";
import DeleteBannerModal from "@/features/banners/components/modals/DeleteBannerModal";
import DuplicateBannerModal from "@/features/banners/components/modals/DuplicateBannerModal";

export default function BannerDetailsPage(): React.ReactElement {
  const params = useParams();
  const router = useRouter();
  const bannerId = params?.id || "summer-event-staffing-campaign";

  const [previewMode, setPreviewMode] = useState<
    "desktop" | "tablet" | "mobile"
  >("desktop");

  // Modal States matching your exact existing actions
  const [activeModal, setActiveModal] = useState<
    "deactivate" | "duplicate" | "delete" | null
  >(null);

  return (
    <div className="min-h-screen bg-[#fafafa] font-[Arial,sans-serif] text-[#1A1A1A] p-[20px] antialiased">
      <div className="mx-auto w-full max-w-[1280px] space-y-[16px]">
        {/* Top Header Section */}
        <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-[#e9eaed] bg-white px-[20px] py-[16px] rounded-[12px] shadow-sm gap-[12px]">
          <div>
            <div className="mb-[3px] text-[10px] text-[#858b98]">
              Dashboard <span className="mx-[2px]">/</span> Banner{" "}
              <span className="mx-[2px]">/</span>{" "}
              <span className="font-semibold text-[#EF5A22]">
                Banner Details
              </span>
            </div>
            <h1 className="text-[18px] font-bold leading-[22px] tracking-[-0.3px] text-[#1A1A1A]">
              Banner Details
            </h1>
            <p className="text-[10px] text-[#858b98] mt-[2px]">
              Review banner content, placement, audience, schedule, and
              performance settings.
            </p>
          </div>

          <div className="flex items-center gap-[8px]">
            <Link
              href={`/banners/edit/${bannerId}`}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] border border-[#dfe3ea] bg-white px-[12px] text-[10px] font-bold text-[#343a44] hover:bg-[#f5f6f8] transition"
            >
              <Edit size={12} className="text-[#EF5A22]" /> Edit Banner
            </Link>
            <button
              onClick={() => setActiveModal("duplicate")}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] border border-[#dfe3ea] bg-white px-[12px] text-[10px] font-bold text-[#343a44] hover:bg-[#f5f6f8] transition"
            >
              <Copy size={12} /> Duplicate
            </button>
            <button className="flex h-[32px] items-center gap-[6px] rounded-[6px] bg-[#1A1A1A] px-[12px] text-[10px] font-bold text-white hover:bg-[#333] transition">
              More Actions <MoreVertical size={12} />
            </button>
          </div>
        </header>

        {/* Overview Status Bar */}
        <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] flex flex-col md:flex-row items-start md:items-center justify-between gap-[16px] shadow-sm">
          <div className="space-y-[6px]">
            <div className="flex items-center gap-[10px]">
              <h2 className="text-[16px] font-extrabold text-[#1A1A1A]">
                Find the Right Hosté for Your Next Event
              </h2>
              <span className="rounded-full bg-[#dcfce7] px-[10px] py-[3px] text-[9px] font-bold text-[#15803d] flex items-center gap-[4px] uppercase tracking-wide">
                <span className="w-[6px] h-[6px] rounded-full bg-[#15803d]"></span>{" "}
                ACTIVE
              </span>
            </div>
            <div className="flex flex-wrap items-center gap-x-[20px] gap-y-[4px] text-[10px] text-[#555b68]">
              <div>
                Placement:{" "}
                <strong className="text-[#1A1A1A] font-bold">
                  Homepage, Customer Dashboard
                </strong>
              </div>
              <div>
                Target Audience:{" "}
                <strong className="text-[#1A1A1A] font-bold">Customers</strong>
              </div>
            </div>
          </div>
          <div className="text-[9.5px] text-[#858b98] space-y-[3px] md:text-right">
            <div>
              Created by:{" "}
              <strong className="text-[#1A1A1A]">
                Admin Sarah (Aug 20, 2026)
              </strong>
            </div>
            <div>
              Updated: <strong className="text-[#1A1A1A]">Aug 22, 2026</strong>
            </div>
          </div>
        </section>

        {/* Live Platform Preview Section */}
        <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[14px] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[12px]">
            <h2 className="text-[12px] font-bold text-[#1A1A1A]">
              Banner Live Platform Preview
            </h2>
            <div className="bg-[#f1f2f5] p-[3px] rounded-[8px] flex items-center text-[10px] font-semibold">
              {(["desktop", "tablet", "mobile"] as const).map((mode) => (
                <button
                  key={mode}
                  onClick={() => setPreviewMode(mode)}
                  className={`px-[12px] py-[4px] rounded-[6px] capitalize transition ${
                    previewMode === mode
                      ? "bg-white text-[#1A1A1A] shadow-sm font-bold"
                      : "text-[#858b98] hover:text-[#1A1A1A]"
                  }`}
                >
                  {mode}
                </button>
              ))}
            </div>
          </div>

          <div className="relative w-full rounded-[10px] bg-gradient-to-r from-[#210905] via-[#5c1c05] to-[#802a06] p-[20px] text-white overflow-hidden shadow-md flex flex-col justify-between min-h-[160px]">
            <div className="flex justify-between items-start relative z-10">
              <span className="text-[8px] font-black uppercase tracking-wider text-[#78350f] bg-[#FFFFDC] px-[8px] py-[3px] rounded-[4px]">
                VERIFIED HOSTÉS
              </span>
              <button className="text-white/80 hover:text-white p-[2px] rounded-full bg-black/20">
                <X size={14} />
              </button>
            </div>

            <div className="relative z-10 space-y-[4px] my-[10px]">
              <h3 className="text-[16px] font-extrabold tracking-tight leading-[20px]">
                Find the Right Hosté for Your Next Event
              </h3>
              <p className="text-[10px] text-[#FFFFDC]/90 leading-[14px] max-w-[500px]">
                Book verified and professional event staff for your next
                celebration, corporate event, or special occasion. vetted hosts,
                bartenders, USHERs, and brand ambassadors ready to elevate your
                experience.
              </p>
            </div>

            <div className="relative z-10">
              <button className="px-[14px] py-[7px] bg-[#EF5A22] text-white rounded-[6px] text-[10px] font-bold shadow flex items-center gap-[4px] hover:bg-[#d94d10] transition">
                Book a Hosté <ArrowRight size={10} />
              </button>
            </div>
          </div>
        </section>

        {/* 2-Column Section: Banner Info & Placement */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] items-stretch">
          {/* Banner Information Card */}
          <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[16px] shadow-sm flex flex-col justify-between">
            <div className="space-y-[14px]">
              <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[10px]">
                <h2 className="text-[12px] font-bold text-[#1A1A1A]">
                  Banner Information
                </h2>
                <Link
                  href={`/banners/edit/${bannerId}`}
                  className="text-[10px] font-bold text-[#EF5A22] hover:underline"
                >
                  Edit
                </Link>
              </div>

              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  BANNER NAME
                </span>
                <strong className="text-[#1A1A1A] text-[11px]">
                  Summer Event Staffing Campaign
                </strong>
              </div>

              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  HEADLINE
                </span>
                <strong className="text-[#1A1A1A] text-[11px]">
                  Find the Right Hosté for Your Next Event
                </strong>
              </div>

              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  DESCRIPTION
                </span>
                <p className="text-[#424854] text-[10px] leading-[14px]">
                  Book verified and professional event staff for your next
                  celebration, corporate event, or special occasion.
                </p>
              </div>
            </div>

            <div className="grid grid-cols-3 gap-[12px] pt-[12px] border-t border-[#f0f1f4] text-[10px]">
              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  CTA TEXT
                </span>
                <strong className="text-[#1A1A1A] font-bold">
                  Book a Hosté
                </strong>
              </div>
              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  DESTINATION
                </span>
                <strong className="text-[#1A1A1A] font-bold">
                  Booking Marketplace
                </strong>
              </div>
              <div>
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                  CTA LINK
                </span>
                <strong className="text-[#EF5A22] font-bold">/bookings</strong>
              </div>
            </div>
          </section>

          {/* Placement & Target Audience Card */}
          <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[16px] shadow-sm flex flex-col justify-between">
            <div className="space-y-[14px]">
              <h2 className="text-[12px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px]">
                Placement & Target Audience
              </h2>

              <div className="space-y-[6px]">
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider">
                  ACTIVE PLACEMENTS
                </span>
                <div className="flex gap-[8px]">
                  <span className="px-[12px] py-[5px] rounded-[20px] border border-[#EF5A22] bg-[#FFFFDC] text-[10px] font-bold text-[#1A1A1A]">
                    Homepage
                  </span>
                  <span className="px-[12px] py-[5px] rounded-[20px] border border-[#EF5A22] bg-[#FFFFDC] text-[10px] font-bold text-[#1A1A1A]">
                    Customer Dashboard
                  </span>
                </div>
              </div>

              <div className="space-y-[6px]">
                <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider">
                  TARGET AUDIENCE GROUPS
                </span>
                <span className="inline-block px-[14px] py-[5px] rounded-[20px] bg-[#1A1A1A] text-white text-[10px] font-bold">
                  Customers
                </span>
              </div>
            </div>

            <div className="bg-[#f0f5ff] border border-[#d6e4ff] p-[10px] rounded-[8px] text-[10px] text-[#1d39c4] flex items-center gap-[8px]">
              <Check size={14} className="shrink-0 font-extrabold" />
              <div>
                <strong>Visibility Active</strong>
                <p className="text-[9.5px] text-[#2f54eb]">
                  This banner is currently visible to Customers on the selected
                  Hosté platform locations.
                </p>
              </div>
            </div>
          </section>
        </div>

        {/* 2-Column Section: Schedule & Performance */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-[16px] items-stretch">
          {/* Publishing Schedule & Settings Card */}
          <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[16px] shadow-sm flex flex-col justify-between">
            <div className="space-y-[14px]">
              <h2 className="text-[12px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px]">
                Publishing Schedule & Settings
              </h2>

              <div className="grid grid-cols-2 gap-[16px] text-[10px]">
                <div>
                  <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                    PUBLISHING STATUS
                  </span>
                  <span className="inline-block rounded-full bg-[#dcfce7] px-[10px] py-[2px] text-[9px] font-bold text-[#15803d]">
                    ACTIVE
                  </span>
                </div>
                <div>
                  <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                    TIMEZONE
                  </span>
                  <strong className="text-[#1A1A1A] font-bold">
                    West Africa Time (WAT / UTC+1)
                  </strong>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-[16px] text-[10px]">
                <div>
                  <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                    START DATE & TIME
                  </span>
                  <strong className="text-[#1A1A1A] font-extrabold text-[11px]">
                    August 20, 2026 • 9:00 AM
                  </strong>
                </div>
                <div>
                  <span className="text-[8.5px] text-[#858b98] font-bold block uppercase tracking-wider mb-[2px]">
                    END DATE & TIME
                  </span>
                  <strong className="text-[#1A1A1A] font-extrabold text-[11px]">
                    September 20, 2026 • 11:59 PM
                  </strong>
                </div>
              </div>
            </div>

            <div className="pt-[12px] border-t border-[#f0f1f4] space-y-[8px]">
              <span className="text-[9px] text-[#1A1A1A] font-bold block">
                Display Configuration Indicators
              </span>
              <div className="grid grid-cols-2 gap-y-[6px] text-[9.5px]">
                <div>
                  Display Priority:{" "}
                  <strong className="text-[#1A1A1A] font-bold">
                    High (Priority Weight: 10)
                  </strong>
                </div>
                <div>
                  Multiple Banners:{" "}
                  <strong className="text-[#1A1A1A] font-bold">Yes</strong>
                </div>
                <div>
                  Show CTA Button:{" "}
                  <strong className="text-[#15803d] font-bold">
                    ✓ Enabled
                  </strong>
                </div>
                <div>
                  Track Clicks (CTR):{" "}
                  <strong className="text-[#15803d] font-bold">
                    ✓ Enabled
                  </strong>
                </div>
                <div>
                  Allow Banner Dismissal:{" "}
                  <strong className="text-[#15803d] font-bold">
                    ✓ Enabled
                  </strong>
                </div>
                <div>
                  Track Impressions:{" "}
                  <strong className="text-[#15803d] font-bold">
                    ✓ Enabled
                  </strong>
                </div>
              </div>
            </div>
          </section>

          {/* Banner Performance Summary Card */}
          <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[14px] shadow-sm flex flex-col justify-between">
            <div className="space-y-[12px]">
              <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[10px]">
                <h2 className="text-[12px] font-bold text-[#1A1A1A]">
                  Banner Performance Summary
                </h2>
                <Link
                  href="#"
                  className="text-[10px] font-bold text-[#EF5A22] hover:underline flex items-center gap-[2px]"
                >
                  View Full Analytics <ArrowRight size={10} />
                </Link>
              </div>

              {/* Stat Boxes */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-[8px]">
                <div className="bg-[#f9fafb] border border-[#e8eaf0] p-[10px] rounded-[8px]">
                  <span className="text-[8px] font-bold text-[#858b98] uppercase">
                    IMPRESSIONS
                  </span>
                  <div className="text-[14px] font-black text-[#1A1A1A] my-[2px]">
                    12,450
                  </div>
                  <span className="text-[8px] text-[#15803d] font-extrabold">
                    ↑ +14% vs avg
                  </span>
                </div>
                <div className="bg-[#f9fafb] border border-[#e8eaf0] p-[10px] rounded-[8px]">
                  <span className="text-[8px] font-bold text-[#858b98] uppercase">
                    CLICKS
                  </span>
                  <div className="text-[14px] font-black text-[#1A1A1A] my-[2px]">
                    1,842
                  </div>
                  <span className="text-[8px] text-[#15803d] font-extrabold">
                    ↑ +8.2%
                  </span>
                </div>
                <div className="bg-[#f9fafb] border border-[#e8eaf0] p-[10px] rounded-[8px]">
                  <span className="text-[8px] font-bold text-[#858b98] uppercase">
                    CTR
                  </span>
                  <div className="text-[14px] font-black text-[#EF5A22] my-[2px]">
                    14.8%
                  </div>
                  <span className="text-[8px] text-[#858b98] font-semibold">
                    Top 5% campaign
                  </span>
                </div>
                <div className="bg-[#f9fafb] border border-[#e8eaf0] p-[10px] rounded-[8px]">
                  <span className="text-[8px] font-bold text-[#858b98] uppercase">
                    CONVERSIONS
                  </span>
                  <div className="text-[14px] font-black text-[#15803d] my-[2px]">
                    326
                  </div>
                  <span className="text-[8px] text-[#858b98]">
                    Bookings made
                  </span>
                </div>
              </div>
            </div>

            {/* Exact Performance Trend SVG Graph */}
            <div className="space-y-[6px] pt-[4px]">
              <span className="text-[9px] text-[#1A1A1A] font-bold block">
                Activity Trend (Past 7 Days)
              </span>
              <div className="bg-[#f9fafb] border border-[#e8eaf0] rounded-[8px] p-[12px] space-y-[8px]">
                <div className="w-full h-[80px]">
                  <svg
                    className="w-full h-full overflow-visible"
                    viewBox="0 0 400 80"
                    preserveAspectRatio="none"
                  >
                    <defs>
                      <linearGradient
                        id="chartGradient"
                        x1="0"
                        y1="0"
                        x2="0"
                        y2="1"
                      >
                        <stop
                          offset="0%"
                          stopColor="#15803d"
                          stopOpacity="0.25"
                        />
                        <stop
                          offset="100%"
                          stopColor="#15803d"
                          stopOpacity="0.0"
                        />
                      </linearGradient>
                    </defs>
                    <path
                      d="M 10 60 L 60 50 L 110 53 L 160 35 L 210 40 L 260 18 L 310 25 L 360 8 L 360 80 L 10 80 Z"
                      fill="url(#chartGradient)"
                    />
                    <path
                      d="M 10 60 L 60 50 L 110 53 L 160 35 L 210 40 L 260 18 L 310 25 L 360 8"
                      fill="none"
                      stroke="#15803d"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                    />
                    <circle cx="260" cy="18" r="4" fill="#15803d" />
                    <circle
                      cx="360"
                      cy="8"
                      r="4"
                      fill="#EF5A22"
                      stroke="#ffffff"
                      strokeWidth="1.5"
                    />
                  </svg>
                </div>
                <div className="flex justify-between text-[8px] font-bold text-[#858b98] pt-[4px] border-t border-[#e8eaf0]">
                  <span>Aug 18</span>
                  <span>Aug 20</span>
                  <span>Aug 22</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* Banner Audit Activity Log */}
        <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[20px] space-y-[16px] shadow-sm">
          <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[10px]">
            <h2 className="text-[12px] font-bold text-[#1A1A1A]">
              Banner Audit Activity Log
            </h2>
            <Link
              href="#"
              className="text-[10px] font-bold text-[#EF5A22] hover:underline flex items-center gap-[2px]"
            >
              View Activity Log <ArrowRight size={10} />
            </Link>
          </div>

          <div className="space-y-[14px]">
            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#15803d]"></span>
                <strong className="text-[#1A1A1A] font-extrabold w-[120px]">
                  Banner Activated
                </strong>
                <span className="text-[#555b68]">
                  Banner was activated and set live across platform placements.
                </span>
              </div>
              <span className="text-[#858b98] text-[9px]">
                August 22, 2026 • 2:20 PM
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#EF5A22]"></span>
                <strong className="text-[#1A1A1A] font-extrabold w-[120px]">
                  Banner Updated
                </strong>
                <span className="text-[#555b68]">
                  Placement expanded to include &apos;Customer Dashboard&apos;.
                </span>
              </div>
              <span className="text-[#858b98] text-[9px]">
                August 22, 2026 • 2:15 PM
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#1A1A1A]"></span>
                <strong className="text-[#1A1A1A] font-extrabold w-[120px]">
                  Banner Published
                </strong>
                <span className="text-[#555b68]">
                  Super Admin Sarah published the banner campaign.
                </span>
              </div>
              <span className="text-[#858b98] text-[9px]">
                August 20, 2026 • 10:45 AM
              </span>
            </div>

            <div className="flex items-center justify-between text-[10px]">
              <div className="flex items-center gap-[10px]">
                <span className="w-[8px] h-[8px] rounded-full bg-[#858b98]"></span>
                <strong className="text-[#1A1A1A] font-extrabold w-[120px]">
                  Banner Created
                </strong>
                <span className="text-[#555b68]">
                  Draft created with initial headline and hero banner artwork.
                </span>
              </div>
              <span className="text-[#858b98] text-[9px]">
                August 20, 2026 • 10:32 AM
              </span>
            </div>
          </div>
        </section>

        {/* Quick Actions Footer Bar */}
        <section className="rounded-[12px] border border-[#e8eaf0] bg-white p-[16px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[12px] shadow-sm">
          <span className="text-[11px] font-bold text-[#1A1A1A]">
            Quick Actions (Active Status):
          </span>
          <div className="flex flex-wrap items-center gap-[10px]">
            <Link
              href={`/banners/edit/${bannerId}`}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] bg-[#EF5A22] px-[14px] text-[10px] font-bold text-white hover:bg-[#d94d10] transition"
            >
              <Edit size={12} /> Edit Banner
            </Link>
            <button
              onClick={() => setActiveModal("duplicate")}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] border border-[#dfe3ea] bg-[#f9fafb] px-[14px] text-[10px] font-bold text-[#343a44] hover:bg-[#e4e6ea] transition"
            >
              <Copy size={12} /> Duplicate
            </button>
            <button
              onClick={() => setActiveModal("deactivate")}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] border border-[#fca5a5] bg-[#fff0ef] px-[14px] text-[10px] font-bold text-[#d92d20] hover:bg-[#fee2e2] transition"
            >
              <PauseCircle size={12} /> Deactivate Banner
            </button>
            <button className="flex h-[32px] items-center gap-[6px] rounded-[6px] bg-[#1A1A1A] px-[14px] text-[10px] font-bold text-white hover:bg-[#333] transition">
              <BarChart2 size={12} /> View Analytics
            </button>
            <button
              onClick={() => setActiveModal("delete")}
              className="flex h-[32px] items-center gap-[6px] rounded-[6px] border border-[#fca5a5] bg-white px-[14px] text-[10px] font-bold text-[#d92d20] hover:bg-[#fff0ef] transition"
            >
              <Trash2 size={12} /> Delete
            </button>
          </div>
        </section>
      </div>

      {/* --- CONFIRMATION MODALS INTEGRATED --- */}

      {/* Deactivate Banner Modal */}
      <DeactivateBannerModal
        isOpen={activeModal === "deactivate"}
        bannerTitle="Find the Right Hosté for Your Next Event"
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          alert("Banner Deactivated Successfully!");
          setActiveModal(null);
        }}
      />

      {/* Duplicate Banner Modal */}
      <DuplicateBannerModal
        isOpen={activeModal === "duplicate"}
        draftName="Find the Right Hosté for Your Next Event (Copy)"
        placements="Homepage, Customer Dashboard"
        audience="Customers"
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          alert("Banner Duplicated as Draft!");
          setActiveModal(null);
        }}
      />

      {/* Delete Banner Modal */}
      <DeleteBannerModal
        isOpen={activeModal === "delete"}
        onClose={() => setActiveModal(null)}
        onConfirm={() => {
          alert("Banner Deleted Permanently!");
          setActiveModal(null);
          router.push("/banners");
        }}
      />
    </div>
  );
}
