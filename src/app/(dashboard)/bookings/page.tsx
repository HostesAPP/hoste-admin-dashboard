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

      const paymentMatch =
        paymentFilter === "All" ||
        booking.payment?.toLowerCase() === paymentFilter.toLowerCase();

      const typeMatch =
        typeFilter === "All Events" ||
        booking.type?.toLowerCase() === typeFilter.toLowerCase() ||
        booking.event.toLowerCase().includes(typeFilter.toLowerCase());

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
      Confirmed: "bg-success/10 text-success border-success/20",
      Pending: "bg-warning-surface text-warning border-warning-border",
      Completed: "bg-success/10 text-success border-success/20",
      Ongoing: "bg-primary/10 text-primary border-primary/20",
      Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
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
    <div className="min-h-screen w-full bg-background font-sans text-foreground">
      {/* Header */}
      <header className="flex h-[49px] items-center justify-between border-b border-border bg-card px-[22px]">
        <div>
          <h1 className="text-[16px] font-bold leading-[19px] tracking-[-0.3px] text-foreground">
            Bookings
          </h1>
          <p className="mt-[1px] text-[10px] leading-[13px] text-muted-foreground">
            All bookings across platform
          </p>
        </div>

        <div className="flex items-center gap-[17px]">
          <div className="relative hidden w-[158px] sm:block">
            <Search className="absolute left-[9px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-muted-foreground" />
            <input
              type="text"
              value={globalSearch}
              onChange={(e) => {
                setGlobalSearch(e.target.value);
                setCurrentPage(1);
              }}
              placeholder="Search anything..."
              aria-label="Search anything"
              className="h-[25px] w-full rounded-[6px] bg-muted pl-[25px] pr-[8px] text-[10px] text-foreground outline-none placeholder:text-muted-foreground"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative flex h-7 w-6 items-center justify-center text-muted-foreground"
          >
            <Bell className="h-[16px] w-[16px]" />
            <span className="absolute right-[-1px] top-[-1px] flex h-[12px] min-w-[12px] items-center justify-center rounded-full bg-primary px-[2px] text-[8px] font-bold leading-none text-primary-foreground">
              12
            </span>
          </button>

          <div className="flex items-center gap-[6px]">
            <Image
              src="/Image/name.png"
              alt="John Admin"
              width={25}
              height={25}
              className="h-[24px] w-[24px] rounded-full border border-border object-cover"
            />
            <div className="leading-[13px]">
              <p className="whitespace-nowrap text-[10px] font-bold text-foreground">
                John Admin
              </p>
              <p className="whitespace-nowrap text-[9px] text-muted-foreground">
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
            className="flex h-[27px] items-center justify-center border border-border bg-card px-[16px] text-[11px] font-medium text-muted-foreground hover:bg-muted"
          >
            Filter
          </button>

          <button
            type="button"
            onClick={exportBookings}
            className="flex h-[27px] items-center justify-center border border-border bg-card px-[16px] text-[11px] font-medium text-muted-foreground hover:bg-muted"
          >
            Export
          </button>
        </div>

        {/* Summary Cards */}
        <section className="mb-[25px] grid grid-cols-2 gap-[10px] lg:grid-cols-4">
          <div className="flex h-[67px] flex-col justify-between border border-border bg-card px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-muted-foreground">
              Total Bookings
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-foreground">
                1,284
              </span>
              <div className="pb-[1px] text-right leading-[11px]">
                <p className="text-[10px] font-bold text-success">+12%</p>
                <p className="text-[9px] text-muted-foreground">vs last mo</p>
              </div>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-border bg-card px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-muted-foreground">
              Pending Action
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-warning">
                42
              </span>
              <p className="w-[55px] pb-[1px] text-[9px] leading-[11px] text-muted-foreground">
                Requires
                <br />
                attention
              </p>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-border bg-card px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-muted-foreground">
              Confirmed
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-success">
                186
              </span>
              <p className="w-[55px] pb-[1px] text-[9px] leading-[11px] text-muted-foreground">
                Upcoming
                <br />
                events
              </p>
            </div>
          </div>

          <div className="flex h-[67px] flex-col justify-between border border-border bg-card px-[13px] py-[11px]">
            <p className="text-[11px] leading-[13px] text-muted-foreground">
              Completed
            </p>
            <div className="flex items-end justify-between">
              <span className="text-[20px] font-bold leading-[22px] tracking-[-0.4px] text-foreground">
                1,012
              </span>
              <div className="pb-[1px] text-right leading-[11px]">
                <p className="text-[10px] font-bold text-success">98.4%</p>
                <p className="text-[9px] text-muted-foreground">fulfill rate</p>
              </div>
            </div>
          </div>
        </section>

        {/* Bookings Panel */}
        <section className="border border-border bg-card">
          {/* Tabs */}
          <div className="flex h-[36px] items-stretch gap-[22px] overflow-x-auto border-b border-border px-[16px]">
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
                      ? "font-bold text-foreground"
                      : "font-normal text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-[-1px] left-0 right-0 h-[2px] bg-primary" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col gap-[9px] px-[16px] pb-[12px] pt-[12px] xl:flex-row xl:items-center xl:justify-between">
            <div className="relative w-full xl:max-w-[303px]">
              <Search className="absolute left-[8px] top-1/2 h-[13px] w-[13px] -translate-y-1/2 text-muted-foreground" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search by booking ID, client, event or Hosté..."
                aria-label="Search bookings"
                className="h-[28px] w-full border border-input bg-card pl-[25px] pr-[8px] text-[11px] text-foreground outline-none placeholder:text-muted-foreground focus:border-ring"
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
                  className="h-[28px] min-w-[93px] appearance-none border border-input bg-card pl-[9px] pr-[23px] text-[10px] text-foreground outline-none"
                >
                  <option value="All">Date: All</option>
                  <option value="August 2026">Date: August 2026</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by payment"
                  value={paymentFilter}
                  onChange={(e) => {
                    setPaymentFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[28px] min-w-[100px] appearance-none border border-input bg-card pl-[9px] pr-[23px] text-[10px] text-foreground outline-none"
                >
                  <option value="All">Payment: All</option>
                  <option value="Paid">Payment: Paid</option>
                  <option value="Unpaid">Payment: Unpaid</option>
                  <option value="Pending">Payment: Pending</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-muted-foreground" />
              </div>

              <div className="relative">
                <select
                  aria-label="Filter by event type"
                  value={typeFilter}
                  onChange={(e) => {
                    setTypeFilter(e.target.value);
                    setCurrentPage(1);
                  }}
                  className="h-[28px] min-w-[113px] appearance-none border border-input bg-card pl-[9px] pr-[23px] text-[10px] text-foreground outline-none"
                >
                  <option value="All Events">Type: All Events</option>
                  <option value="Corporate">Type: Corporate</option>
                  <option value="Wedding">Type: Wedding</option>
                  <option value="Private">Type: Private</option>
                  <option value="Entertainment">Type: Entertainment</option>
                  <option value="Charity">Type: Charity</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-[7px] top-1/2 h-[11px] w-[11px] -translate-y-1/2 text-muted-foreground" />
              </div>

              <button
                type="button"
                onClick={clearFilters}
                className="whitespace-nowrap px-[4px] text-[10px] font-semibold text-muted-foreground hover:text-primary"
              >
                Clear Filters
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="overflow-x-auto">
            <table className="w-full min-w-[800px] table-auto border-collapse text-left">
              <thead>
                <tr className="h-[29px] border-y border-border bg-muted text-[10px] font-semibold text-muted-foreground">
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

              <tbody className="divide-y divide-border">
                {filteredBookings.length > 0 ? (
                  filteredBookings.map((booking) => {
                    const rawId = booking.id.replace("#", "");

                    return (
                      <tr
                        key={booking.id}
                        className="h-[40px] text-[11px] text-muted-foreground hover:bg-muted/50"
                      >
                        <td className="whitespace-nowrap px-[16px] font-bold text-foreground">
                          {booking.id}
                        </td>
                        <td className="whitespace-nowrap px-[8px] font-bold text-foreground">
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
                        <td className="whitespace-nowrap px-[8px] font-bold text-foreground">
                          {booking.amount}
                        </td>
                        <td className="whitespace-nowrap px-[8px]">
                          <span
                            className={`inline-flex items-center justify-center px-[7px] py-[3px] text-[9px] font-semibold leading-[11px] ${
                              booking.payment === "Paid"
                                ? "bg-success/10 text-success"
                                : "bg-warning-surface text-warning"
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
                            className="text-[11px] font-bold text-primary hover:underline"
                          >
                            View Booking
                          </Link>
                        </td>
                        <td className="px-[7px] text-right">
                          <MoreVertical className="inline-block h-[14px] w-[14px] text-muted-foreground" />
                        </td>
                      </tr>
                    );
                  })
                ) : (
                  <tr>
                    <td
                      colSpan={10}
                      className="h-[100px] px-4 text-center text-[12px] text-muted-foreground"
                    >
                      No bookings found.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="flex min-h-[47px] flex-wrap items-center justify-between gap-[12px] border-t border-border px-[16px] py-[9px]">
            <p className="text-[10px] text-muted-foreground">
              Showing{" "}
              <span className="font-bold text-foreground">
                {filteredBookings.length > 0 ? "1–10" : "0"}
              </span>{" "}
              of{" "}
              <span className="font-bold text-foreground">
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
                className="h-[23px] border border-border px-[12px] text-muted-foreground hover:bg-muted disabled:opacity-60"
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
                      ? "border-primary bg-primary font-bold text-primary-foreground"
                      : "border-border text-muted-foreground hover:bg-muted"
                  }`}
                >
                  {page}
                </button>
              ))}

              <span className="px-[3px] text-muted-foreground">...</span>

              <button
                type="button"
                onClick={() => setCurrentPage(129)}
                className="flex h-[23px] min-w-[29px] items-center justify-center border border-border text-muted-foreground hover:bg-muted"
              >
                129
              </button>

              <button
                type="button"
                onClick={() =>
                  setCurrentPage((page) => Math.min(129, page + 1))
                }
                disabled={currentPage === 129}
                className="h-[23px] border border-border px-[12px] text-muted-foreground hover:bg-muted disabled:opacity-60"
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
