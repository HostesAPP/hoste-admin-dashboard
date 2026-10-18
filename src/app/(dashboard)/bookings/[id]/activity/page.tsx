"use client";

import React, { useState } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import {
  SlidersHorizontal,
  Search,
  Bell,
  Check,
  Plus,
  User,
  Lock,
  ChevronDown,
  ArrowLeft,
} from "lucide-react";

export default function BookingActivityPage() {
  const router = useRouter();

  const [selectedType, setSelectedType] = useState("All Activity");
  const [selectedDate, setSelectedDate] = useState("All Time");
  const [searchQuery, setSearchQuery] = useState("");

  const activityTypeOptions = [
    "All Activity",
    "Booking Created",
    "Booking Updated",
    "Booking Confirmed",
    "Hostés Assigned",
    "Payment",
  ];

  const dateOptions = [
    "All Time",
    "Today",
    "Last 7 Days",
    "Last 30 Days",
    "This Quarter",
  ];

  return (
    <div className="min-h-screen bg-background font-sans text-xs text-foreground">
      {/* HEADER */}
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-border bg-card px-8 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-card-foreground">
            Booking Activity
          </h1>

          <p className="mt-0.5 text-[11px] text-muted-foreground">
            Complete history of everything that has happened to this booking.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-4">
          <button
            type="button"
            className="flex items-center space-x-2 rounded-full border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-card-foreground transition hover:bg-accent"
          >
            <SlidersHorizontal className="h-3.5 w-3.5 text-muted-foreground" />
            <span>Filter</span>
          </button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-2 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              placeholder="Search anything..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full rounded-lg border border-transparent bg-muted py-1.5 pl-9 pr-4 text-xs text-foreground placeholder:text-muted-foreground focus:border-ring focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>

          <button
            type="button"
            aria-label="Notifications"
            className="relative p-1"
          >
            <Bell className="h-5 w-5 text-muted-foreground" />

            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-primary-orange text-[9px] font-bold text-white">
              12
            </span>
          </button>

          <div className="flex items-center space-x-2.5 pl-3">
            <Image
              src="/Image/name.png"
              alt="John Admin Avatar"
              width={32}
              height={32}
              className="h-8 w-8 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-xs font-bold text-card-foreground">
                John Admin
              </p>

              <p className="text-[10px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 p-8">
        {/* BACK TO BOOKING */}
        <div className="flex justify-end">
          <button
            type="button"
            onClick={() => router.back()}
            className="flex items-center space-x-2 rounded border border-border bg-card px-3.5 py-1.5 text-xs font-medium text-card-foreground shadow-sm transition hover:bg-accent"
          >
            <ArrowLeft className="h-3.5 w-3.5" />
            <span>Back to Booking</span>
          </button>
        </div>

        {/* BOOKING SUMMARY */}
        <div className="grid grid-cols-1 divide-y divide-border border border-border bg-card p-5 shadow-sm sm:grid-cols-2 sm:divide-y-0 sm:divide-x lg:grid-cols-6">
          <div className="px-2 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Booking
            </p>

            <p className="mt-1 text-sm font-bold text-card-foreground">
              #BK-10482
            </p>
          </div>

          <div className="px-4 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Event
            </p>

            <p className="mt-1 text-xs font-bold text-card-foreground">
              Luxury Corporate Dinner
            </p>
          </div>

          <div className="px-4 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Client
            </p>

            <p className="mt-1 text-xs font-bold text-card-foreground">
              ABC Events Limited
            </p>
          </div>

          <div className="px-4 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Event Date
            </p>

            <p className="mt-1 text-xs font-bold text-card-foreground">
              28 Aug 2026
            </p>
          </div>

          <div className="px-4 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Current Status
            </p>

            <div className="mt-1">
              <span className="inline-block border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
                Confirmed
              </span>
            </div>
          </div>

          <div className="px-4 py-3 sm:py-0">
            <p className="text-[10px] font-medium text-muted-foreground">
              Payment
            </p>

            <div className="mt-1">
              <span className="inline-block border border-success/20 bg-success/10 px-3 py-1 text-[11px] font-semibold text-success">
                Paid
              </span>
            </div>
          </div>
        </div>

        {/* ACTIVITY FILTERS */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="relative w-48">
            <select
              aria-label="Filter activity type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none border border-border bg-card px-3 py-2 pr-8 text-xs text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              {activityTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative w-48">
            <select
              aria-label="Filter activity date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none border border-border bg-card px-3 py-2 pr-8 text-xs text-card-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            >
              {dateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>

            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
          </div>

          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />

            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity history..."
              className="w-full rounded-md border border-border bg-card py-2 pl-9 pr-4 text-xs text-card-foreground placeholder:text-muted-foreground shadow-sm focus:outline-none focus:ring-2 focus:ring-ring/20"
            />
          </div>
        </div>

        {/* ACTIVITY TIMELINE */}
        <div className="min-h-[500px] border border-border bg-card p-8 shadow-sm">
          <div className="relative space-y-9 pl-24">
            <div className="absolute bottom-3 left-[88px] top-3 w-[1.5px] bg-border" />

            {/* BOOKING COMPLETED */}
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-muted-foreground">
                9:00 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-card p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-success bg-card">
                  <Check className="h-3.5 w-3.5 stroke-[3] text-success" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-card-foreground">
                  BOOKING COMPLETED
                </h3>

                <p className="text-xs text-muted-foreground">
                  “The event was successfully completed.”
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    August 28, 2026
                  </span>
                </div>
              </div>
            </div>

            {/* BOOKING DETAILS UPDATED */}
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-muted-foreground">
                2:15 PM
              </span>

              <div className="absolute -left-[18px] top-0 bg-card p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-primary-orange bg-card">
                  <Plus className="h-3.5 w-3.5 stroke-[3] text-primary-orange" />
                </div>
              </div>

              <div className="w-full max-w-3xl space-y-2 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-card-foreground">
                  BOOKING DETAILS UPDATED
                </h3>

                <p className="text-xs text-muted-foreground">
                  “Event location was changed from Victoria Island to Eko Hotel
                  &amp; Suites.”
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <span className="bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    James Odigie - Admin
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    August 22, 2026
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-4 border border-border bg-muted p-3 text-xs sm:grid-cols-3">
                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      Field Changed
                    </p>

                    <p className="mt-1 font-bold text-card-foreground">
                      Location
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      Previous Value
                    </p>

                    <p className="mt-1 font-semibold text-primary-orange">
                      Victoria Island
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-muted-foreground">
                      New Value
                    </p>

                    <p className="mt-1 font-bold text-success">
                      Eko Hotel &amp; Suites
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* BOOKING CONFIRMED */}
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-muted-foreground">
                11:12 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-card p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                  <Check className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-card-foreground">
                  BOOKING CONFIRMED
                </h3>

                <p className="text-xs text-muted-foreground">
                  “The booking was confirmed and all assigned Hostés were
                  notified.”
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    August 21, 2026
                  </span>
                </div>
              </div>
            </div>

            {/* HOSTÉS ASSIGNED */}
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-muted-foreground">
                11:05 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-card p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                  <User className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-card-foreground">
                  HOSTÉS ASSIGNED
                </h3>

                <p className="text-xs text-muted-foreground">
                  “8 Hostés were assigned to this booking.”
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    August 21, 2026
                  </span>

                  <button
                    type="button"
                    className="border border-primary-orange px-2.5 py-0.5 text-[10px] font-bold text-primary-orange transition hover:bg-primary-orange/10"
                  >
                    View Assigned Hostés
                  </button>
                </div>
              </div>
            </div>

            {/* PAYMENT MOVED TO ESCROW */}
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-muted-foreground">
                10:25 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-card p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card">
                  <Lock className="h-3.5 w-3.5 text-muted-foreground" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-card-foreground">
                  PAYMENT MOVED TO ESCROW
                </h3>

                <p className="text-xs text-muted-foreground">
                  “₦200,000 was secured in escrow for the assigned Hostés.”
                </p>

                <div className="flex flex-wrap items-center gap-3 pt-1">
                  <span className="bg-muted px-2.5 py-0.5 text-[10px] font-medium text-muted-foreground">
                    System
                  </span>

                  <span className="text-[11px] text-muted-foreground">
                    August 21, 2026
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
