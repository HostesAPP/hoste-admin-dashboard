"use client";

import React, { useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { Search, Bell, ChevronDown, MoreVertical } from "lucide-react";
import {
  BOOKINGS_DATA,
  type BookingRow,
} from "@/features/bookings/data/bookings.data";

const TABS = [
  "All Bookings",
  "Pending (42)",
  "Confirmed",
  "Ongoing",
  "Completed",
  "Cancelled",
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [searchTerm, setSearchTerm] = useState("");
  const [globalSearch, setGlobalSearch] = useState("");
  const [dateFilter, setDateFilter] = useState("All");
  const [paymentFilter, setPaymentFilter] = useState("All");
  const [typeFilter, setTypeFilter] = useState("All Events");
  const [currentPage, setCurrentPage] = useState(1);

  const filteredBookings = useMemo(() => {
    return BOOKINGS_DATA.filter((booking) => {
      // 1. Status / Tab Match
      const statusMatch =
        activeTab === "All Bookings"
          ? true
          : activeTab === "Pending (42)"
            ? booking.status === "Pending"
            : booking.status === activeTab;

      const search = searchTerm.trim().toLowerCase();
      const global = globalSearch.trim().toLowerCase();

      const searchableText = [
        booking.id,
        booking.reference,
        booking.event,
        booking.client,
        booking.hosteAssigned,
        booking.location,
        booking.customerEmail,
      ];

      const searchMatch =
        !search ||
        searchableText.some((value) => value?.toLowerCase().includes(search));

      const globalMatch =
        !global ||
        searchableText.some((value) => value?.toLowerCase().includes(global));

      // 2. Payment Match (Flexible case-insensitive check)
      const paymentMatch =
        paymentFilter === "All" ||
        booking.payment?.toLowerCase() === paymentFilter.toLowerCase();

      // 3. Type Match (Flexible check against type property or event name)
      const typeMatch =
        typeFilter === "All Events" ||
        booking.type?.toLowerCase() === typeFilter.toLowerCase() ||
        booking.event.toLowerCase().includes(typeFilter.toLowerCase());

      // 4. Date Match (Supports "August 2026", "2026-08", "Aug", etc.)
      let dateMatch = true;
      if (dateFilter !== "All") {
        const target = dateFilter.toLowerCase();
        const bookingDate = booking.date.toLowerCase();
        if (target === "august 2026") {
          dateMatch =
            bookingDate.includes("2026-08") ||
            bookingDate.includes("aug") ||
            bookingDate.includes("august");
        } else {
          dateMatch = bookingDate.includes(target);
        }
      }

      return (
        statusMatch &&
        searchMatch &&
        globalMatch &&
        paymentMatch &&
        typeMatch &&
        dateMatch
      );
    });
  }, [
    activeTab,
    searchTerm,
    globalSearch,
    dateFilter,
    paymentFilter,
    typeFilter,
  ]);

  const clearFilters = () => {
    setActiveTab("All Bookings");
    setSearchTerm("");
    setGlobalSearch("");
    setDateFilter("All");
    setPaymentFilter("All");
    setTypeFilter("All Events");
    setCurrentPage(1);
  };

  const exportBookings = () => {
    const headers = [
      "Booking ID",
      "Event",
      "Client",
      "Hosté Assigned",
      "Date",
      "Amount",
      "Payment",
      "Status",
    ];

    const rows = filteredBookings.map((booking) => [
      booking.id,
      booking.event,
      booking.client,
      booking.hosteAssigned,
      booking.date,
      booking.amount,
      booking.payment,
      booking.status,
    ]);

    const csv = [headers, ...rows]
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob(["\uFEFF" + csv], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = "hoste-bookings.csv";
    link.click();

    URL.revokeObjectURL(url);
  };

  const renderStatusBadge = (status: BookingRow["status"]) => {
    const styles: Record<BookingRow["status"], string> = {
      Confirmed: "bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]",
      Pending: "bg-[#FFFBEB] text-[#B77900] border-[#FDE68A]",
      Completed: "bg-[#ECFDF3] text-[#15803D] border-[#BBF7D0]",
      Ongoing: "bg-[#EFF6FF] text-[#2563EB] border-[#BFDBFE]",
      Cancelled: "bg-[#FEF2F2] text-[#DC2626] border-[#FECACA]",
    };

    return (
      <span
        className={`inline-flex items-center justify-center whitespace-nowrap border px-[7px] py-[3px] text-[10px] font-semibold leading-[12px] ${styles[status]}`}
      >
        {status}
      </span>
    );
  };

  return (
    <div className="min-h-screen w-full bg-[#FAFAFA] font-sans text-[#172033]">
      {/* Header */}
      <header className="flex h-[49px] items-center justify-between border-b border-[#E5E7EB] bg-white px-[22px]">
        <div>
          <h1 className="text-[16px] font-bold leading-[19px] tracking-[-0.3px] text-[#252525]">
            Bookings
          </h1>
          <p className="mt-[1px] text-[10px] leading-[13px] text-[#999999]">
            All bookings across platform
          </p>
        </div>

        <div className="flex items-center gap-[17px]">
          <div className="relative hidden w-[158px] sm:block">
            <Search className="absolute left-[9px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#777777]" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search anything..."
              aria-label="Search anything"
              className="h-[25px] w-full rounded-[6px] bg-[#F3F4F6] pl-[25px] pr-[8px] text-[10px] text-[#374151] outline-none placeholder:text-[#888888]"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-7 w-6 items-center justify-center text-[#777777]"
          >
            <Bell className="h-[16px] w-[16px]" />
            <span className="absolute right-[-1px] top-[-1px] flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-[#E85D24] px-[2px] text-[8px] font-bold leading-none text-white">
              12
            </span>
          </button>

          <div className="flex items-center gap-[6px]">
            <Image
              src="/Image/name.png"
              alt="John Admin"
              width={25}
              height={25}
              className="h-[24px] w-[24px] rounded-full border border-[#E5E7EB] object-cover"
            />
            <div className="leading-[13px]">
              <p className="whitespace-nowrap text-[10px] font-bold text-[#292929]">
                John Admin
              </p>
              <p className="whitespace-nowrap text-[9px] text-[#888888]">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] px-[20px] pb-[35px] pt-[8px]">
        {/* Filter and Export */}
        <div className="mb-[11px] flex h-[27px] items-center justify-end gap-[8px]">
          <button
            type="button"
            onClick={clearFilters}
            className="flex h-[27px] items-center justify-center border border-[#D9DDE3] bg-white px-[16px] text-[11px] font-medium text-[#626B7A] hover:bg-gray-50"
          >
            Filter
          </button>

          <button
            type="button"
            onClick={exportBookings}
            className="flex h-[27px] items-center justify-center border border-[#D9DDE3] bg-white px-[16px] text-[11px] font-medium text-[#626B7A] hover:bg-gray-50"
          >
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <section className="mb-[25px] grid grid-cols-2 gap-[10px] lg:grid-cols-4">
          <div className="flex h-[67px] flex-col justify-between border border-[#E5E7EB] bg-white px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-[#777F8E]">
              Total Bookings
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-[#172033]">
                1,284
              </span>
              <div className="pb-[1px] text-right leading-[11px]">
                <p className="text-[10px] font-bold text-[#10B981]">+12%</p>
                <p className="text-[9px] text-[#9299A6]">vs last mo</p>
              </div>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-[#E5E7EB] bg-white px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-[#777F8E]">
              Pending Action
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-[#D97706]">
                42
              </span>
              <p className="w-[55px] pb-[1px] text-[9px] leading-[11px] text-[#9299A6]">
                Requires
                <br />
                attention
              </p>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-[#E5E7EB] bg-white px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-[#777F8E]">
              Confirmed
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-[#15803D]">
                186
              </span>
              <p className="w-[55px] pb-[1px] text-[9px] leading-[11px] text-[#9299A6]">
                Upcoming
                <br />
                events
              </p>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-[#E5E7EB] bg-white px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-[#777F8E]">
              Completed
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-[#172033]">
                1,012
              </span>
              <div className="pb-[1px] text-right leading-[11px]">
                <p className="text-[10px] font-bold text-[#10B981]">98.4%</p>
                <p className="text-[9px] text-[#9299A6]">fulfill rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Panel */}
        <section className="border border-[#E5E7EB] bg-white">
          {/* Tabs */}
          <div className="flex h-[36px] items-stretch gap-[22px] overflow-x-auto border-b border-[#EEF0F3] px-[16px]">
            {TABS.map((tab) => {
              const isActive = activeTab === tab;

              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => {
                    setActiveTab(tab);
                    setCurrentPage(1);
                  }}
                  className={`relative flex shrink-0 items-center whitespace-nowrap text-[11px] ${
                    isActive
                      ? "font-bold text-[#172033]"
                      : "font-normal text-[#737C8C] hover:text-[#172033]"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-[#EF5A24]" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-[9px] px-[16px] pb-[12px] pt-[12px] xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-[303px]">
              <Search className="absolute left-[8px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-[#9CA3AF]" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by booking ID, client, event or Hosté..."
                aria-label="Search bookings"
                className="h-[28px] w-full border border-[#D9DDE5] bg-white pl-[25px] pr-[8px] text-[11px] text-[#374151] outline-none placeholder:text-[#9AA3B2] focus:border-[#AAB1BD]"
              />
            </div>

            <div className="flex flex-wrap items-center gap-[7px]">
              <div className="relative">
                <select
                  aria-label="Filter by date"
                  value={dateFilter}
                  onChange={(e) => {
                    setDateFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[28px] min-w-[93px] appearance-none border border-[#D9DDE5] bg-white pl-[9px] pr-[23px] text-[10px] text-[#475164] outline-none"
                >
                  <option value="All">Date: All</option>
                  <option value="August 2026">Date: August 2026</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-[#6B7280]" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by payment"
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[28px] min-w-[100px] appearance-none border border-[#D9DDE5] bg-white pl-[9px] pr-[23px] text-[10px] text-[#475164] outline-none"
                >
                  <option value="All">Payment: All</option>
                  <option value="Paid">Payment: Paid</option>
                  <option value="Unpaid">Payment: Unpaid</option>
                  <option value="Pending">Payment: Pending</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-[#6B7280]" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by event type"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[28px] min-w-[113px] appearance-none border border-[#D9DDE5] bg-white pl-[9px] pr-[23px] text-[10px] text-[#475164] outline-none"
                >
                  <option value="All Events">Type: All Events</option>
                  <option value="Corporate">Type: Corporate</option>
                  <option value="Wedding">Type: Wedding</option>
                  <option value="Private">Type: Private</option>
                  <option value="Entertainment">Type: Entertainment</option>
                  <option value="Charity">Type: Charity</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-[#6B7280]" />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="whitespace-nowrap px-[4px] text-[10px] font-semibold text-[#626B7A] hover:text-[#EF5A24]"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto border-collapse text-left">
              <thead>
                <tr className="h-[29px] border-y border-[#EEF0F3] bg-[#F9FAFB] text-[10px] font-semibold text-[#697386]">
                  <th className="whitespace-nowrap px-[16px] font-semibold">
                    Booking ID
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Event
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Client
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Hosté Assigned
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Date
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Amount
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Payment
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Status
                  </th>
                  <th className="whitespace-nowrap px-[8px] font-semibold">
                    Actions
                  </th>
                  <th className="w-[24px] px-[7px]" />
                </tr>
              </thead>

              <tbody className="divide-y divide-[#F0F1F3]">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const rawId = booking.id.replace("#", "");

                    return (
                      <tr
                        key={booking.id}
                        className="h-[40px] text-[11px] text-[#414B5D] hover:bg-[#FAFBFC]"
                      >
                        <td className="whitespace-nowrap px-[16px] font-bold text-[#172033]">
                          {booking.id}
                        </td>
                        <td className="whitespace-nowrap px-[8px] font-bold text-[#172033]">
                          {booking.event}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          {booking.client}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          {booking.hosteAssigned}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          {booking.date}
                        </td>
                        <td className="whitespace-nowrap px-[8px] font-bold text-[#172033]">
                          {booking.amount}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          <span
                            className={`inline-flex items-center justify-center px-[7px] py-[3px] text-[9px] font-semibold leading-[11px] ${
                              booking.payment === "Paid"
                                ? "bg-[#ECFDF3] text-[#15803D]"
                                : "bg-[#FFFBEB] text-[#B77900]"
                            }`}
                          >
                            {booking.payment}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          {renderStatusBadge(booking.status)}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          <Link
                            href={`/bookings/${rawId}`}
                            className="text-[11px] font-bold text-[#F04419] hover:underline"
                          >
                            View Booking
                          </Link>
                        </td>
                        <td className="px-[7px] text-right">
                          <MoreVertical className="inline-block h-[14px] w-[14px] text-[#888888]" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="h-[100px] px-4 text-center text-[12px] text-[#9299A6]"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-[12px] border-t border-[#EEF0F3] px-[16px] py-[9px]">
            <p className="text-[10px] text-[#7C8493]">
              Showing{" "}
              <span className="font-bold text-[#172033]">
                {filteredBookings.length > 0 ? "1–10" : "0"}
              </span>{" "}
              of{" "}
              <span className="font-bold text-[#172033]">
                {filteredBookings.length === BOOKINGS_DATA.length
                  ? "1,284"
                  : filteredBookings.length}
              </span>{" "}
              bookings
            </p>

            <div className="flex items-center gap-[4px] text-[10px]">
              <button
                type="button"
                onClick={() => setCurrentPage((page) => Math.max(1, page - 1))}
                disabled={currentPage === 1}
                className="h-[23px] border border-[#E1E5EB] px-[12px] text-[#626B7A] hover:bg-[#F9FAFB] disabled:opacity-60"
              >
                Previous
              </button>

              {[1, 2, 3].map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => setCurrentPage(page)}
                  className={`flex h-[23px] min-w-[21px] items-center justify-center border ${
                    currentPage === page
                      ? "border-[#E85D24] bg-[#E85D24] font-bold text-white"
                      : "border-[#E1E5EB] text-[#626B7A] hover:bg-[#F9FAFB]"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-[3px] text-[#7C8493]">...</span>

              <button
                type="button"
                onClick={() => setCurrentPage(129)}
                className="flex h-[23px] min-w-[29px] items-center justify-center border border-[#E1E5EB] text-[#626B7A] hover:bg-[#F9FAFB]"
              >
                129
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(129, page + 1))
                }
                disabled={currentPage === 129}
                className="h-[23px] border border-[#E1E5EB] px-[12px] text-[#626B7A] hover:bg-[#F9FAFB] disabled:opacity-60"
              >
                Next
              </button>
            </div>
          </div>
        </section>
      </main>
    </div>
  );
}
