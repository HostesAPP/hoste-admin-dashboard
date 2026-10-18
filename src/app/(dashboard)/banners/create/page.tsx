"use client";

import React, { useState } from "react";
import Link from "next/link";
import { X, Check, Globe, ArrowRight } from "lucide-react";

// Correct import paths based on standard Next.js feature folder structures
import ScheduleBannerModal from "@/features/banners/components/modals/ScheduleBannerModal"; // Or adjust relative path like "../../../components/modals/ScheduleBannerModal"
import RemoveBannerImageModal from "@/features/banners/components/modals/RemoveBannerImageModal";
import DiscardChangesModal from "@/features/banners/components/modals/DiscardChangesModal";
import StatusCalculationBanner from "@/features/banners/components/modals/StatusCalculationBanner";

export default function CreateBannerPage(): React.ReactElement {
  const [bannerName, setBannerName] = useState<string>(
    "Summer Event Staffing Campaign",
  );
  const [headline, setHeadline] = useState<string>(
    "Find the Right Hosté for Your Next Event",
  );
  const [description, setDescription] = useState<string>(
    "Book verified and professional event staff for your next celebration, corporate event, or special occasion.",
  );
  const [ctaText, setCtaText] = useState<string>("Book a Hosté");
  const [ctaLink, setCtaLink] = useState<string>("/bookings");

  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([
    "Homepage",
    "Customer Dashboard",
  ]);
  const [targetAudience, setTargetAudience] = useState<string>("Everyone");
  const [publishingOption, setPublishingOption] = useState<
    "immediate" | "schedule"
  >("schedule");
  const [startDate, setStartDate] = useState<string>("2026-09-01 09:00 AM");
  const [endDate, setEndDate] = useState<string>("2026-09-30 11:59 PM");

  const [isEvergreen, setIsEvergreen] = useState<boolean>(false);
  const [priorityWeight, setPriorityWeight] = useState<string>("10");

  const [showCta, setShowCta] = useState<boolean>(true);
  const [allowDismiss, setAllowDismiss] = useState<boolean>(true);
  const [trackImpressions, setTrackImpressions] = useState<boolean>(true);
  const [openNewTab, setOpenNewTab] = useState<boolean>(false);

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

  // Modal States
  const [isScheduleModalOpen, setIsScheduleModalOpen] =
    useState<boolean>(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState<boolean>(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState<boolean>(false);

  const togglePlacement = (name: string) => {
    setSelectedPlacements((prev) =>
      prev.includes(name) ? prev.filter((p) => p !== name) : [...prev, name],
    );
  };

  const handlePublishClick = () => {
    if (publishingOption === "schedule") {
      setIsScheduleModalOpen(true);
    } else {
      // Immediate publish handler logic here
      alert("Banner published immediately!");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-[Arial,sans-serif] text-[#1A1A1A]">
      <div className="mx-auto min-h-screen w-full max-w-[1400px]">
        {/* Sticky Top Header */}
        <header className="sticky top-0 z-50 flex h-[61px] items-center justify-between border-b border-[#e9eaed] bg-white px-[19px]">
          <div>
            <div className="mb-[2px] text-[9px] text-[#858b98]">
              Dashboard <span className="mx-[3px]">/</span> Banner{" "}
              <span className="mx-[3px]">/</span>
              <span className="font-semibold text-[#EF5A22]">
                Create Banner
              </span>
            </div>
            <h1 className="text-[15px] font-bold leading-[18px] tracking-[-0.3px]">
              Create Banner
            </h1>
          </div>

          <div className="flex items-center gap-[8px]">
            <Link
              href="/banners"
              className="flex h-[28px] items-center rounded-[5px] border border-[#dfe3ea] bg-white px-[11px] text-[9px] font-semibold text-[#424854] hover:bg-[#f5f6f8]"
            >
              Cancel
            </Link>
            <button className="flex h-[28px] items-center rounded-[5px] border border-[#dfe3ea] bg-white px-[11px] text-[9px] font-semibold text-[#424854] hover:bg-[#f5f6f8]">
              Save as Draft
            </button>
            <button
              onClick={handlePublishClick}
              className="flex h-[28px] items-center rounded-[5px] bg-[#EF5A22] px-[11px] text-[9px] font-semibold text-white hover:bg-[#d94d10]"
            >
              Publish Banner
            </button>
          </div>
        </header>

        <div className="px-[8px] pb-[20px] pt-[8px] space-y-[14px]">
          <p className="px-[8px] text-[10px] text-[#858b98]">
            Create and schedule a promotional banner for the Hosté platform.
          </p>

          {/* Integrated Status Calculation Banner */}
          <div className="px-[8px]">
            <StatusCalculationBanner
              status="SCHEDULED"
              launchDate="Sep 1, 2026"
            />
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-[16px] items-start">
            {/* Left Column (Forms) */}
            <div className="lg:col-span-7 space-y-[14px]">
              {/* Banner Information Card */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="text-[10px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px] mb-[12px]">
                  Banner Information
                </h2>

                <div className="space-y-[12px]">
                  <div>
                    <label className="block text-[9px] font-semibold text-[#343a44] mb-[4px]">
                      Banner Name <span className="text-[#d92d20]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bannerName}
                      onChange={(e) => setBannerName(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                    />
                    <span className="text-[8px] text-[#858b98] mt-[3px] block">
                      Internal name used to identify this banner in the Admin
                      Dashboard.
                    </span>
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-[4px]">
                      <label className="text-[9px] font-semibold text-[#343a44]">
                        Headline <span className="text-[#d92d20]">*</span>
                      </label>
                      <span className="text-[8px] text-[#858b98]">
                        {headline.length} / 60
                      </span>
                    </div>
                    <input
                      type="text"
                      value={headline}
                      onChange={(e) => setHeadline(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                    />
                  </div>

                  <div>
                    <div className="flex justify-between items-center mb-[4px]">
                      <label className="text-[9px] font-semibold text-[#343a44]">
                        Description
                      </label>
                      <span className="text-[8px] text-[#858b98]">
                        {description.length} / 160
                      </span>
                    </div>
                    <textarea
                      rows={3}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white p-[9px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22] resize-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-[10px]">
                    <div>
                      <label className="block text-[9px] font-semibold text-[#343a44] mb-[4px]">
                        CTA Button Text{" "}
                        <span className="text-[#d92d20]">*</span>
                      </label>
                      <input
                        type="text"
                        value={ctaText}
                        onChange={(e) => setCtaText(e.target.value)}
                        className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                      />
                    </div>
                    <div>
                      <label className="block text-[9px] font-semibold text-[#343a44] mb-[4px]">
                        CTA Link <span className="text-[#d92d20]">*</span>
                      </label>
                      <input
                        type="text"
                        value={ctaLink}
                        onChange={(e) => setCtaLink(e.target.value)}
                        className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                      />
                    </div>
                  </div>
                </div>
              </section>

              {/* Banner Image Card */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[10px] mb-[12px]">
                  <h2 className="text-[10px] font-bold text-[#1A1A1A]">
                    Banner Image
                  </h2>
                  <span className="text-[8px] font-semibold text-[#EF5A22] bg-[#fff3ed] px-[7px] py-[2px] rounded-full">
                    Required *
                  </span>
                </div>

                <div className="border border-dashed border-[#EF5A22] bg-[#FFFFDC]/40 rounded-[8px] p-[10px] flex flex-col sm:flex-row items-center gap-[10px]">
                  <div className="w-[120px] h-[72px] rounded-[5px] bg-gradient-to-r from-[#EF5A22] to-[#802a06] flex items-end p-[6px] text-white text-[6px] font-bold relative overflow-hidden shrink-0">
                    <span className="relative z-10">
                      SUMMER_HERO_1200x400.PNG
                    </span>
                  </div>

                  <div className="flex-1 space-y-[3px] text-center sm:text-left">
                    <div className="flex items-center justify-center sm:justify-start gap-[4px] text-[#176b37] text-[9px] font-bold">
                      <Check size={11} strokeWidth={3} /> Image Uploaded
                      Successfully
                    </div>
                    <div className="font-bold text-[#1A1A1A] text-[9px]">
                      summer_event_banner_v2.png
                    </div>
                    <div className="text-[8px] text-[#858b98]">
                      Size: 1.4 MB • 1200 × 400 px
                      <br />
                      Format: PNG (RGB Color Space)
                    </div>
                    <div className="flex items-center justify-center sm:justify-start gap-[6px] pt-[3px]">
                      <button className="px-[8px] py-[3px] bg-white border border-[#dfe3ea] rounded-[4px] text-[8px] font-semibold text-[#424854] hover:bg-[#f5f6f8]">
                        Replace
                      </button>
                      <button
                        onClick={() => setIsRemoveModalOpen(true)}
                        className="px-[8px] py-[3px] bg-[#fff0ef] border border-[#fca5a5] rounded-[4px] text-[8px] font-semibold text-[#d92d20]"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>

                <div className="text-[8px] text-[#858b98] space-y-[2px] pt-[8px]">
                  <div>
                    • Recommended dimensions:{" "}
                    <strong className="text-[#343a44]">1200 × 400px</strong>{" "}
                    (3:1 aspect ratio)
                  </div>
                  <div>
                    • Supported formats:{" "}
                    <strong className="text-[#343a44]">PNG, JPG, WEBP</strong>{" "}
                    (Max file size:{" "}
                    <strong className="text-[#343a44]">5 MB</strong>)
                  </div>
                </div>
              </section>

              {/* Placement & Target Audience */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="text-[10px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px] mb-[12px]">
                  Placement & Target Audience
                </h2>

                <div className="space-y-[8px]">
                  <div className="flex justify-between items-center">
                    <label className="text-[9px] font-semibold text-[#343a44]">
                      Banner Placement
                    </label>
                    <span className="text-[8px] text-[#858b98]">
                      (Select all that apply)
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-[8px]">
                    {[
                      "Homepage",
                      "Customer Dashboard",
                      "Event Planner Portal",
                      "Hosté Dashboard",
                    ].map((name) => {
                      const isSelected = selectedPlacements.includes(name);
                      return (
                        <div
                          key={name}
                          onClick={() => togglePlacement(name)}
                          className={`rounded-[7px] p-[9px] cursor-pointer border transition ${
                            isSelected
                              ? "border-[#EF5A22] bg-[#FFFFDC]"
                              : "border-[#e8eaf0] hover:border-[#dfe3ea]"
                          }`}
                        >
                          <div className="flex items-center gap-[6px] mb-[2px]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => {}}
                              className="accent-[#EF5A22] rounded cursor-pointer"
                            />
                            <span className="text-[9px] font-bold text-[#1A1A1A]">
                              {name}
                            </span>
                          </div>
                          <p className="text-[8px] text-[#858b98] pl-[18px]">
                            {name === "Homepage" &&
                              "Main visitor booking landing page"}
                            {name === "Customer Dashboard" &&
                              "Logged-in event host portal"}
                            {name === "Event Planner Portal" &&
                              "Agencies and corporate planners"}
                            {name === "Hosté Dashboard" &&
                              "Event staffing roster members"}
                          </p>
                        </div>
                      );
                    })}
                  </div>
                </div>

                <div className="space-y-[6px] pt-[12px]">
                  <label className="text-[9px] font-semibold text-[#343a44] block">
                    Target Audience
                  </label>
                  <p className="text-[8px] text-[#858b98]">
                    Select who should see this promotional banner across the
                    chosen placements.
                  </p>

                  <div className="flex flex-wrap items-center gap-[5px] pt-[4px]">
                    {[
                      "Everyone",
                      "Customers",
                      "Event Planners",
                      "Hostés",
                      "Group Leaders",
                    ].map((aud) => (
                      <button
                        key={aud}
                        onClick={() => setTargetAudience(aud)}
                        className={`px-[10px] py-[4px] rounded-full text-[8px] font-semibold transition border ${
                          targetAudience === aud
                            ? "bg-[#1A1A1A] text-white border-[#1A1A1A]"
                            : "bg-white text-[#555b68] border-[#dfe3ea] hover:bg-[#f5f6f8]"
                        }`}
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              {/* Publishing Schedule & Status */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="text-[10px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px] mb-[12px]">
                  Publishing Schedule & Status
                </h2>

                <div className="space-y-[6px]">
                  <label className="text-[9px] font-semibold text-[#343a44] block">
                    Publishing Options
                  </label>
                  <div className="grid grid-cols-2 gap-[8px]">
                    <div
                      onClick={() => setPublishingOption("immediate")}
                      className={`rounded-[7px] p-[9px] cursor-pointer flex items-center gap-[6px] border transition ${
                        publishingOption === "immediate"
                          ? "border-[#EF5A22] bg-[#FFFFDC]"
                          : "border-[#e8eaf0] bg-[#fafafa]"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={publishingOption === "immediate"}
                        onChange={() => {}}
                        className="accent-[#EF5A22] cursor-pointer"
                      />
                      <span className="text-[9px] font-bold text-[#343a44]">
                        Publish Immediately
                      </span>
                    </div>

                    <div
                      onClick={() => setPublishingOption("schedule")}
                      className={`rounded-[7px] p-[9px] cursor-pointer flex items-center gap-[6px] border transition ${
                        publishingOption === "schedule"
                          ? "border-[#EF5A22] bg-[#FFFFDC]"
                          : "border-[#e8eaf0]"
                      }`}
                    >
                      <input
                        type="radio"
                        checked={publishingOption === "schedule"}
                        onChange={() => {}}
                        className="accent-[#EF5A22] cursor-pointer"
                      />
                      <span className="text-[9px] font-bold text-[#1A1A1A]">
                        Schedule for Later
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[10px] pt-[10px]">
                  <div>
                    <label className="block text-[9px] font-semibold text-[#343a44] mb-[4px]">
                      Start Date & Time
                    </label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-[9px] font-semibold text-[#343a44] mb-[4px]">
                      End Date & Time
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-between pt-[10px] mt-[10px] border-t border-[#f0f1f4]">
                  <div>
                    <span className="text-[9px] font-bold text-[#1A1A1A] block">
                      Set as Evergreen Banner
                    </span>
                    <span className="text-[8px] text-[#858b98]">
                      Keep active continuously without an expiration date.
                    </span>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isEvergreen}
                      onChange={() => setIsEvergreen(!isEvergreen)}
                      className="sr-only peer"
                    />
                    <div className="w-[30px] h-[16px] bg-[#dfe3ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#dfe3ea] after:border after:rounded-full after:h-[12px] after:w-[12px] after:transition-all peer-checked:bg-[#176b37]"></div>
                  </label>
                </div>
              </section>

              {/* Display Priority & Banner Toggles */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="text-[10px] font-bold text-[#1A1A1A] border-b border-[#f0f1f4] pb-[10px] mb-[12px]">
                  Display Priority & Banner Toggles
                </h2>

                <div className="flex items-center justify-between">
                  <div>
                    <label className="text-[9px] font-semibold text-[#343a44] block">
                      Display Priority Weight
                    </label>
                    <span className="text-[8px] text-[#858b98]">
                      (Top placement priority for Homepage Carousel)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[8px] text-[#858b98] block mb-[2px]">
                      Higher value = earlier placement
                    </span>
                    <input
                      type="text"
                      value={priorityWeight}
                      onChange={(e) => setPriorityWeight(e.target.value)}
                      className="w-[70px] rounded-[6px] border border-[#dfe3ea] bg-white px-[8px] py-[5px] text-[9px] text-[#1A1A1A] text-center font-bold outline-none"
                    />
                  </div>
                </div>

                <div className="space-y-[10px] pt-[12px] mt-[10px] border-t border-[#f0f1f4]">
                  {[
                    {
                      label: "Show Call-To-Action (CTA) Button",
                      state: showCta,
                      setter: () => setShowCta(!showCta),
                    },
                    {
                      label: 'Allow Banner to Be Dismissed by User (Close "×")',
                      state: allowDismiss,
                      setter: () => setAllowDismiss(!allowDismiss),
                    },
                    {
                      label: "Track Impressions & Analytics CTR",
                      state: trackImpressions,
                      setter: () => setTrackImpressions(!trackImpressions),
                    },
                    {
                      label: "Open Link in New Browser Tab",
                      state: openNewTab,
                      setter: () => setOpenNewTab(!openNewTab),
                    },
                  ].map((toggle, idx) => (
                    <div
                      key={idx}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[9px] font-semibold text-[#343a44]">
                        {toggle.label}
                      </span>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          checked={toggle.state}
                          onChange={toggle.setter}
                          className="sr-only peer"
                        />
                        <div className="w-[30px] h-[16px] bg-[#dfe3ea] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-[#dfe3ea] after:border after:rounded-full after:h-[12px] after:w-[12px] after:transition-all peer-checked:bg-[#176b37]"></div>
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              {/* Meta Info Bar */}
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[12px] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-[10px] text-[8px] text-[#858b98]">
                <div>
                  Created By:{" "}
                  <strong className="text-[#1A1A1A]">
                    Super Admin (John N.)
                  </strong>
                  <br />
                  Created Date:{" "}
                  <strong className="text-[#1A1A1A]">
                    2026-08-24 15:12 WAT
                  </strong>
                </div>
                <div className="text-left sm:text-right flex sm:block justify-between items-center w-full sm:w-auto">
                  <div>
                    Last Updated:{" "}
                    <strong className="text-[#1A1A1A]">Just now</strong>
                  </div>
                  <button
                    onClick={() => setIsDiscardModalOpen(true)}
                    className="mt-[4px] px-[10px] py-[5px] bg-[#EF5A22] hover:bg-[#d94d10] text-white font-semibold rounded-[5px] transition"
                  >
                    Discard Changes
                  </button>
                </div>
              </section>
            </div>

            {/* Right Column (Live Preview) */}
            <div className="lg:col-span-5 space-y-[14px] sticky top-[73px]">
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px] space-y-[12px]">
                <div className="flex justify-between items-center border-b border-[#f0f1f4] pb-[10px]">
                  <h2 className="text-[10px] font-bold text-[#1A1A1A]">
                    Live Platform Preview
                  </h2>

                  <div className="bg-[#f1f2f5] p-[2px] rounded-[6px] flex items-center text-[9px] font-semibold">
                    <button
                      onClick={() => setPreviewMode("desktop")}
                      className={`px-[9px] py-[3px] rounded-[4px] transition ${
                        previewMode === "desktop"
                          ? "bg-white text-[#1A1A1A] shadow-sm"
                          : "text-[#858b98] hover:text-[#1A1A1A]"
                      }`}
                    >
                      Desktop
                    </button>
                    <button
                      onClick={() => setPreviewMode("mobile")}
                      className={`px-[9px] py-[3px] rounded-[4px] transition ${
                        previewMode === "mobile"
                          ? "bg-white text-[#1A1A1A] shadow-sm"
                          : "text-[#858b98] hover:text-[#1A1A1A]"
                      }`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                {/* Browser Mockup Container */}
                <div className="bg-[#f5f6f8] border border-[#e8eaf0] rounded-[8px] p-[10px] space-y-[10px]">
                  <div className="flex items-center justify-between bg-white px-[9px] py-[5px] rounded-[5px] border border-[#e8eaf0] text-[#858b98] text-[8px]">
                    <div className="flex items-center gap-[4px]">
                      <span className="w-[6px] h-[6px] rounded-full bg-[#f87171]"></span>
                      <span className="w-[6px] h-[6px] rounded-full bg-[#fbbf24]"></span>
                      <span className="w-[6px] h-[6px] rounded-full bg-[#34d399]"></span>
                    </div>
                    <div className="bg-[#fafafa] px-[8px] py-[1px] rounded text-[#858b98] text-[7px] border border-[#f0f1f4] flex items-center gap-[3px]">
                      <Globe size={9} /> https://hoste.app/homepage-preview
                    </div>
                    <div></div>
                  </div>

                  {/* Banner Render Box */}
                  <div className="relative w-full rounded-[6px] bg-gradient-to-r from-[#210905] via-[#5c1c05] to-[#802a06] p-[12px] text-white overflow-hidden shadow-md flex flex-col justify-between min-h-[110px]">
                    <div className="absolute -right-6 -bottom-6 w-32 h-32 rounded-full bg-amber-950/40 blur-sm pointer-events-none"></div>

                    <div className="flex justify-between items-start relative z-10">
                      <span className="text-[7px] font-black uppercase tracking-wider text-[#78350f] bg-[#FFFFDC] px-[7px] py-[2px] rounded">
                        EVENT STAFFING
                      </span>
                      {allowDismiss && (
                        <button className="text-white/80 hover:text-white p-[2px]">
                          <X size={12} />
                        </button>
                      )}
                    </div>

                    <div className="relative z-10 space-y-[2px] my-[6px]">
                      <h3 className="text-[11px] font-extrabold tracking-tight leading-[13px]">
                        {headline}
                      </h3>
                      <p className="text-[8px] text-[#FFFFDC]/90 leading-[10px] max-w-[260px]">
                        {description}
                      </p>
                    </div>

                    {showCta && (
                      <div className="relative z-10">
                        <button className="px-[9px] py-[4px] bg-[#EF5A22] hover:bg-[#d94d10] text-white rounded-[4px] text-[8px] font-bold shadow transition flex items-center gap-[3px]">
                          {ctaText} <ArrowRight size={8} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                {/* Placement Summary Card */}
                <div className="bg-[#fafafa] border border-[#e8eaf0] rounded-[8px] p-[10px] space-y-[6px] text-[9px]">
                  <div className="font-bold text-[#1A1A1A] border-b border-[#e8eaf0] pb-[6px]">
                    Placement Summary:
                  </div>
                  <div className="space-y-[4px] text-[#555b68] text-[8px]">
                    <div>
                      • Placements:{" "}
                      <strong className="text-[#1A1A1A]">
                        {selectedPlacements.join(", ")}
                      </strong>
                    </div>
                    <div>
                      • Target Audience:{" "}
                      <strong className="text-[#1A1A1A]">
                        {targetAudience}
                      </strong>
                    </div>
                    <div>
                      • Active Window:{" "}
                      <strong className="text-[#176b37] font-bold">
                        Sep 01, 2026 – Sep 30, 2026
                      </strong>
                    </div>
                    <div>
                      • Priority Weight:{" "}
                      <strong className="text-[#1A1A1A]">
                        {priorityWeight} (High)
                      </strong>
                    </div>
                  </div>
                </div>

                {/* Ready Status Banner */}
                <div className="bg-[#FFFFDC] border border-[#fef08a] rounded-[8px] p-[9px] text-center">
                  <span className="text-[9px] font-bold text-[#713f12] flex items-center justify-center gap-[4px]">
                    ⚡ Ready to Schedule Promotional Campaign
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>

        {/* Render Modals at Root Level */}
        <ScheduleBannerModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onConfirm={() => {
            setIsScheduleModalOpen(false);
            alert("Banner successfully scheduled!");
          }}
          startDate={startDate}
          endDate={endDate}
          placements={selectedPlacements}
          targetAudience={targetAudience}
        />

        <RemoveBannerImageModal
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onConfirm={() => {
            setIsRemoveModalOpen(false);
            alert("Banner image removed.");
          }}
        />

        <DiscardChangesModal
          isOpen={isDiscardModalOpen}
          onClose={() => setIsDiscardModalOpen(false)}
          onConfirm={() => {
            setIsDiscardModalOpen(false);
            alert("Changes discarded.");
          }}
        />
      </div>
    </div>
  );
}
