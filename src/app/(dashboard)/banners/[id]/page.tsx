"use client";

import React, { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import {
  ArrowRight,
  BarChart3,
  Check,
  ChevronDown,
  Copy,
  Edit3,
  PauseCircle,
  Smartphone,
  Tablet,
  Trash2,
  X,
} from "lucide-react";

import type { BannerItem } from "@/features/banners/types/banners.types";
import {
  getStoredBanners,
  saveStoredBanners,
  saveBanner as saveStoredBanner,
} from "@/features/banners/utils/banner-storage";

import ActivateBannerModal from "@/features/banners/components/modals/ActivateBannerModal";
import DeactivateBannerModal from "@/features/banners/components/modals/DeactivateBannerModal";
import DuplicateBannerModal from "@/features/banners/components/modals/DuplicateBannerModal";
import DeleteBannerModal from "@/features/banners/components/modals/DeleteBannerModal";

type PreviewMode = "Desktop" | "Tablet" | "Mobile";
type ModalType = "activate" | "deactivate" | "duplicate" | "delete" | null;
type BannerAction =
  | "edit"
  | "activate"
  | "deactivate"
  | "duplicate"
  | "delete"
  | "analytics";

const UPDATE_EVENT = "hoste-banners-updated";
const STORAGE_KEY = "hoste_banner_management_banners";

const auditEvents = [
  {
    title: "Banner Activated",
    description:
      "Banner was activated and set live across platform placements.",
    date: "August 22, 2026 · 2:20 PM",
    color: "bg-[var(--success)]",
  },
  {
    title: "Banner Updated",
    description: "Placement expanded to include 'Customer Dashboard'.",
    date: "August 22, 2026 · 2:15 PM",
    color: "bg-[var(--primary-orange)]",
  },
  {
    title: "Banner Published",
    description: "Super Admin Sarah published the banner campaign.",
    date: "August 20, 2026 · 10:45 AM",
    color: "bg-[var(--dark)]",
  },
  {
    title: "Banner Created",
    description: "Draft created with initial headline and hero banner artwork.",
    date: "August 20, 2026 · 10:32 AM",
    color: "bg-[var(--muted-foreground)]",
  },
];

const metrics = [
  { label: "IMPRESSIONS", value: "12,450", note: "↑ +14% vs avg" },
  { label: "CLICKS", value: "1,842", note: "↑ +8.2%" },
  {
    label: "CTR",
    value: "14.8%",
    note: "Top 5% campaign",
    highlight: true,
  },
  {
    label: "CONVERSIONS",
    value: "326",
    note: "Bookings made",
    success: true,
  },
];

export default function BannerDetailsPage() {
  const params = useParams();
  const router = useRouter();

  const rawId = params.id;
  const bannerId = Array.isArray(rawId) ? rawId[0] : String(rawId ?? "");

  const [banner, setBanner] = useState<BannerItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [previewMode, setPreviewMode] = useState<PreviewMode>("Desktop");
  const [showMoreActions, setShowMoreActions] = useState(false);
  const [showPreview, setShowPreview] = useState(true);
  const [isActive, setIsActive] = useState(false);
  const [modal, setModal] = useState<ModalType>(null);
  const [toast, setToast] = useState("");

  const loadBanner = useCallback(() => {
    if (!bannerId) {
      setBanner(null);
      setIsActive(false);
      setLoading(false);
      return;
    }

    try {
      const savedBanners = getStoredBanners();
      const found = savedBanners.find(
        (item) => String(item.id) === String(bannerId),
      );

      setBanner(found ?? null);
      setIsActive(found?.status === "Active");
    } catch (error) {
      console.error("Failed to load banner details:", error);
      setBanner(null);
      setIsActive(false);
    } finally {
      setLoading(false);
    }
  }, [bannerId]);

  useEffect(() => {
    const initialLoadTimeout = window.setTimeout(loadBanner, 0);

    window.addEventListener(UPDATE_EVENT, loadBanner);

    const handleStorage = (event: StorageEvent) => {
      if (event.key === STORAGE_KEY) {
        loadBanner();
      }
    };

    window.addEventListener("storage", handleStorage);

    return () => {
      window.clearTimeout(initialLoadTimeout);
      window.removeEventListener(UPDATE_EVENT, loadBanner);
      window.removeEventListener("storage", handleStorage);
    };
  }, [loadBanner]);

  const notify = useCallback((message: string) => {
    setToast(message);
    window.setTimeout(() => setToast(""), 3000);
  }, []);

  const updateBanner = useCallback(
    (updatedBanner: BannerItem): boolean => {
      try {
        saveStoredBanner(updatedBanner);
        setBanner(updatedBanner);
        setIsActive(updatedBanner.status === "Active");
        return true;
      } catch (error) {
        console.error("Failed to save banner:", error);
        notify("Unable to save banner changes.");
        return false;
      }
    },
    [notify],
  );

  const openAction = (action: BannerAction) => {
    setShowMoreActions(false);

    if (action === "edit") {
      router.push(`/banners/${encodeURIComponent(bannerId)}/edit`);
      return;
    }

    if (action === "analytics") {
      notify("Connect your banner analytics route.");
      return;
    }

    if (!banner) {
      notify("Banner not found.");
      return;
    }

    setModal(action);
  };

  const handleActivate = useCallback(() => {
    if (!banner) {
      notify("Banner not found.");
      return;
    }

    if (updateBanner({ ...banner, status: "Active" })) {
      setModal(null);
      notify("Banner activated successfully.");
    }
  }, [banner, notify, updateBanner]);

  const handleDeactivate = useCallback(() => {
    if (!banner) {
      notify("Banner not found.");
      return;
    }

    if (updateBanner({ ...banner, status: "Draft" })) {
      setModal(null);
      notify("Banner deactivated successfully.");
    }
  }, [banner, notify, updateBanner]);

  const handleDuplicate = useCallback(() => {
    if (!banner) {
      notify("Banner not found.");
      return;
    }

    try {
      const banners = getStoredBanners();

      const duplicateId =
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${banner.id}-copy-${Date.now()}`;

      const duplicate: BannerItem = {
        ...banner,
        id: duplicateId,
        title: `${banner.title} (Copy)`,
        status: "Draft",
        startDate: "Not set",
        endDate: "Not set",
        createdBy: "Admin User",
      };

      saveStoredBanners([...banners, duplicate]);
      setModal(null);
      notify("Banner duplicated successfully.");
    } catch (error) {
      console.error("Failed to duplicate banner:", error);
      notify("Unable to duplicate banner.");
    }
  }, [banner, notify]);

  const handleDelete = useCallback(() => {
    if (!banner) {
      notify("Banner not found.");
      return;
    }

    try {
      const remaining = getStoredBanners().filter(
        (item) => String(item.id) !== String(bannerId),
      );

      saveStoredBanners(remaining);
      setModal(null);
      router.push("/banners");
    } catch (error) {
      console.error("Failed to delete banner:", error);
      notify("Unable to delete banner.");
    }
  }, [banner, bannerId, notify, router]);

  if (loading) {
    return (
      <div className="p-8 text-xs text-[var(--muted-foreground)]">
        Loading banner details...
      </div>
    );
  }

  if (!banner) {
    return (
      <main className="min-h-screen bg-[var(--background)] p-8 font-sans text-[var(--foreground)]">
        <p className="mb-2 text-sm font-semibold">Banner not found.</p>
        <p className="mb-4 text-xs text-[var(--muted-foreground)]">
          This banner may have been deleted or may not exist in your saved
          banners.
        </p>
        <Link
          href="/banners"
          className="inline-flex items-center gap-2 rounded-md bg-[var(--primary)] px-3 py-2 text-xs font-semibold text-[var(--primary-foreground)] hover:opacity-90"
        >
          <ArrowRight size={13} className="rotate-180" />
          Back to Banners
        </Link>
      </main>
    );
  }

  const currentBanner = banner;

  const mutedSurface = "bg-[var(--muted)]";
  const subtleSurface = "bg-[var(--background)]";
  const cardBorder = "border-[var(--border)]";
  const mainText = "text-[var(--foreground)]";
  const mutedText = "text-[var(--muted-foreground)]";
  const primaryText = "text-[var(--primary-orange)]";
  const primaryButton =
    "bg-[var(--primary)] text-[var(--primary-foreground)] hover:opacity-90";
  const secondaryButton =
    "border border-[var(--border)] bg-[var(--card)] text-[var(--card-foreground)] hover:bg-[var(--muted)]";
  const cardStyle = `rounded-lg border ${cardBorder} bg-[var(--card)]`;

  return (
    <main className="min-h-screen bg-[var(--background)] font-sans text-[var(--foreground)]">
      {/* HEADER */}
      <header
        className={`flex flex-wrap items-center justify-between gap-3 border-b ${cardBorder} bg-[var(--card)] px-4 py-2.5`}
      >
        <div className="min-w-0">
          <div
            className={`mb-0.5 flex items-center gap-1 text-[9px] ${mutedText}`}
          >
            <Link href="/dashboard" className={`hover:${primaryText}`}>
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/banners" className={`hover:${primaryText}`}>
              Banner
            </Link>
            <span>/</span>
            <span className={`font-semibold ${primaryText}`}>
              Banner Details
            </span>
          </div>

          <h1 className={`text-[17px] font-bold leading-tight ${mainText}`}>
            Banner Details
          </h1>

          <p className={`text-[9px] leading-tight ${mutedText}`}>
            Review banner content, placement, audience, schedule, and
            performance settings.
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap items-center gap-1.5">
          <button
            onClick={() => openAction("edit")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[9px] font-semibold ${secondaryButton}`}
          >
            <Edit3 size={11} className={primaryText} />
            Edit Banner
          </button>

          <button
            onClick={() => openAction("duplicate")}
            className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 text-[9px] font-semibold ${secondaryButton}`}
          >
            <Copy size={11} />
            Duplicate
          </button>

          <div className="relative">
            <button
              onClick={() => setShowMoreActions((value) => !value)}
              aria-expanded={showMoreActions}
              className="flex items-center gap-1 rounded-md bg-[var(--dark)] px-3 py-1.5 text-[9px] font-semibold text-[var(--dark-foreground)] hover:opacity-90"
            >
              More Actions
              <ChevronDown size={11} />
            </button>

            {showMoreActions && (
              <div
                className={`absolute right-0 top-full z-30 mt-1 w-40 rounded-md border ${cardBorder} bg-[var(--popover)] p-1 shadow-[var(--shadow-card)]`}
              >
                <ActionMenuItem
                  icon={<Edit3 size={12} />}
                  label="Edit Banner"
                  onClick={() => openAction("edit")}
                />
                <ActionMenuItem
                  icon={<Copy size={12} />}
                  label="Duplicate"
                  onClick={() => openAction("duplicate")}
                />
                <ActionMenuItem
                  icon={<BarChart3 size={12} />}
                  label="View Analytics"
                  onClick={() => openAction("analytics")}
                />
                <ActionMenuItem
                  icon={<PauseCircle size={12} />}
                  label={isActive ? "Deactivate Banner" : "Activate Banner"}
                  onClick={() =>
                    openAction(isActive ? "deactivate" : "activate")
                  }
                />
                <ActionMenuItem
                  icon={<Trash2 size={12} />}
                  label="Delete Banner"
                  danger
                  onClick={() => openAction("delete")}
                />
              </div>
            )}
          </div>
        </div>
      </header>

      <div className="space-y-3 p-3">
        {/* BANNER SUMMARY */}
        <section className={`${cardStyle} px-4 py-3`}>
          <div className="mb-2 flex flex-wrap items-center gap-2">
            <h2 className={`text-[12px] font-bold ${mainText}`}>
              {currentBanner.title}
            </h2>

            <span
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-0.5 text-[8px] font-bold ${
                isActive
                  ? "bg-[var(--secondary-green)]/10 text-[var(--secondary-green)]"
                  : "bg-[var(--destructive)]/10 text-[var(--destructive)]"
              }`}
            >
              <span className="h-1.5 w-1.5 rounded-full bg-current" />
              {isActive ? "ACTIVE" : "INACTIVE"}
            </span>
          </div>

          <div
            className={`grid grid-cols-1 gap-x-4 gap-y-1.5 text-[8px] sm:grid-cols-4 ${mutedText}`}
          >
            <p>
              Placement:{" "}
              <strong className={`font-semibold ${mainText}`}>
                {currentBanner.placement}
              </strong>
            </p>

            <p>
              Target Audience:{" "}
              <strong className={`font-semibold ${mainText}`}>
                {currentBanner.audience}
              </strong>
            </p>

            <p>
              Created by:{" "}
              <strong className={`font-medium ${mainText}`}>
                {currentBanner.createdBy || "Admin Sarah"}
              </strong>
            </p>

            <p>
              Updated:{" "}
              <strong className={`font-medium ${mainText}`}>
                Aug 22, 2026
              </strong>
            </p>
          </div>
        </section>

        {/* PLATFORM PREVIEW */}
        <section className={`${cardStyle} p-3`}>
          <div className="mb-3 flex items-center justify-between gap-2">
            <h3 className={`text-[10px] font-bold ${mainText}`}>
              Banner Live Platform Preview
            </h3>

            <div
              className={`flex items-center gap-0.5 rounded-md p-0.5 ${mutedSurface}`}
            >
              {(
                [
                  { label: "Desktop", icon: null },
                  { label: "Tablet", icon: Tablet },
                  { label: "Mobile", icon: Smartphone },
                ] as const
              ).map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    onClick={() => setPreviewMode(item.label)}
                    className={`flex items-center gap-1 rounded px-2 py-1 text-[8px] ${
                      previewMode === item.label
                        ? "bg-[var(--card)] font-bold text-[var(--foreground)] shadow-[var(--shadow-soft)]"
                        : mutedText
                    }`}
                  >
                    {Icon && <Icon size={10} />}
                    {item.label}
                  </button>
                );
              })}
            </div>
          </div>

          {showPreview ? (
            <div className="flex justify-center overflow-hidden rounded-lg">
              <div
                className={`relative min-h-[158px] overflow-hidden rounded-lg bg-[var(--dark)] px-5 py-6 text-[var(--dark-foreground)] transition-all sm:px-7 ${
                  previewMode === "Desktop"
                    ? "w-full"
                    : previewMode === "Tablet"
                      ? "w-4/5"
                      : "w-[340px] max-w-full"
                }`}
              >
                <div
                  aria-hidden="true"
                  className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[var(--dark)] via-[var(--primary-orange)]/60 to-[var(--primary-orange)]/30"
                />

                <div className="relative z-10">
                  <button
                    onClick={() => setShowPreview(false)}
                    aria-label="Close preview"
                    className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[var(--dark)] text-[var(--dark-foreground)] hover:opacity-80"
                  >
                    <X size={10} />
                  </button>

                  <span className="mb-2 inline-block rounded bg-[var(--card)] px-2.5 py-0.5 text-[7px] font-bold text-[var(--foreground)]">
                    VERIFIED HOSTÉS
                  </span>

                  <h2 className="mb-2 pr-5 text-[16px] font-bold leading-tight">
                    {currentBanner.title}
                  </h2>

                  <p className="mb-4 max-w-[440px] text-[9px] leading-[1.5] opacity-90">
                    Book verified and professional event staff for your next
                    celebration, corporate event, or special occasion. Vetted
                    hosts, bartenders, ushers, and brand ambassadors ready to
                    elevate your experience.
                  </p>

                  <button
                    onClick={() => notify("Preview CTA clicked.")}
                    className={`flex items-center gap-1 rounded-md px-4 py-2 text-[9px] font-bold ${primaryButton}`}
                  >
                    {currentBanner.cta || "Book a Hosté"}
                    <ArrowRight size={11} />
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <button
              onClick={() => setShowPreview(true)}
              className={`text-[10px] font-semibold ${primaryText}`}
            >
              Show banner preview
            </button>
          )}
        </section>

        {/* BANNER INFORMATION AND PLACEMENT */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <section className={`min-w-0 ${cardStyle} p-3`}>
            <div
              className={`mb-3 flex items-center justify-between border-b ${cardBorder} pb-2`}
            >
              <h3 className={`text-[10px] font-bold ${mainText}`}>
                Banner Information
              </h3>

              <button
                onClick={() => openAction("edit")}
                className={`text-[8px] font-semibold hover:underline ${primaryText}`}
              >
                Edit
              </button>
            </div>

            <div className="space-y-3">
              <InfoField label="BANNER NAME" value={currentBanner.title} />
              <InfoField label="HEADLINE" value={currentBanner.title} />
              <InfoField
                label="DESCRIPTION"
                value="Book verified and professional event staff for your next celebration, corporate event, or special occasion."
              />

              <div className="grid grid-cols-3 gap-2">
                <InfoField
                  label="CTA TEXT"
                  value={currentBanner.cta || "Book a Hosté"}
                  bold
                />
                <InfoField label="DESTINATION" value="Booking Marketplace" />
                <InfoField label="CTA LINK" value="/bookings" orange />
              </div>
            </div>
          </section>

          <section className={`min-w-0 ${cardStyle} p-3`}>
            <div className={`mb-3 border-b ${cardBorder} pb-2`}>
              <h3 className={`text-[10px] font-bold ${mainText}`}>
                Placement &amp; Target Audience
              </h3>
            </div>

            <p className={`mb-2 text-[8px] font-bold ${mutedText}`}>
              ACTIVE PLACEMENTS
            </p>

            <div className="mb-4 flex flex-wrap gap-1.5">
              {currentBanner.placement
                .split(",")
                .map((placement) => placement.trim())
                .filter(Boolean)
                .map((placement) => (
                  <span
                    key={placement}
                    className={`rounded-full border border-[var(--primary-orange)] bg-[var(--primary-orange)]/5 px-3 py-1 text-[8px] font-semibold ${mainText}`}
                  >
                    {placement}
                  </span>
                ))}
            </div>

            <p className={`mb-2 text-[8px] font-bold ${mutedText}`}>
              TARGET AUDIENCE GROUPS
            </p>

            <span className="mb-5 inline-flex rounded-full bg-[var(--dark)] px-4 py-1 text-[8px] font-bold text-[var(--dark-foreground)]">
              {currentBanner.audience}
            </span>

            <div
              className={`rounded-lg border ${cardBorder} ${subtleSurface} p-2.5`}
            >
              <p className="mb-1 flex items-center gap-1 text-[9px] font-bold text-[var(--success)]">
                <Check size={10} />
                Visibility {isActive ? "Active" : "Inactive"}
              </p>

              <p className={`text-[8px] leading-relaxed ${mutedText}`}>
                This banner is currently {isActive ? "visible" : "inactive"} for{" "}
                {currentBanner.audience} on the selected Hosté platform
                locations.
              </p>
            </div>
          </section>
        </div>

        {/* SCHEDULE AND PERFORMANCE */}
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
          <section className={`min-w-0 ${cardStyle} p-3`}>
            <div className={`mb-3 border-b ${cardBorder} pb-2`}>
              <h3 className={`text-[10px] font-bold ${mainText}`}>
                Publishing Schedule &amp; Settings
              </h3>
            </div>

            <div className="mb-3 grid grid-cols-2 gap-x-3 gap-y-3">
              <div>
                <p className={`mb-1 text-[8px] font-bold ${mutedText}`}>
                  PUBLISHING STATUS
                </p>

                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-[8px] font-bold ${
                    isActive
                      ? "bg-[var(--secondary-green)]/10 text-[var(--secondary-green)]"
                      : "bg-[var(--destructive)]/10 text-[var(--destructive)]"
                  }`}
                >
                  {isActive ? "ACTIVE" : "INACTIVE"}
                </span>
              </div>

              <InfoField
                label="TIMEZONE"
                value="West Africa Time (WAT / UTC+1)"
              />
              <InfoField
                label="START DATE & TIME"
                value={currentBanner.startDate}
                bold
              />
              <InfoField
                label="END DATE & TIME"
                value={currentBanner.endDate}
                bold
              />
            </div>

            <div className={`border-t ${cardBorder} pt-3`}>
              <h4 className={`mb-3 text-[9px] font-bold ${mainText}`}>
                Display Configuration Indicators
              </h4>

              <div className="grid grid-cols-2 gap-x-3 gap-y-3">
                <ConfigItem
                  label="Display Priority:"
                  value="High (Priority Weight: 1)"
                />
                <ConfigItem label="Multiple Banners:" value="Yes" />
                <ConfigItem label="Show CTA Button:" value="Enabled" />
                <ConfigItem label="Track Clicks (CTR):" value="Enabled" />
                <ConfigItem label="Allow Banner Dismissal:" value="Enabled" />
                <ConfigItem label="Track Impressions:" value="Enabled" />
              </div>
            </div>
          </section>

          <section className={`min-w-0 ${cardStyle} p-3`}>
            <div
              className={`mb-3 flex items-center justify-between gap-2 border-b ${cardBorder} pb-2`}
            >
              <h3 className={`text-[10px] font-bold ${mainText}`}>
                Banner Performance Summary
              </h3>

              <button
                onClick={() => openAction("analytics")}
                className={`flex shrink-0 items-center gap-1 text-[8px] font-bold hover:underline ${primaryText}`}
              >
                View Full Analytics
                <ArrowRight size={10} />
              </button>
            </div>

            <div className="mb-4 grid grid-cols-2 gap-1.5 sm:grid-cols-4">
              {metrics.map((metric) => (
                <div
                  key={metric.label}
                  className={`min-w-0 rounded-md border ${cardBorder} ${subtleSurface} p-2`}
                >
                  <p className={`mb-1 truncate text-[7px] ${mutedText}`}>
                    {metric.label}
                  </p>

                  <p
                    className={`mb-1 text-[13px] font-bold ${
                      metric.highlight
                        ? primaryText
                        : metric.success
                          ? "text-[var(--success)]"
                          : mainText
                    }`}
                  >
                    {metric.value}
                  </p>

                  <p className="text-[7px] font-semibold text-[var(--success)]">
                    {metric.note}
                  </p>
                </div>
              ))}
            </div>

            <h4 className={`mb-2 text-[8px] font-bold ${mainText}`}>
              Activity Trend (Past 7 Days)
            </h4>

            <div
              className={`rounded-md border ${cardBorder} ${subtleSurface} p-2`}
            >
              <svg
                viewBox="0 0 300 105"
                className="h-[90px] w-full"
                preserveAspectRatio="none"
                role="img"
                aria-label="Activity trend over the past seven days"
              >
                <defs>
                  <linearGradient id="trendFill" x1="0" y1="0" x2="0" y2="1">
                    <stop
                      offset="0%"
                      stopColor="var(--secondary-green)"
                      stopOpacity=".25"
                    />
                    <stop
                      offset="100%"
                      stopColor="var(--secondary-green)"
                      stopOpacity=".02"
                    />
                  </linearGradient>
                </defs>

                <path
                  d="M5 77 L40 65 L75 69 L110 47 L145 50 L180 29 L215 35 L250 12 L290 23 L290 91 L5 91 Z"
                  fill="url(#trendFill)"
                />

                <polyline
                  points="5,77 40,65 75,69 110,47 145,50 180,29 215,35 250,12 290,23"
                  fill="none"
                  stroke="var(--secondary-green)"
                  strokeWidth="1.5"
                  strokeLinejoin="round"
                />

                <circle
                  cx="180"
                  cy="29"
                  r="2.5"
                  fill="var(--secondary-green)"
                />
                <circle cx="250" cy="12" r="2.5" fill="var(--primary-orange)" />

                <g fill="var(--muted-foreground)" fontSize="7">
                  <text x="5" y="102">
                    Aug 18
                  </text>
                  <text x="92" y="102">
                    Aug 20
                  </text>
                  <text x="185" y="102">
                    Aug 22
                  </text>
                  <text x="266" y="102">
                    Today
                  </text>
                </g>
              </svg>
            </div>
          </section>
        </div>

        {/* AUDIT ACTIVITY LOG */}
        <section className={`${cardStyle} p-3`}>
          <div
            className={`mb-2 flex items-center justify-between gap-2 border-b ${cardBorder} pb-3`}
          >
            <h3 className={`text-[10px] font-bold ${mainText}`}>
              Banner Audit Activity Log
            </h3>

            <button
              onClick={() => notify("Connect your full activity log route.")}
              className={`flex shrink-0 items-center gap-1 text-[8px] font-bold hover:underline ${primaryText}`}
            >
              View Activity Log
              <ArrowRight size={10} />
            </button>
          </div>

          <div>
            {auditEvents.map((event, index) => (
              <div
                key={event.title}
                className="grid grid-cols-[10px_minmax(0,1fr)] gap-x-2 gap-y-1 py-2 sm:grid-cols-[10px_135px_minmax(0,1fr)_140px] sm:items-center sm:gap-x-3"
              >
                <div className="relative row-span-3 flex justify-center self-stretch sm:row-span-1 sm:self-center">
                  <span
                    className={`relative z-10 mt-1 h-2 w-2 rounded-full ${event.color}`}
                  />

                  {index < auditEvents.length - 1 && (
                    <span
                      className={`absolute bottom-[-12px] top-3 w-px ${mutedSurface}`}
                    />
                  )}
                </div>

                <p className={`text-[8px] font-bold ${mainText}`}>
                  {event.title}
                </p>
                <p className={`text-[8px] leading-relaxed ${mutedText}`}>
                  {event.description}
                </p>
                <time className={`text-[8px] sm:text-right ${mutedText}`}>
                  {event.date}
                </time>
              </div>
            ))}
          </div>
        </section>

        {/* QUICK ACTIONS */}
        <section
          className={`flex flex-wrap items-center gap-2 ${cardStyle} p-3`}
        >
          <h3 className={`mr-2 text-[9px] font-bold ${mainText}`}>
            Quick Actions (Active Status):
          </h3>

          <button
            onClick={() => openAction("edit")}
            className={`flex items-center gap-1 rounded-md px-3 py-2 text-[9px] font-bold ${primaryButton}`}
          >
            <Edit3 size={10} />
            Edit Banner
          </button>

          <button
            onClick={() => openAction("duplicate")}
            className={`flex items-center gap-1 rounded-md px-3 py-2 text-[9px] font-semibold ${secondaryButton}`}
          >
            <Copy size={10} />
            Duplicate
          </button>

          <button
            onClick={() => openAction(isActive ? "deactivate" : "activate")}
            className={`flex items-center gap-1 rounded-md border px-3 py-2 text-[9px] font-semibold ${
              isActive
                ? "border-[var(--destructive)] bg-[var(--destructive)]/5 text-[var(--destructive)] hover:bg-[var(--destructive)]/10"
                : "border-[var(--success)] bg-[var(--success)]/5 text-[var(--success)] hover:bg-[var(--success)]/10"
            }`}
          >
            <PauseCircle size={10} />
            {isActive ? "Deactivate Banner" : "Activate Banner"}
          </button>

          <button
            onClick={() => openAction("analytics")}
            className="flex items-center gap-1 rounded-md bg-[var(--dark)] px-3 py-2 text-[9px] font-semibold text-[var(--dark-foreground)] hover:opacity-90"
          >
            <BarChart3 size={10} />
            View Analytics
          </button>

          <button
            onClick={() => openAction("delete")}
            className={`flex items-center gap-1 rounded-md border ${cardBorder} px-3 py-2 text-[9px] font-semibold text-[var(--destructive)] hover:bg-[var(--destructive)]/5`}
          >
            <Trash2 size={10} />
            Delete
          </button>
        </section>
      </div>

      {/* DEDICATED BANNER MODALS */}
      <ActivateBannerModal
        isOpen={modal === "activate"}
        onClose={() => setModal(null)}
        onConfirm={handleActivate}
      />

      <DeactivateBannerModal
        isOpen={modal === "deactivate"}
        onClose={() => setModal(null)}
        onConfirm={handleDeactivate}
      />

      <DuplicateBannerModal
        isOpen={modal === "duplicate"}
        onClose={() => setModal(null)}
        onConfirm={handleDuplicate}
      />

      <DeleteBannerModal
        isOpen={modal === "delete"}
        onClose={() => setModal(null)}
        onConfirm={handleDelete}
      />

      {/* TOAST */}
      {toast && (
        <div className="fixed bottom-4 right-4 z-[60] flex items-center gap-2 rounded-md bg-[var(--dark)] px-3 py-2.5 text-[10px] text-[var(--dark-foreground)] shadow-[var(--shadow-card)]">
          <Check size={13} className="text-[var(--success)]" />
          {toast}

          <button
            onClick={() => setToast("")}
            aria-label="Dismiss notification"
          >
            <X size={12} />
          </button>
        </div>
      )}
    </main>
  );
}

function InfoField({
  label,
  value,
  bold = false,
  orange = false,
}: {
  label: string;
  value: string;
  bold?: boolean;
  orange?: boolean;
}) {
  return (
    <div className="min-w-0">
      <p className="mb-1 text-[8px] font-medium text-[var(--muted-foreground)]">
        {label}
      </p>

      <p
        className={`break-words text-[8px] leading-[1.5] ${
          orange
            ? "font-bold text-[var(--primary-orange)]"
            : bold
              ? "font-semibold text-[var(--foreground)]"
              : "text-[var(--foreground)]"
        }`}
      >
        {value}
      </p>
    </div>
  );
}

function ConfigItem({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex min-w-0 items-start justify-between gap-1 text-[8px]">
      <span className="text-[var(--muted-foreground)]">{label}</span>

      <span className="flex shrink-0 items-center gap-0.5 font-semibold text-[var(--success)]">
        <Check size={9} />
        {value}
      </span>
    </div>
  );
}

function ActionMenuItem({
  icon,
  label,
  onClick,
  danger = false,
}: {
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
  danger?: boolean;
}) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2 rounded px-2 py-2 text-left text-[10px] hover:bg-[var(--muted)] ${
        danger
          ? "text-[var(--destructive)]"
          : "text-[var(--popover-foreground)]"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}
