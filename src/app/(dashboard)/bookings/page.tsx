"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Search,
  Bell,
  ChevronDown,
  MoreVertical,
  SlidersHorizontal,
  Download,
} from "lucide-react";

interface BookingRow {
  id: string;
  event: string;
  client: string;
  hosteAssigned: string;
  date: string;
  amount: string;
  payment: "Paid" | "Unpaid" | "Pending";
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled";
}

const BOOKINGS_DATA: BookingRow[] = [
  {
    id: "#BK-10482",
    event: "Luxury Corporate Dinner",
    client: "ABC Events Ltd",
    hosteAssigned: "Amaka Okafor + 7",
    date: "Aug 28, 2026",
    amount: "₦250,000",
    payment: "Paid",
    status: "Confirmed",
  },
  {
    id: "#BK-10481",
    event: "Wedding Reception",
    client: "Sarah Events",
    hosteAssigned: "Blessing Eze + 5",
    date: "Aug 27, 2026",
    amount: "₦180,000",
    payment: "Paid",
    status: "Pending",
  },
  {
    id: "#BK-10480",
    event: "Product Launch",
    client: "XYZ Brand",
    hosteAssigned: "Chiamaka Obi + 3",
    date: "Aug 25, 2026",
    amount: "₦120,000",
    payment: "Paid",
    status: "Completed",
  },
  {
    id: "#BK-10479",
    event: "Private Gala Night",
    client: "Vanguard Group",
    hosteAssigned: "Amaka Okafor + 11",
    date: "Aug 24, 2026",
    amount: "₦450,000",
    payment: "Paid",
    status: "Confirmed",
  },
  {
    id: "#BK-10478",
    event: "Annual Tech Summit",
    client: "Qodebyte Labs",
    hosteAssigned: "Grace Utomi + 4",
    date: "Aug 22, 2026",
    amount: "₦210,000",
    payment: "Paid",
    status: "Completed",
  },
  {
    id: "#BK-10477",
    event: "Fashion Week Afterparty",
    client: "Style House",
    hosteAssigned: "Blessing Eze + 8",
    date: "Aug 20, 2026",
    amount: "₦320,000",
    payment: "Paid",
    status: "Pending",
  },
  {
    id: "#BK-10476",
    event: "VIP Charity Luncheon",
    client: "Grace Foundation",
    hosteAssigned: "Amaka Okafor + 2",
    date: "Aug 18, 2026",
    amount: "₦95,000",
    payment: "Paid",
    status: "Completed",
  },
];

export default function BookingsPage() {
  const [activeTab, setActiveTab] = useState("All Bookings");
  const [searchTerm, setSearchTerm] = useState("");

  const renderStatusBadge = (status: BookingRow["status"]) => {
    switch (status) {
      case "Confirmed":
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#E8F8EE] text-[#2BB168] border border-[#C6F0D6]">
            Confirmed
          </span>
        );
      case "Pending":
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FFF8E6] text-[#D99000] border border-[#FFE7B3]">
            Pending
          </span>
        );
      case "Completed":
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#E8F8EE] text-[#2BB168] border border-[#C6F0D6]">
            Completed
          </span>
        );
      case "Cancelled":
        return (
          <span className="px-2.5 py-0.5 rounded text-[11px] font-semibold bg-[#FDE8E8] text-[#E02424] border border-[#FBD5D5]">
            Cancelled
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-[#F9FAFB] min-h-screen text-slate-700 text-xs font-sans">
      <header className="bg-white border-b border-gray-200 px-8 py-3.5 flex items-center justify-between">
        <div>
          <h1 className="text-xl font-extrabold text-slate-900 tracking-tight">
            Bookings
          </h1>
          <p className="text-[11px] text-gray-400 font-normal">
            All bookings across platform
          </p>
        </div>

        <div className="flex items-center space-x-5">
          <div className="relative w-80">
            <Search className="w-4 h-4 absolute left-3 top-2 text-gray-400" />
            <input
              type="text"
              placeholder="Search anything..."
              className="w-full pl-9 pr-4 py-1.5 bg-[#F3F4F6] text-xs rounded-md focus:outline-none placeholder-gray-400 text-slate-800"
            />
          </div>

          <div className="relative cursor-pointer">
            <Bell className="w-5 h-5 text-gray-500" />
            <span className="absolute -top-1.5 -right-1.5 bg-[#E0533C] text-white text-[9px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
              12
            </span>
          </div>

          <div className="flex items-center space-x-2.5 pl-3 border-l border-gray-200">
            <Image
              src="/Image/name.png"
              alt="John Admin Avatar"
              width={32}
              height={32}
              className="w-8 h-8 rounded-full object-cover"
            />
            <div className="leading-tight">
              <p className="text-xs font-bold text-slate-900">John Admin</p>
              <p className="text-[10px] text-gray-400 font-normal">
                Super Admin
              </p>
            </div>
          </div>
        </div>
      </header>

      <main className="p-8 space-y-6 max-w-[1400px] mx-auto">
        <div className="flex justify-end space-x-3">
          <button className="flex items-center space-x-1.5 border border-gray-300 bg-white px-4 py-1.5 rounded-md text-slate-700 font-medium hover:bg-gray-50">
            <SlidersHorizontal className="w-3.5 h-3.5 text-gray-500" />
            <span>Filter</span>
          </button>
          <button className="flex items-center space-x-1.5 border border-gray-300 bg-white px-4 py-1.5 rounded-md text-slate-700 font-medium hover:bg-gray-50">
            <Download className="w-3.5 h-3.5 text-gray-500" />
            <span>Export</span>
          </button>
        </div>
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between h-28 relative">
            <span className="text-xs text-gray-400 font-normal">
              Total Bookings
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">1,284</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#10B981]">+12%</span>
                <p className="text-[10px] text-gray-400 leading-none">
                  vs last mo
                </p>
              </div>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between h-28">
            <span className="text-xs text-gray-400 font-normal">
              Pending Action
            </span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#D97706]">42</span>
              <span className="text-[10px] text-gray-400 leading-tight text-right w-16">
                Requires attention
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between h-28">
            <span className="text-xs text-gray-400 font-normal">Confirmed</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-[#059669]">186</span>
              <span className="text-[10px] text-gray-400 leading-tight text-right w-16">
                Upcoming events
              </span>
            </div>
          </div>

          <div className="bg-white border border-gray-200 rounded-lg p-5 flex flex-col justify-between h-28">
            <span className="text-xs text-gray-400 font-normal">Completed</span>
            <div className="flex items-baseline justify-between mt-1">
              <span className="text-2xl font-black text-slate-900">1,012</span>
              <div className="text-right">
                <span className="text-xs font-bold text-[#10B981]">98.4%</span>
                <p className="text-[10px] text-gray-400 leading-none">
                  fulfill rate
                </p>
              </div>
            </div>
          </div>
        </div>
        <div className="bg-white border border-gray-200 rounded-lg p-6 space-y-5">
          <div className="flex space-x-7 border-b border-gray-100 pb-3 text-xs font-semibold">
            {[
              "All Bookings",
              "Pending (42)",
              "Confirmed",
              "Ongoing",
              "Completed",
              "Cancelled",
            ].map((tab) => {
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`relative pb-3 -mb-3 transition-colors ${
                    isActive
                      ? "text-slate-900 font-bold"
                      : "text-gray-400 hover:text-gray-600"
                  }`}
                >
                  {tab}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-[2.5px] bg-[#EE6038] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>
          <div className="flex items-center justify-between space-x-3 pt-1">
            <div className="relative flex-1">
              <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search by booking ID, client, event or Hosté..."
                className="w-full pl-9 pr-3 py-1.5 border border-gray-200 rounded-md text-xs placeholder-gray-400 focus:outline-none focus:border-gray-400 text-slate-700"
              />
            </div>

            <div className="flex items-center space-x-2 text-xs">
              <div className="flex items-center space-x-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-slate-600 bg-white">
                <span className="text-gray-700 font-medium">Date: All</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
              </div>

              <div className="flex items-center space-x-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-slate-600 bg-white">
                <span className="text-gray-700 font-medium">Payment: Paid</span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
              </div>

              <div className="flex items-center space-x-1.5 border border-gray-200 rounded-md px-3 py-1.5 text-slate-600 bg-white">
                <span className="text-gray-700 font-medium">
                  Type: All Events
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 ml-1" />
              </div>

              <button className="text-slate-600 font-bold px-2 hover:text-slate-900">
                Clear Filters
              </button>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-gray-100 text-[11px] font-bold text-gray-500 uppercase tracking-wide">
                  <th className="py-3 px-2">Booking ID</th>
                  <th className="py-3 px-2">Event</th>
                  <th className="py-3 px-2">Client</th>
                  <th className="py-3 px-2">Hosté Assigned</th>
                  <th className="py-3 px-2">Date</th>
                  <th className="py-3 px-2">Amount</th>
                  <th className="py-3 px-2">Payment</th>
                  <th className="py-3 px-2">Status</th>
                  <th className="py-3 px-2">Actions</th>
                  <th className="py-3 px-1"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100 text-xs text-slate-700">
                {BOOKINGS_DATA.map((row) => {
                  const rawId = row.id.replace("#", "");
                  return (
                    <tr
                      key={row.id}
                      className="hover:bg-slate-50/60 transition-colors"
                    >
                      <td className="py-3.5 px-2 font-bold text-slate-900">
                        {row.id}
                      </td>
                      <td className="py-3.5 px-2 font-extrabold text-slate-900">
                        {row.event}
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {row.client}
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">
                        {row.hosteAssigned}
                      </td>
                      <td className="py-3.5 px-2 text-slate-500">{row.date}</td>
                      <td className="py-3.5 px-2 font-black text-slate-900">
                        {row.amount}
                      </td>
                      <td className="py-3.5 px-2">
                        <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-[#ECFDF5] text-[#10B981]">
                          {row.payment}
                        </span>
                      </td>
                      <td className="py-3.5 px-2">
                        {renderStatusBadge(row.status)}
                      </td>
                      <td className="py-3.5 px-2">
                        <Link
                          href={`/bookings/${rawId}`}
                          className="text-[#EF5A36] font-bold hover:underline"
                        >
                          View Booking
                        </Link>
                      </td>
                      <td className="py-3.5 px-1 text-right">
                        <button className="p-1 text-gray-400 hover:text-gray-600">
                          <MoreVertical className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="pt-3 flex items-center justify-between text-xs text-gray-400 border-t border-gray-100">
            <div>
              Showing <span className="font-bold text-slate-800">1–10</span> of{" "}
              <span className="font-bold text-slate-800">1,284</span> bookings
            </div>
            <div className="flex items-center space-x-1.5 text-xs">
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">
                Previous
              </button>
              <button className="w-6 h-6 rounded bg-[#EE6038] text-white font-bold flex items-center justify-center text-xs">
                1
              </button>
              <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center text-xs">
                2
              </button>
              <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center text-xs">
                3
              </button>
              <span className="px-1 text-gray-400">...</span>
              <button className="w-6 h-6 rounded hover:bg-gray-100 text-gray-600 font-medium flex items-center justify-center text-xs">
                129
              </button>
              <button className="px-3 py-1 border border-gray-200 rounded text-gray-500 hover:bg-gray-50">
                Next
              </button>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
