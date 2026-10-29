"use client";

import React, { useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { X, Check, Globe, ArrowRight, ImagePlus } from "lucide-react";

import ScheduleBannerModal from "@/features/banners/components/modals/ScheduleBannerModal";
import StatusCalculationBanner from "@/features/banners/components/modals/StatusCalculationBanner";
import RemoveBannerImageModal from "@/features/banners/components/modals/RemoveBannerImageModal";
import DiscardChangesModal from "@/features/banners/components/modals/DiscardChangesModal";

import { saveBanner as saveStoredBanner } from "@/features/banners/utils/banner-storage";
import type { BannerItem } from "@/features/banners/types/banners.types";

export default function CreateBannerPage(): React.ReactElement {
  const router = useRouter();

  const [bannerName, setBannerName] = useState(
    "Summer Event Staffing Campaign",
  );
  const [headline, setHeadline] = useState(
    "Find the Right Hosté for Your Next Event",
  );
  const [description, setDescription] = useState(
    "Book verified and professional event staff for your next celebration, corporate event, or special occasion.",
  );
  const [ctaText, setCtaText] = useState("Book a Hosté");
  const [ctaLink, setCtaLink] = useState("/bookings");

  const [selectedPlacements, setSelectedPlacements] = useState<string[]>([
    "Homepage",
    "Customer Dashboard",
  ]);
  const [targetAudience, setTargetAudience] = useState("Everyone");
  const [publishingOption, setPublishingOption] = useState<
    "immediate" | "schedule"
  >("schedule");

  const [startDate, setStartDate] = useState("2026-09-01 09:00 AM");
  const [endDate, setEndDate] = useState("2026-09-30 11:59 PM");

  const [isEvergreen, setIsEvergreen] = useState(false);
  const [priorityWeight, setPriorityWeight] = useState("10");

  const [showCta, setShowCta] = useState(true);
  const [allowDismiss, setAllowDismiss] = useState(true);
  const [trackImpressions, setTrackImpressions] = useState(true);
  const [openNewTab, setOpenNewTab] = useState(false);

  const [previewMode, setPreviewMode] = useState<"desktop" | "mobile">(
    "desktop",
  );

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [imageFileName, setImageFileName] = useState("");
  const [imageFileSize, setImageFileSize] = useState("");
  const [imageDimensions, setImageDimensions] = useState("");
  const [imageSelected, setImageSelected] = useState(false);

  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [isRemoveModalOpen, setIsRemoveModalOpen] = useState(false);
  const [isDiscardModalOpen, setIsDiscardModalOpen] = useState(false);
  const [isStatusBannerVisible, setIsStatusBannerVisible] = useState(false);

  const togglePlacement = (name: string) => {
    setSelectedPlacements((prev) =>
      prev.includes(name)
        ? prev.filter((placement) => placement !== name)
        : [...prev, name],
    );
  };

  const handleReplaceImage = () => {
    fileInputRef.current?.click();
  };

  // Store the image as a data URL so it remains available after navigation.
  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const allowedTypes = ["image/png", "image/jpeg", "image/webp"];
    const maxFileSize = 5 * 1024 * 1024;

    if (!allowedTypes.includes(file.type)) {
      alert("Please select a PNG, JPG, or WEBP image.");
      event.target.value = "";
      return;
    }

    if (file.size > maxFileSize) {
      alert("The image size must not exceed 5 MB.");
      event.target.value = "";
      return;
    }

    const reader = new FileReader();

    reader.onload = () => {
      if (typeof reader.result !== "string") {
        alert("Unable to read this image. Please try another image.");
        return;
      }

      const image = new window.Image();

      image.onload = () => {
        setImageDimensions(`${image.width} × ${image.height} px`);
      };

      image.onerror = () => {
        setImageDimensions("Dimensions unavailable");
      };

      image.src = reader.result;
      setImagePreview(reader.result);
      setImageFileName(file.name);
      setImageFileSize(
        file.size >= 1024 * 1024
          ? `${(file.size / (1024 * 1024)).toFixed(2)} MB`
          : `${(file.size / 1024).toFixed(1)} KB`,
      );
      setImageSelected(true);
    };

    reader.onerror = () => {
      alert("Unable to read this image. Please try again.");
    };

    reader.readAsDataURL(file);
    event.target.value = "";
  };

  const handleRemoveImage = () => {
    setImagePreview(null);
    setImageFileName("");
    setImageFileSize("");
    setImageDimensions("");
    setImageSelected(false);
    setIsRemoveModalOpen(false);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Validate and save a banner using the shared banner storage.
  const persistBanner = (status: BannerItem["status"]): boolean => {
    if (!bannerName.trim()) {
      alert("Please provide a banner name.");
      return false;
    }

    if (!headline.trim()) {
      alert("Please provide a headline.");
      return false;
    }

    if (headline.trim().length > 60) {
      alert("The headline must not exceed 60 characters.");
      return false;
    }

    if (!ctaText.trim() || !ctaLink.trim()) {
      alert("Please provide the CTA button text and link.");
      return false;
    }

    if (selectedPlacements.length === 0) {
      alert("Please select at least one banner placement.");
      return false;
    }

    if (status !== "Draft" && (!imageSelected || !imagePreview)) {
      alert("Please upload a banner image before publishing or scheduling.");
      return false;
    }

    if (status !== "Draft" && !isEvergreen) {
      const start = Date.parse(startDate);
      const end = Date.parse(endDate);

      if (Number.isNaN(start) || Number.isNaN(end)) {
        alert("Please enter valid start and end dates.");
        return false;
      }

      if (end <= start) {
        alert("The end date must be later than the start date.");
        return false;
      }

      if (status === "Scheduled" && start <= Date.now()) {
        alert("Choose a future start date and time for a scheduled banner.");
        return false;
      }

      if (status === "Active" && start > Date.now()) {
        alert(
          "The start date is in the future. Choose Schedule for Later instead.",
        );
        return false;
      }
    }

    const now = new Date().toISOString();

    const banner: BannerItem = {
      id: crypto.randomUUID(),
      tag: "EVENT STAFFING",
      tagColor: "orange",
      title: bannerName.trim(),
      description: description.trim(),
      cta: ctaText.trim(),
      ctaLink: ctaLink.trim(),
      placement: selectedPlacements.join(", "),
      audience: targetAudience,
      status,
      startDate: isEvergreen ? "Immediately" : startDate,
      endDate: isEvergreen ? "No expiration" : endDate,
      createdBy: "Super Admin",
      imageUrl: imagePreview ?? undefined,
      publishingOption,
      isEvergreen,
      priorityWeight: Number(priorityWeight) || 0,
      showCta,
      allowDismiss,
      trackImpressions,
      openNewTab,
      createdAt: now,
      updatedAt: now,
    };

    try {
      const saved = saveStoredBanner(banner);

      if (!saved) {
        alert(
          "The banner could not be saved. The browser storage may be full, especially if the image is large.",
        );
        return false;
      }

      return true;
    } catch (error) {
      console.error("Unable to save banner:", error);
      alert("Unable to save this banner. Please try again.");
      return false;
    }
  };

  const handlePublishClick = () => {
    if (publishingOption === "schedule") {
      setIsScheduleModalOpen(true);
      return;
    }

    if (persistBanner("Active")) {
      alert("Banner published successfully!");
      router.push("/banners");
    }
  };

  const handleScheduleLater = () => {
    setPublishingOption("schedule");
    setIsScheduleModalOpen(true);
  };

  const handleScheduleConfirm = () => {
    if (persistBanner("Scheduled")) {
      setIsScheduleModalOpen(false);
      setIsStatusBannerVisible(true);
      alert("Banner scheduled successfully!");
      router.push("/banners");
    }
  };

  const handleSaveDraft = () => {
    if (persistBanner("Draft")) {
      alert("Banner saved as draft.");
      router.push("/banners");
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] font-[Arial,sans-serif] text-[#1A1A1A]">
      <div className="mx-auto min-h-screen w-full max-w-[1400px]">
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

            <button
              type="button"
              onClick={handleSaveDraft}
              className="flex h-[28px] items-center rounded-[5px] border border-[#dfe3ea] bg-white px-[11px] text-[9px] font-semibold text-[#424854] hover:bg-[#f5f6f8]"
            >
              Save as Draft
            </button>

            <button
              type="button"
              onClick={handlePublishClick}
              className="flex h-[28px] items-center rounded-[5px] bg-[#EF5A22] px-[11px] text-[9px] font-semibold text-white hover:bg-[#d94d10]"
            >
              Publish Banner
            </button>
          </div>
        </header>

        <div className="space-y-[14px] px-[8px] pb-[20px] pt-[8px]">
          <p className="px-[8px] text-[10px] text-[#858b98]">
            Create and schedule a promotional banner for the Hosté platform.
          </p>

          {isStatusBannerVisible && (
            <div className="px-[8px]">
              <StatusCalculationBanner
                status="SCHEDULED"
                launchDate={startDate}
              />
            </div>
          )}

          <div className="grid grid-cols-1 items-start gap-[16px] lg:grid-cols-12">
            <div className="space-y-[14px] lg:col-span-7">
              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="mb-[12px] border-b border-[#f0f1f4] pb-[10px] text-[10px] font-bold text-[#1A1A1A]">
                  Banner Information
                </h2>

                <div className="space-y-[12px]">
                  <div>
                    <label className="mb-[4px] block text-[9px] font-semibold text-[#343a44]">
                      Banner Name <span className="text-[#d92d20]">*</span>
                    </label>
                    <input
                      type="text"
                      value={bannerName}
                      onChange={(e) => setBannerName(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                    />
                    <span className="mt-[3px] block text-[8px] text-[#858b98]">
                      Internal name used to identify this banner in the Admin
                      Dashboard.
                    </span>
                  </div>

                  <div>
                    <div className="mb-[4px] flex items-center justify-between">
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
                      maxLength={60}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                    />
                  </div>

                  <div>
                    <div className="mb-[4px] flex items-center justify-between">
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
                      maxLength={160}
                      className="w-full resize-none rounded-[6px] border border-[#dfe3ea] bg-white p-[9px] text-[9px] text-[#1A1A1A] outline-none focus:border-[#EF5A22]"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-[10px]">
                    <div>
                      <label className="mb-[4px] block text-[9px] font-semibold text-[#343a44]">
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
                      <label className="mb-[4px] block text-[9px] font-semibold text-[#343a44]">
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

              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <div className="mb-[12px] flex items-center justify-between border-b border-[#f0f1f4] pb-[10px]">
                  <h2 className="text-[10px] font-bold text-[#1A1A1A]">
                    Banner Image
                  </h2>
                  <span className="rounded-full bg-[#fff3ed] px-[7px] py-[2px] text-[8px] font-semibold text-[#EF5A22]">
                    Required *
                  </span>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImageChange}
                  className="hidden"
                  aria-label="Choose a replacement banner image"
                />

                <div className="flex flex-col items-center gap-[10px] rounded-[8px] border border-dashed border-[#EF5A22] bg-[#FFFFDC]/40 p-[10px] sm:flex-row">
                  {imageSelected && imagePreview ? (
                    <div className="h-[72px] w-[120px] shrink-0 overflow-hidden rounded-[5px] bg-[#f5f6f8]">
                      <Image
                        src={imagePreview}
                        width={120}
                        height={72}
                        unoptimized
                        alt="Selected banner preview"
                        className="h-full w-full object-cover"
                      />
                    </div>
                  ) : (
                    <button
                      type="button"
                      onClick={handleReplaceImage}
                      className="flex h-[72px] w-[120px] shrink-0 flex-col items-center justify-center gap-[5px] rounded-[5px] border border-dashed border-[#dfe3ea] bg-white text-[#858b98] hover:border-[#EF5A22] hover:text-[#EF5A22]"
                    >
                      <ImagePlus size={20} />
                      <span className="text-[8px] font-semibold">
                        Upload image
                      </span>
                    </button>
                  )}

                  <div className="min-w-0 flex-1 space-y-[3px] text-center sm:text-left">
                    {imageSelected ? (
                      <>
                        <div className="flex items-center justify-center gap-[4px] text-[9px] font-bold text-[#176b37] sm:justify-start">
                          <Check size={11} strokeWidth={3} />
                          Image Uploaded Successfully
                        </div>
                        <div className="break-all text-[9px] font-bold text-[#1A1A1A]">
                          {imageFileName}
                        </div>
                        <div className="text-[8px] text-[#858b98]">
                          Size: {imageFileSize} • {imageDimensions}
                          <br />
                          Format:{" "}
                          {imageFileName.toLowerCase().endsWith(".png")
                            ? "PNG"
                            : imageFileName.toLowerCase().endsWith(".webp")
                              ? "WEBP"
                              : "JPG"}
                        </div>
                      </>
                    ) : (
                      <>
                        <div className="text-[9px] font-bold text-[#1A1A1A]">
                          No image selected
                        </div>
                        <div className="text-[8px] text-[#858b98]">
                          Upload a PNG, JPG, or WEBP image to continue.
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-center gap-[6px] pt-[3px] sm:justify-start">
                      <button
                        type="button"
                        onClick={handleReplaceImage}
                        className="rounded-[4px] border border-[#dfe3ea] bg-white px-[8px] py-[3px] text-[8px] font-semibold text-[#424854] hover:bg-[#f5f6f8]"
                      >
                        {imageSelected ? "Replace" : "Upload Image"}
                      </button>
                      {imageSelected && (
                        <button
                          type="button"
                          onClick={() => setIsRemoveModalOpen(true)}
                          className="rounded-[4px] border border-[#fca5a5] bg-[#fff0ef] px-[8px] py-[3px] text-[8px] font-semibold text-[#d92d20]"
                        >
                          Remove
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <div className="space-y-[2px] pt-[8px] text-[8px] text-[#858b98]">
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

              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="mb-[12px] border-b border-[#f0f1f4] pb-[10px] text-[10px] font-bold text-[#1A1A1A]">
                  Placement &amp; Target Audience
                </h2>
                <div className="space-y-[8px]">
                  <div className="flex items-center justify-between">
                    <label className="text-[9px] font-semibold text-[#343a44]">
                      Banner Placement
                    </label>
                    <span className="text-[8px] text-[#858b98]">
                      (Select all that apply)
                    </span>
                  </div>
                  <div className="grid grid-cols-1 gap-[8px] sm:grid-cols-2">
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
                          className={`cursor-pointer rounded-[7px] border p-[9px] transition ${isSelected ? "border-[#EF5A22] bg-[#FFFFDC]" : "border-[#e8eaf0] hover:border-[#dfe3ea]"}`}
                        >
                          <div className="mb-[2px] flex items-center gap-[6px]">
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={() => togglePlacement(name)}
                              onClick={(e) => e.stopPropagation()}
                              className="cursor-pointer rounded accent-[#EF5A22]"
                            />
                            <span className="text-[9px] font-bold text-[#1A1A1A]">
                              {name}
                            </span>
                          </div>
                          <p className="pl-[18px] text-[8px] text-[#858b98]">
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
                  <label className="block text-[9px] font-semibold text-[#343a44]">
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
                        type="button"
                        key={aud}
                        onClick={() => setTargetAudience(aud)}
                        className={`rounded-full border px-[10px] py-[4px] text-[8px] font-semibold transition ${targetAudience === aud ? "border-[#1A1A1A] bg-[#1A1A1A] text-white" : "border-[#dfe3ea] bg-white text-[#555b68] hover:bg-[#f5f6f8]"}`}
                      >
                        {aud}
                      </button>
                    ))}
                  </div>
                </div>
              </section>

              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="mb-[12px] border-b border-[#f0f1f4] pb-[10px] text-[10px] font-bold text-[#1A1A1A]">
                  Publishing Schedule &amp; Status
                </h2>
                <div className="space-y-[6px]">
                  <label className="block text-[9px] font-semibold text-[#343a44]">
                    Publishing Options
                  </label>
                  <div className="grid grid-cols-2 gap-[8px]">
                    <div
                      onClick={() => setPublishingOption("immediate")}
                      className={`flex cursor-pointer items-center gap-[6px] rounded-[7px] border p-[9px] transition ${publishingOption === "immediate" ? "border-[#EF5A22] bg-[#FFFFDC]" : "border-[#e8eaf0] bg-[#fafafa]"}`}
                    >
                      <input
                        type="radio"
                        name="publishingOption"
                        checked={publishingOption === "immediate"}
                        onChange={() => setPublishingOption("immediate")}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer accent-[#EF5A22]"
                      />
                      <span className="text-[9px] font-bold text-[#343a44]">
                        Publish Immediately
                      </span>
                    </div>
                    <div
                      onClick={handleScheduleLater}
                      className={`flex cursor-pointer items-center gap-[6px] rounded-[7px] border p-[9px] transition ${publishingOption === "schedule" ? "border-[#EF5A22] bg-[#FFFFDC]" : "border-[#e8eaf0]"}`}
                    >
                      <input
                        type="radio"
                        name="publishingOption"
                        checked={publishingOption === "schedule"}
                        onChange={handleScheduleLater}
                        onClick={(e) => e.stopPropagation()}
                        className="cursor-pointer accent-[#EF5A22]"
                      />
                      <span className="text-[9px] font-bold text-[#1A1A1A]">
                        Schedule for Later
                      </span>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-[10px] pt-[10px]">
                  <div>
                    <label className="mb-[4px] block text-[9px] font-semibold text-[#343a44]">
                      Start Date &amp; Time
                    </label>
                    <input
                      type="text"
                      value={startDate}
                      onChange={(e) => setStartDate(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none"
                    />
                  </div>
                  <div>
                    <label className="mb-[4px] block text-[9px] font-semibold text-[#343a44]">
                      End Date &amp; Time
                    </label>
                    <input
                      type="text"
                      value={endDate}
                      onChange={(e) => setEndDate(e.target.value)}
                      className="w-full rounded-[6px] border border-[#dfe3ea] bg-white px-[9px] py-[6px] text-[9px] text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div className="mt-[10px] flex items-center justify-between border-t border-[#f0f1f4] pt-[10px]">
                  <div>
                    <span className="block text-[9px] font-bold text-[#1A1A1A]">
                      Set as Evergreen Banner
                    </span>
                    <span className="text-[8px] text-[#858b98]">
                      Keep active continuously without an expiration date.
                    </span>
                  </div>
                  <label className="relative inline-flex cursor-pointer items-center">
                    <input
                      type="checkbox"
                      checked={isEvergreen}
                      onChange={() => setIsEvergreen(!isEvergreen)}
                      className="peer sr-only"
                    />
                    <div className="relative h-[16px] w-[30px] rounded-full bg-[#dfe3ea] after:absolute after:left-[2px] after:top-[2px] after:h-[12px] after:w-[12px] after:rounded-full after:border after:border-[#dfe3ea] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#176b37] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                  </label>
                </div>
              </section>

              <section className="rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <h2 className="mb-[12px] border-b border-[#f0f1f4] pb-[10px] text-[10px] font-bold text-[#1A1A1A]">
                  Display Priority &amp; Banner Toggles
                </h2>
                <div className="flex items-center justify-between">
                  <div>
                    <label className="block text-[9px] font-semibold text-[#343a44]">
                      Display Priority Weight
                    </label>
                    <span className="text-[8px] text-[#858b98]">
                      (Top placement priority for Homepage Carousel)
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="mb-[2px] block text-[8px] text-[#858b98]">
                      Higher value = earlier placement
                    </span>
                    <input
                      type="text"
                      value={priorityWeight}
                      onChange={(e) => setPriorityWeight(e.target.value)}
                      className="w-[70px] rounded-[6px] border border-[#dfe3ea] bg-white px-[8px] py-[5px] text-center text-[9px] font-bold text-[#1A1A1A] outline-none"
                    />
                  </div>
                </div>

                <div className="mt-[10px] space-y-[10px] border-t border-[#f0f1f4] pt-[12px]">
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
                  ].map((toggle) => (
                    <div
                      key={toggle.label}
                      className="flex items-center justify-between"
                    >
                      <span className="text-[9px] font-semibold text-[#343a44]">
                        {toggle.label}
                      </span>
                      <label className="relative inline-flex cursor-pointer items-center">
                        <input
                          type="checkbox"
                          checked={toggle.state}
                          onChange={toggle.setter}
                          className="peer sr-only"
                        />
                        <div className="relative h-[16px] w-[30px] rounded-full bg-[#dfe3ea] after:absolute after:left-[2px] after:top-[2px] after:h-[12px] after:w-[12px] after:rounded-full after:border after:border-[#dfe3ea] after:bg-white after:transition-all after:content-[''] peer-checked:bg-[#176b37] peer-checked:after:translate-x-full peer-checked:after:border-white peer-focus:outline-none" />
                      </label>
                    </div>
                  ))}
                </div>
              </section>

              <section className="flex flex-col items-start justify-between gap-[10px] rounded-[8px] border border-[#e8eaf0] bg-white p-[12px] text-[8px] text-[#858b98] sm:flex-row sm:items-center">
                <div>
                  Created By:{" "}
                  <strong className="text-[#1A1A1A]">
                    Super Admin (John N.)
                  </strong>
                  <br />
                  Created Date:{" "}
                  <strong className="text-[#1A1A1A]">
                    {new Date().toLocaleString()}
                  </strong>
                </div>
                <div className="flex w-full items-center justify-between text-left sm:block sm:w-auto sm:text-right">
                  <div>
                    Last Updated:{" "}
                    <strong className="text-[#1A1A1A]">Just now</strong>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsDiscardModalOpen(true)}
                    className="mt-[4px] rounded-[5px] bg-[#EF5A22] px-[10px] py-[5px] font-semibold text-white transition hover:bg-[#d94d10]"
                  >
                    Discard Changes
                  </button>
                </div>
              </section>
            </div>

            <div className="sticky top-[73px] space-y-[14px] lg:col-span-5">
              <section className="space-y-[12px] rounded-[8px] border border-[#e8eaf0] bg-white p-[15px]">
                <div className="flex items-center justify-between border-b border-[#f0f1f4] pb-[10px]">
                  <h2 className="text-[10px] font-bold text-[#1A1A1A]">
                    Live Platform Preview
                  </h2>
                  <div className="flex items-center rounded-[6px] bg-[#f1f2f5] p-[2px] text-[9px] font-semibold">
                    <button
                      type="button"
                      onClick={() => setPreviewMode("desktop")}
                      className={`rounded-[4px] px-[9px] py-[3px] transition ${previewMode === "desktop" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#858b98] hover:text-[#1A1A1A]"}`}
                    >
                      Desktop
                    </button>
                    <button
                      type="button"
                      onClick={() => setPreviewMode("mobile")}
                      className={`rounded-[4px] px-[9px] py-[3px] transition ${previewMode === "mobile" ? "bg-white text-[#1A1A1A] shadow-sm" : "text-[#858b98] hover:text-[#1A1A1A]"}`}
                    >
                      Mobile
                    </button>
                  </div>
                </div>

                <div
                  className={`space-y-[10px] rounded-[8px] border border-[#e8eaf0] bg-[#f5f6f8] p-[10px] ${previewMode === "mobile" ? "mx-auto max-w-[280px]" : ""}`}
                >
                  <div className="flex items-center justify-between rounded-[5px] border border-[#e8eaf0] bg-white px-[9px] py-[5px] text-[8px] text-[#858b98]">
                    <div className="flex items-center gap-[4px]">
                      <span className="h-[6px] w-[6px] rounded-full bg-[#f87171]" />
                      <span className="h-[6px] w-[6px] rounded-full bg-[#fbbf24]" />
                      <span className="h-[6px] w-[6px] rounded-full bg-[#34d399]" />
                    </div>
                    <div className="flex items-center gap-[3px] rounded border border-[#f0f1f4] bg-[#fafafa] px-[8px] py-[1px] text-[7px] text-[#858b98]">
                      <Globe size={9} />
                      https://hoste.app/homepage-preview
                    </div>
                    <div />
                  </div>

                  <div className="relative flex min-h-[110px] w-full flex-col justify-between overflow-hidden rounded-[6px] bg-gradient-to-r from-[#210905] via-[#5c1c05] to-[#802a06] p-[12px] text-white shadow-md">
                    {imagePreview && (
                      <Image
                        src={imagePreview}
                        alt=""
                        fill
                        sizes="(max-width: 280px) 280px, 100vw"
                        unoptimized
                        className="absolute inset-0 h-full w-full object-cover"
                      />
                    )}
                    <div className="pointer-events-none absolute inset-0 bg-black/30" />
                    <div className="pointer-events-none absolute -bottom-6 -right-6 h-32 w-32 rounded-full bg-amber-950/40 blur-sm" />

                    <div className="relative z-10 flex items-start justify-between">
                      <span className="rounded bg-[#FFFFDC] px-[7px] py-[2px] text-[7px] font-black uppercase tracking-wider text-[#78350f]">
                        EVENT STAFFING
                      </span>
                      {allowDismiss && (
                        <button
                          type="button"
                          aria-label="Dismiss banner preview"
                          className="p-[2px] text-white/80 hover:text-white"
                        >
                          <X size={12} />
                        </button>
                      )}
                    </div>
                    <div className="relative z-10 my-[6px] space-y-[2px]">
                      <h3 className="text-[11px] font-extrabold leading-[13px] tracking-tight">
                        {headline}
                      </h3>
                      <p className="max-w-[260px] text-[8px] leading-[10px] text-[#FFFFDC]/90">
                        {description}
                      </p>
                    </div>
                    {showCta && (
                      <div className="relative z-10">
                        <button
                          type="button"
                          onClick={() => {
                            if (openNewTab)
                              window.open(
                                ctaLink,
                                "_blank",
                                "noopener,noreferrer",
                              );
                            else window.location.href = ctaLink;
                          }}
                          className="flex items-center gap-[3px] rounded-[4px] bg-[#EF5A22] px-[9px] py-[4px] text-[8px] font-bold text-white shadow transition hover:bg-[#d94d10]"
                        >
                          {ctaText}
                          <ArrowRight size={8} />
                        </button>
                      </div>
                    )}
                  </div>
                </div>

                <div className="space-y-[6px] rounded-[8px] border border-[#e8eaf0] bg-[#fafafa] p-[10px] text-[9px]">
                  <div className="border-b border-[#e8eaf0] pb-[6px] font-bold text-[#1A1A1A]">
                    Placement Summary:
                  </div>
                  <div className="space-y-[4px] text-[8px] text-[#555b68]">
                    <div>
                      • Placements:{" "}
                      <strong className="text-[#1A1A1A]">
                        {selectedPlacements.join(", ") || "None selected"}
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
                      <strong className="font-bold text-[#176b37]">
                        {startDate} – {isEvergreen ? "No expiration" : endDate}
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

                <div className="rounded-[8px] border border-[#fef08a] bg-[#FFFFDC] p-[9px] text-center">
                  <span className="flex items-center justify-center gap-[4px] text-[9px] font-bold text-[#713f12]">
                    ⚡ Ready to Schedule Promotional Campaign
                  </span>
                </div>
              </section>
            </div>
          </div>
        </div>

        <ScheduleBannerModal
          isOpen={isScheduleModalOpen}
          onClose={() => setIsScheduleModalOpen(false)}
          onConfirm={handleScheduleConfirm}
          startDate={startDate}
          endDate={isEvergreen ? "No expiration" : endDate}
          placements={selectedPlacements}
          targetAudience={targetAudience}
        />

        <RemoveBannerImageModal
          isOpen={isRemoveModalOpen}
          onClose={() => setIsRemoveModalOpen(false)}
          onConfirm={handleRemoveImage}
        />

        <DiscardChangesModal
          isOpen={isDiscardModalOpen}
          onClose={() => setIsDiscardModalOpen(false)}
          onConfirm={() => {
            setIsDiscardModalOpen(false);
            router.push("/banners");
          }}
        />
      </div>
    </div>
  );
}
