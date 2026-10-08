"use client";

import React, { useState } from "react";
import Image from "next/image";
import {
  SlidersHorizontal,
  Search,
  Bell,
  Check,
  Plus,
  User,
  Lock,
  ChevronDown,
} from "lucide-react";

export default function BookingActivityPage() {
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
    <div className="min-h-screen bg-[#F9FAFB] text-[#333333] font-sans text-xs">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-8 py-4">
        <div>
          <h1 className="text-xl font-bold tracking-tight text-slate-900">
            Booking Activity
          </h1>
          <p className="mt-0.5 text-[11px] text-gray-500">
            Complete history of everything that has happened to this booking.
          </p>
        </div>

        <div className="flex items-center space-x-4">
          <button className="flex items-center space-x-2 rounded-full border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-medium text-slate-600 hover:bg-gray-50">
            <SlidersHorizontal className="h-3.5 w-3.5 text-gray-500" />
            <span>Filter</span>
          </button>

          <div className="relative w-64">
            <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full rounded-lg bg-[#F3F4F6] py-1.5 pl-9 pr-4 text-xs text-slate-800 placeholder-gray-400 focus:outline-none"
            />
          </div>

          <div className="relative cursor-pointer p-1">
            <Bell className="h-5 w-5 text-gray-600" />
            <span className="absolute right-0 top-0 flex h-4 w-4 items-center justify-center rounded-full bg-[#EF5A22] text-[9px] font-bold text-white">
              12
            </span>
          </div>

          <div className="flex items-center space-x-2.5 pl-3">
            <Image
              src="/Image/name.png"
              alt="John Admin Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />

            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900">John Admin</p>
              <p className="text-[10px] text-gray-400">Super Admin</p>
            </div>
          </div>
        </div>
      </header>

      <main className="mx-auto max-w-[1400px] space-y-6 p-8">
        <div className="grid grid-cols-6 divide-x divide-gray-100 border border-gray-200 bg-white p-5 shadow-sm">
          <div className="px-2">
            <p className="text-[10px] font-medium text-gray-400">Booking</p>
            <p className="mt-1 text-sm font-bold text-slate-900">#BK-10482</p>
          </div>

          <div className="px-4">
            <p className="text-[10px] font-medium text-gray-400">Event</p>
            <p className="mt-1 text-xs font-bold text-slate-900">
              Luxury Corporate Dinner
            </p>
          </div>

          <div className="px-4">
            <p className="text-[10px] font-medium text-gray-400">Client</p>
            <p className="mt-1 text-xs font-bold text-slate-900">
              ABC Events Limited
            </p>
          </div>

          <div className="px-4">
            <p className="text-[10px] font-medium text-gray-400">Event Date</p>
            <p className="mt-1 text-xs font-bold text-slate-900">28 Aug 2026</p>
          </div>

          <div className="px-4">
            <p className="text-[10px] font-medium text-gray-400">
              Current Status
            </p>
            <div className="mt-1">
              <span className="inline-block bg-[#E6F4EA] px-3 py-1 text-[11px] font-semibold text-[#006837]">
                Confirmed
              </span>
            </div>
          </div>

          <div className="px-4">
            <p className="text-[10px] font-medium text-gray-400">Payment</p>
            <div className="mt-1">
              <span className="inline-block bg-[#E6F4EA] px-3 py-1 text-[11px] font-semibold text-[#006837]">
                Paid
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="relative w-48">
            <select
              aria-label="Filter activity type"
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="w-full appearance-none border border-gray-200 bg-white px-3 py-2 pr-8 text-xs text-slate-800 shadow-sm focus:outline-none"
            >
              {activityTypeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative w-48">
            <select
              aria-label="Filter activity date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              className="w-full appearance-none border border-gray-200 bg-white px-3 py-2 pr-8 text-xs text-slate-800 shadow-sm focus:outline-none"
            >
              {dateOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
            <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-gray-400" />
          </div>

          <div className="relative max-w-lg flex-1">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search activity history..."
              className="w-full rounded-md border border-gray-200 bg-white py-2 pl-9 pr-4 text-xs text-slate-800 placeholder-gray-400 shadow-sm focus:outline-none"
            />
          </div>
        </div>

        <div className="min-h-[500px] border border-gray-200 bg-white p-8 shadow-sm">
          <div className="relative space-y-9 pl-24">
            <div className="absolute bottom-3 left-[88px] top-3 w-[1.5px] bg-gray-200" />
            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-gray-400">
                9:00 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-white p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#006837] bg-white">
                  <Check className="h-3.5 w-3.5 stroke-[3] text-[#006837]" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-slate-900">
                  BOOKING COMPLETED
                </h3>

                <p className="text-xs text-slate-600">
                  “The event was successfully completed.”
                </p>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-gray-400">
                    August 28, 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-gray-400">
                2:15 PM
              </span>

              <div className="absolute -left-[18px] top-0 bg-white p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border-2 border-[#EF5A22] bg-white">
                  <Plus className="h-3.5 w-3.5 stroke-[3] text-[#EF5A22]" />
                </div>
              </div>

              <div className="w-full max-w-3xl space-y-2 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-slate-900">
                  BOOKING DETAILS UPDATED
                </h3>

                <p className="text-xs text-slate-600">
                  “Event location was changed from Victoria Island to Eko Hotel
                  & Suites.“
                </p>

                <div className="flex items-center space-x-3">
                  <span className="bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    James Odigie - Admin
                  </span>

                  <span className="text-[11px] text-gray-400">
                    August 22, 2026
                  </span>
                </div>

                <div className="mt-3 grid grid-cols-3 gap-4 border border-gray-200 bg-[#F9FAFB] p-3 text-xs">
                  <div>
                    <p className="text-[10px] font-medium text-gray-400">
                      Field Changed
                    </p>
                    <p className="mt-1 font-bold text-slate-900">Location</p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-gray-400">
                      Previous Value
                    </p>
                    <p className="mt-1 font-semibold text-[#EF5A22]">
                      Victoria Island
                    </p>
                  </div>

                  <div>
                    <p className="text-[10px] font-medium text-gray-400">
                      New Value
                    </p>
                    <p className="mt-1 font-bold text-[#006837]">
                      Eko Hotel & Suites
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-gray-400">
                11:12 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-white p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                  <Check className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-slate-900">
                  BOOKING CONFIRMED
                </h3>

                <p className="text-xs text-slate-600">
                  “The booking was confirmed and all assigned Hostés were
                  notified.”
                </p>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-gray-400">
                    August 21, 2026
                  </span>
                </div>
              </div>
            </div>

            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-gray-400">
                11:05 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-white p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                  <User className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-slate-900">
                  HOSTÉS ASSIGNED
                </h3>

                <p className="text-xs text-slate-600">
                  “8 Hostés were assigned to this booking.”
                </p>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    Operations Admin
                  </span>

                  <span className="text-[11px] text-gray-400">
                    August 21, 2026
                  </span>

                  <button className="border border-[#EF5A22] px-2.5 py-0.5 text-[10px] font-bold text-[#EF5A22] transition hover:bg-orange-50">
                    View Assigned Hostés
                  </button>
                </div>
              </div>
            </div>

            <div className="relative flex items-start">
              <span className="absolute -left-20 top-0.5 text-xs font-medium text-gray-400">
                10:25 AM
              </span>

              <div className="absolute -left-[18px] top-0 bg-white p-0.5">
                <div className="flex h-6 w-6 items-center justify-center rounded-full border border-gray-300 bg-white">
                  <Lock className="h-3.5 w-3.5 text-gray-500" />
                </div>
              </div>

              <div className="space-y-1 pl-6">
                <h3 className="text-xs font-bold tracking-wide text-slate-900">
                  PAYMENT MOVED TO ESCROW
                </h3>

                <p className="text-xs text-slate-600">
                  “₦200,000 was secured in escrow for the assigned Hostés.”
                </p>

                <div className="flex items-center space-x-3 pt-1">
                  <span className="bg-[#F3F4F6] px-2.5 py-0.5 text-[10px] font-medium text-slate-600">
                    System
                  </span>

                  <span className="text-[11px] text-gray-400">
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
