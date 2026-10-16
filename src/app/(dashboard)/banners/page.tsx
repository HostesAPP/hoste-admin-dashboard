"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  Search,
  Plus,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  MoreHorizontal,
  Check,
  ArrowRight,
} from "lucide-react";

interface BannerItem {
  id: string;
  tag: string;
  tagColor: string;
  title: string;
  cta: string;
  placement: string;
  audience: string;
  status: "Active" | "Scheduled" | "Draft";
  startDate: string;
  endDate: string;
  createdBy: string;
}

const initialBanners: BannerItem[] = [
  {
    id: "1",
    tag: "PREMIUM",
    tagColor: "bg-[#ed5717]",
    title: "Find the Right Hosté for Your Next Event",
    cta: "CTA: Book a Hosté • Top banner high priority",
    placement: "Homepage",
    audience: "Customers",
    status: "Active",
    startDate: "01 Aug 2026",
    endDate: "31 Aug 2026",
    createdBy: "Admin User",
  },
  {
    id: "2",
    tag: "PLANNERS",
    tagColor: "bg-[#292929]",
    title: "Make Your Event Stand Out",
    cta: "CTA: Explore Hostés • Corporate campaign",
    placement: "Homepage",
    audience: "Event Planners",
    status: "Active",
    startDate: "10 Aug 2026",
    endDate: "10 Sep 2026",
    createdBy: "Sarah M.",
  },
  {
    id: "3",
    tag: "STAFFING",
    tagColor: "bg-[#17683c]",
    title: "Professional Event Staff, When You Need Them",
    cta: "CTA: Book Now • Automated launch promo",
    placement: "Customer Dashboard",
    audience: "Customers",
    status: "Scheduled",
    startDate: "01 Sep 2026",
    endDate: "30 Sep 2026",
    createdBy: "Chikwado N.",
  },
  {
    id: "4",
    tag: "PLANNING",
    tagColor: "bg-[#ed5717]",
    title: "Plan Your Next Event With Hosté",
    cta: "CTA: Find Event Staff • Planners Portal",
    placement: "Event Planner Dashboard",
    audience: "Event Planners",
    status: "Active",
    startDate: "15 Aug 2026",
    endDate: "15 Oct 2026",
    createdBy: "Alex B.",
  },
  {
    id: "5",
    tag: "GROUPS",
    tagColor: "bg-[#555b68]",
    title: "Need Staff for Your Next Event?",
    cta: "CTA: Get Started • Group leader target",
    placement: "Homepage",
    audience: "Everyone",
    status: "Draft",
    startDate: "Not set",
    endDate: "Not set",
    createdBy: "Chikwado N.",
  },
  {
    id: "6",
    tag: "VERIFIED",
    tagColor: "bg-[#17683c]",
    title: "Verified Hostés You Can Trust",
    cta: "CTA: View Hostés • Safety & trust highlight",
    placement: "Customer Dashboard",
    audience: "Customers",
    status: "Scheduled",
    startDate: "05 Sep 2026",
    endDate: "25 Sep 2026",
    createdBy: "Admin User",
  },
];

export default function BannerManagement() {
  const [banners] = useState<BannerItem[]>(initialBanners);
  const [activeMenuId, setActiveMenuId] = useState<string | null>("3");
  const [selectedTab, setSelectedTab] = useState("All (24)");
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [placementFilter, setPlacementFilter] = useState("All");
  const [audienceFilter, setAudienceFilter] = useState("Everyone");
  const [dateFilter, setDateFilter] = useState("All Time");
  const [previewId, setPreviewId] = useState("1");
  const [page, setPage] = useState(1);

  const toggleMenu = (id: string) => {
    setActiveMenuId((previous) => (previous === id ? null : id));
  };

  const filteredBanners = banners.filter((banner) => {
    const matchesSearch = `${banner.title} ${banner.tag} ${banner.createdBy}`
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || banner.status === statusFilter;

    const matchesPlacement =
      placementFilter === "All" || banner.placement === placementFilter;

    const matchesAudience =
      audienceFilter === "Everyone" || banner.audience === audienceFilter;

    const matchesTab =
      selectedTab.startsWith("All") ||
      (selectedTab.startsWith("Active") && banner.status === "Active") ||
      (selectedTab.startsWith("Scheduled") && banner.status === "Scheduled") ||
      (selectedTab.startsWith("Drafts") && banner.status === "Draft");

    return (
      matchesSearch &&
      matchesStatus &&
      matchesPlacement &&
      matchesAudience &&
      matchesTab
    );
  });

  const previewBanner =
    banners.find((banner) => banner.id === previewId) ?? banners[0];

  const toggleSelected = (id: string) => {
    setSelectedIds((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  };

  const resetFilters = () => {
    setSearch("");
    setStatusFilter("All");
    setPlacementFilter("All");
    setAudienceFilter("Everyone");
    setDateFilter("All Time");
    setSelectedTab("All (24)");
    setPage(1);
  };

  return (
    <main className="min-h-screen bg-[#fafafa] font-[Arial,sans-serif] text-[#262626]">
      <div className="mx-auto min-h-screen w-full max-w-[1400px]">
        {/* Fixed Header */}
        <header className="sticky top-0 z-50 flex h-[61px] items-center justify-between border-b border-[#e9eaed] bg-white px-[19px]">
          <div>
            <div className="mb-[2px] text-[9px] text-[#858b98]">
              Dashboard <span className="mx-[3px]">/</span>
              <span className="font-semibold text-[#ed5717]">Banner</span>
            </div>

            <h1 className="text-[15px] font-bold leading-[18px] tracking-[-0.3px]">
              Banner Management
            </h1>
          </div>

          <div className="flex items-center gap-[8px]">
            <div className="hidden h-[28px] w-[135px] items-center gap-[5px] rounded-[6px] bg-[#f3f4f6] px-[7px] sm:flex">
              <Search size={13} className="shrink-0 text-[#9aa2b0]" />
              <input
                placeholder="Search platform..."
                className="w-full bg-transparent text-[9px] outline-none placeholder:text-[#9aa2b0]"
              />
            </div>

            {/* Wired up Create Banner button */}
            <Link
              href="/banners/create"
              className="flex h-[28px] items-center gap-[4px] rounded-[5px] bg-[#ed5717] px-[11px] text-[9px] font-semibold text-white hover:bg-[#d94d10] transition"
            >
              <Plus size={12} />
              Create Banner
            </Link>
          </div>
        </header>

        <div className="px-[8px] pb-[8px] pt-[8px] sm:px-[8px]">
          <p className="mb-[10px] px-[8px] text-[10px] text-[#858b98]">
            Create, manage, schedule, and monitor promotional banners across the
            Hosté platform.
          </p>

          {/* Statistics */}
          <section className="mb-[12px] grid grid-cols-2 gap-[8px] sm:grid-cols-5">
            <StatCard
              title="Total Banners"
              value="24"
              badge="All time"
              badgeClass="bg-[#f1f2f5] text-[#555b68]"
            />

            <StatCard
              title="Active"
              value="8"
              badge="● Live now"
              badgeClass="bg-[#e5f4e9] text-[#176b37]"
            />

            <StatCard
              title="Scheduled"
              value="5"
              badge="Upcoming"
              badgeClass="bg-[#edf3ff] text-[#2458df]"
            />

            <StatCard
              title="Drafts"
              value="7"
              badge="Pending"
              badgeClass="bg-[#fff1c7] text-[#936600]"
            />

            <StatCard
              title="Expired / Inactive"
              value="4"
              badge="Ended"
              badgeClass="bg-[#f0f1f4] text-[#666b76]"
            />
          </section>

          {/* Filter Bar */}
          <section className="mb-[10px] flex min-h-[43px] flex-wrap items-center gap-[6px] rounded-[9px] border border-[#e8eaf0] bg-white px-[8px] py-[7px]">
            <div className="flex h-[28px] min-w-[130px] flex-1 items-center gap-[5px] rounded-[5px] border border-[#dfe3ea] px-[7px]">
              <Search size={12} className="shrink-0 text-[#9aa2b0]" />

              <input
                value={search}
                onChange={(event) => {
                  setSearch(event.target.value);
                  setPage(1);
                }}
                placeholder="Search banners..."
                className="w-full min-w-0 bg-transparent text-[9px] outline-none placeholder:text-[#9aa2b0]"
              />
            </div>

            <FilterSelect
              label="Status"
              value={statusFilter}
              options={["All", "Active", "Scheduled", "Draft"]}
              onChange={(value) => {
                setStatusFilter(value);
                setPage(1);
              }}
            />

            <FilterSelect
              label="Placement"
              value={placementFilter}
              options={[
                "All",
                "Homepage",
                "Customer Dashboard",
                "Event Planner Dashboard",
              ]}
              onChange={(value) => {
                setPlacementFilter(value);
                setPage(1);
              }}
            />

            <FilterSelect
              label="Audience"
              value={audienceFilter}
              options={["Everyone", "Customers", "Event Planners"]}
              onChange={(value) => {
                setAudienceFilter(value);
                setPage(1);
              }}
            />

            <FilterSelect
              label="Date"
              value={dateFilter}
              options={["All Time", "This Month", "Last Month"]}
              onChange={(value) => {
                setDateFilter(value);
                setPage(1);
              }}
            />

            <button
              onClick={resetFilters}
              className="h-[28px] rounded-[5px] border border-[#dfe3ea] bg-[#f5f6f8] px-[9px] text-[9px] font-semibold text-[#424854] hover:bg-[#eceef2]"
            >
              Reset Filters
            </button>
          </section>

          {/* Tabs */}
          <section className="mb-[9px] flex h-[31px] items-center gap-[5px] overflow-x-auto rounded-[7px] border border-[#e8eaf0] bg-white px-[9px]">
            {["All (24)", "Active (8)", "Scheduled (5)", "Drafts (7)"].map(
              (tab) => (
                <button
                  key={tab}
                  onClick={() => {
                    setSelectedTab(tab);
                    setPage(1);
                  }}
                  className={`h-[21px] shrink-0 rounded-[4px] px-[12px] text-[9px] font-semibold ${
                    selectedTab === tab
                      ? "bg-[#222222] text-white"
                      : "bg-[#f1f2f5] text-[#555b68] hover:bg-[#e7e9ed]"
                  }`}
                >
                  {tab}
                </button>
              ),
            )}
          </section>

          {/* Table */}
          <section className="relative overflow-visible rounded-[8px] border border-[#e8eaf0] bg-white">
            <div className="max-h-[600px] overflow-auto">
              <table className="w-full min-w-[900px] table-fixed border-collapse text-left">
                <colgroup>
                  <col className="w-[4.5%]" />
                  <col className="w-[28.5%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10.5%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[10%]" />
                  <col className="w-[8%]" />
                  <col className="w-[8.5%]" />
                </colgroup>

                <thead className="sticky top-0 z-20 bg-[#fafbfc]">
                  <tr className="h-[32px] bg-[#fafbfc] text-[8px] font-bold uppercase text-[#687184]">
                    <th className="bg-[#fafbfc] px-[10px]">
                      <span className="flex h-[12px] w-[12px] items-center justify-center rounded-[3px] bg-[#ed5717] text-white">
                        <Check size={9} strokeWidth={3} />
                      </span>
                    </th>

                    <th className="bg-[#fafbfc] px-[5px]">BANNER DETAILS</th>
                    <th className="bg-[#fafbfc] px-[4px]">PLACEMENT</th>
                    <th className="bg-[#fafbfc] px-[4px]">AUDIENCE</th>
                    <th className="bg-[#fafbfc] px-[4px]">STATUS</th>
                    <th className="bg-[#fafbfc] px-[4px]">START DATE</th>
                    <th className="bg-[#fafbfc] px-[4px]">END DATE</th>
                    <th className="bg-[#fafbfc] px-[4px]">CREATED BY</th>
                    <th className="bg-[#fafbfc] px-[3px]">ACTIONS</th>
                  </tr>
                </thead>

                <tbody>
                  {filteredBanners.map((item) => {
                    const isMenuOpen = activeMenuId === item.id;

                    return (
                      <tr
                        key={item.id}
                        onClick={() => setPreviewId(item.id)}
                        className={`h-[49px] cursor-pointer border-t border-[#eff0f3] ${
                          isMenuOpen
                            ? "bg-[#fffbed]"
                            : "bg-white hover:bg-[#fcfcfd]"
                        }`}
                      >
                        <td className="px-[10px]">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleSelected(item.id);
                            }}
                            className={`flex h-[13px] w-[13px] items-center justify-center rounded-[3px] border ${
                              selectedIds.includes(item.id)
                                ? "border-[#ed5717] bg-[#ed5717] text-white"
                                : "border-[#d5dbe4] bg-white"
                            }`}
                            aria-label={`Select ${item.title}`}
                          >
                            {selectedIds.includes(item.id) && (
                              <Check size={9} />
                            )}
                          </button>
                        </td>

                        <td className="px-[5px] py-[5px]">
                          <div className="flex items-center gap-[7px]">
                            <div
                              className={`flex h-[30px] w-[44px] shrink-0 items-center justify-center rounded-[4px] text-center text-[6px] font-extrabold tracking-[-0.2px] text-white ${item.tagColor}`}
                            >
                              {item.tag}
                            </div>

                            <div className="min-w-0">
                              <p className="line-clamp-2 text-[9px] font-semibold leading-[11px] text-[#202124]">
                                {item.title}
                              </p>

                              <p className="mt-[2px] truncate text-[8px] leading-[10px] text-[#9298a5]">
                                {item.cta}
                              </p>
                            </div>
                          </div>
                        </td>

                        <td className="px-[4px] text-[8px] font-semibold leading-[10px] text-[#292929]">
                          {item.placement}
                        </td>

                        <td className="px-[4px] text-[8px] leading-[11px] text-[#343434]">
                          {item.audience}
                        </td>

                        <td className="px-[4px]">
                          <StatusBadge status={item.status} />
                        </td>

                        <td
                          className={`px-[4px] text-[8px] ${
                            item.startDate === "Not set"
                              ? "text-[#a1a7b2]"
                              : "text-[#444851]"
                          }`}
                        >
                          {item.startDate}
                        </td>

                        <td
                          className={`px-[4px] text-[8px] ${
                            item.endDate === "Not set"
                              ? "text-[#a1a7b2]"
                              : "text-[#444851]"
                          }`}
                        >
                          {item.endDate}
                        </td>

                        <td className="truncate px-[4px] text-[8px] text-[#444851]">
                          {item.createdBy}
                        </td>

                        <td className="relative px-[3px]">
                          <button
                            onClick={(event) => {
                              event.stopPropagation();
                              toggleMenu(item.id);
                            }}
                            className="flex h-[24px] w-[27px] items-center justify-center rounded-[5px] border border-[#dfe3e9] bg-white text-[#373b44] hover:bg-[#f5f6f8]"
                            aria-label={`Actions for ${item.title}`}
                          >
                            <MoreHorizontal size={15} />
                          </button>

                          {isMenuOpen && (
                            <div
                              onClick={(event) => event.stopPropagation()}
                              className="absolute right-0 top-[28px] z-30 w-[120px] rounded-[5px] border border-[#eceef2] bg-white p-[5px] shadow-[0_3px_12px_rgba(0,0,0,0.08)]"
                            >
                              <button
                                onClick={() => {
                                  setPreviewId(item.id);
                                  setActiveMenuId(null);
                                }}
                                className="block w-full rounded px-[5px] py-[6px] text-left text-[9px] font-semibold hover:bg-[#f5f6f8]"
                              >
                                View
                              </button>

                              <button
                                onClick={() => setActiveMenuId(null)}
                                className="block w-full rounded px-[5px] py-[6px] text-left text-[9px] font-semibold hover:bg-[#f5f6f8]"
                              >
                                Edit
                              </button>

                              <button
                                onClick={() => setActiveMenuId(null)}
                                className="block w-full rounded px-[5px] py-[6px] text-left text-[9px] font-semibold hover:bg-[#f5f6f8]"
                              >
                                Duplicate
                              </button>

                              {item.status === "Scheduled" && (
                                <button
                                  onClick={() => setActiveMenuId(null)}
                                  className="block w-full whitespace-nowrap rounded px-[5px] py-[6px] text-left text-[9px] font-semibold text-[#ed5717] hover:bg-[#fff3ed]"
                                >
                                  Cancel Schedule
                                </button>
                              )}

                              <div className="my-[3px] border-t border-[#eff0f3]" />

                              <button
                                onClick={() => setActiveMenuId(null)}
                                className="block w-full rounded px-[5px] py-[6px] text-left text-[9px] font-semibold text-[#d92d20] hover:bg-[#fff0ef]"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </td>
                      </tr>
                    );
                  })}

                  {/* Empty table space */}
                  {Array.from({
                    length: Math.max(0, 6 - filteredBanners.length),
                  }).map((_, index) => (
                    <tr
                      key={`empty-${index}`}
                      className="h-[49px] border-t border-[#eff0f3]"
                    >
                      <td colSpan={9} />
                    </tr>
                  ))}

                  <tr className="h-[67px] border-t border-[#eff0f3]">
                    <td colSpan={9} />
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Pagination */}
            <div className="flex h-[42px] items-center justify-between border-t border-[#eff0f3] px-[11px]">
              <p className="text-[9px] text-[#858b98]">
                Showing{" "}
                <span className="font-semibold text-[#363941]">1–10</span> of{" "}
                <span className="font-semibold text-[#363941]">24</span> banners
              </p>

              <div className="flex items-center gap-[4px]">
                <PaginationButton disabled>
                  <ChevronLeft size={12} />
                </PaginationButton>

                {[1, 2, 3].map((number) => (
                  <button
                    key={number}
                    onClick={() => setPage(number)}
                    className={`flex h-[23px] w-[22px] items-center justify-center rounded-[4px] border text-[9px] ${
                      page === number
                        ? "border-[#ed5717] bg-[#ed5717] font-semibold text-white"
                        : "border-[#dfe3e9] bg-white text-[#444851] hover:bg-[#f5f6f8]"
                    }`}
                  >
                    {number}
                  </button>
                ))}

                <PaginationButton>
                  <ChevronRight size={12} />
                </PaginationButton>
              </div>
            </div>
          </section>

          {/* Banner Visual Preview */}
          <section className="mt-[16px] w-full max-w-[340px] rounded-[8px] border border-[#e8eaf0] bg-white p-[13px]">
            <h2 className="text-[10px] font-bold text-[#292929]">
              Banner Visual Preview
            </h2>

            <div className="mb-[12px] mt-[8px] border-t border-[#f0f1f4]" />

            <div className="relative h-[90px] overflow-hidden rounded-[6px] bg-[#ed5717]">
              <div className="absolute inset-0 z-[1] px-[12px] pt-[12px]">
                <p className="text-[7px] font-extrabold text-white">
                  {previewBanner.tag === "PREMIUM"
                    ? "HOSTÉ FEATURED"
                    : `HOSTÉ ${previewBanner.tag}`}
                </p>

                <h3 className="mt-[3px] max-w-[280px] text-[11px] font-bold leading-[13px] tracking-[-0.2px] text-white">
                  {previewBanner.title}
                </h3>

                <p className="mt-[3px] text-[8px] text-white/90">
                  Book top-rated event staff and hospitality pros seamlessly.
                </p>

                <button className="mt-[5px] flex h-[19px] items-center gap-[3px] rounded-[3px] bg-white px-[7px] text-[7px] font-bold text-[#242424]">
                  {previewBanner.cta.split("•")[0].replace("CTA: ", "")}
                  <ArrowRight size={8} />
                </button>
              </div>

              <svg
                className="absolute bottom-0 left-0 h-[39px] w-full"
                viewBox="0 0 318 39"
                preserveAspectRatio="none"
                aria-hidden="true"
              >
                <path
                  d="M0 15 C55 3 98 2 154 12 C213 22 266 30 318 12 L318 39 L0 39 Z"
                  fill="#b4491b"
                />

                <path
                  d="M0 26 C65 20 120 24 182 30 C230 35 275 35 318 27 L318 39 L0 39 Z"
                  fill="#a94319"
                />
              </svg>
            </div>

            <div className="mt-[12px] flex flex-wrap items-center gap-x-[14px] gap-y-[5px] text-[8px]">
              <p className="text-[#858b98]">
                Placement:{" "}
                <span className="font-semibold text-[#343434]">
                  {previewBanner.placement}
                </span>
              </p>

              <p className="text-[#858b98]">
                Audience:{" "}
                <span className="font-semibold text-[#343434]">
                  {previewBanner.audience}
                </span>
              </p>

              <p className="whitespace-nowrap text-[#858b98]">
                Schedule:{" "}
                <span className="font-semibold text-[#176b37]">
                  {previewBanner.status} (
                  {previewBanner.startDate === "Not set"
                    ? "Not scheduled"
                    : `${previewBanner.startDate} - ${previewBanner.endDate}`}
                  )
                </span>
              </p>
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}

function StatCard({
  title,
  value,
  badge,
  badgeClass,
}: {
  title: string;
  value: string;
  badge: string;
  badgeClass: string;
}) {
  return (
    <div className="flex h-[61px] min-w-0 items-center justify-between rounded-[8px] border border-[#e8eaf0] bg-white px-[10px]">
      <div className="min-w-0">
        <p className="truncate text-[8px] font-medium text-[#555d6b]">
          {title}
        </p>

        <p className="mt-[5px] text-[17px] font-bold leading-[18px] text-[#252525]">
          {value}
        </p>
      </div>

      <span
        className={`ml-[3px] whitespace-nowrap rounded-full px-[7px] py-[3px] text-[7px] font-semibold ${badgeClass}`}
      >
        {badge}
      </span>
    </div>
  );
}

function FilterSelect({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: string[];
  onChange: (value: string) => void;
}) {
  return (
    <div className="relative flex h-[28px] min-w-0 items-center rounded-[5px] border border-[#dfe3ea] bg-white px-[7px]">
      <label className="flex min-w-0 items-center gap-[3px] text-[9px]">
        <span className="shrink-0 text-[#343a44]">{label}:</span>

        <select
          value={value}
          onChange={(event) => onChange(event.target.value)}
          className="max-w-[105px] cursor-pointer appearance-none truncate bg-transparent pr-[10px] font-semibold text-[#292929] outline-none"
        >
          {options.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      </label>

      <ChevronDown
        size={10}
        className="pointer-events-none absolute right-[5px] text-[#555d68]"
      />
    </div>
  );
}

function StatusBadge({ status }: { status: BannerItem["status"] }) {
  if (status === "Active") {
    return (
      <span className="inline-flex items-center gap-[4px] whitespace-nowrap rounded-full bg-[#e5f4e9] px-[7px] py-[3px] text-[8px] font-semibold text-[#176b37]">
        <span className="h-[5px] w-[5px] rounded-full bg-[#176b37]" />
        Active
      </span>
    );
  }

  if (status === "Scheduled") {
    return (
      <span className="inline-flex whitespace-nowrap rounded-full bg-[#edf3ff] px-[7px] py-[3px] text-[8px] font-semibold text-[#2458df]">
        Scheduled
      </span>
    );
  }

  return (
    <span className="inline-flex whitespace-nowrap rounded-full bg-[#fff1c7] px-[9px] py-[3px] text-[8px] font-semibold text-[#936600]">
      Draft
    </span>
  );
}

function PaginationButton({
  children,
  disabled = false,
}: {
  children: React.ReactNode;
  disabled?: boolean;
}) {
  return (
    <button
      disabled={disabled}
      className="flex h-[23px] w-[23px] items-center justify-center rounded-[4px] border border-[#dfe3e9] bg-[#f5f6f8] text-[#444851] hover:bg-[#eceef2] disabled:cursor-not-allowed disabled:text-[#b9bec7]"
    >
      {children}
    </button>
  );
}
