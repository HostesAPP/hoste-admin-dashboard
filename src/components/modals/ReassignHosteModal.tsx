"use client";

import React, { useState } from "react";
import { ArrowLeftRight, X, Search, Star } from "lucide-react";

interface ReassignHosteModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  bookingId?: string;
  currentHoste?: {
    name: string;
    role: string;
    rating: number;
    initials: string;
  };
  onReassign?: (selectedHosteId: string) => void;
}

export default function ReassignHosteModal({
  isOpen = true,
  onClose,
  bookingId = "#BK-10482",
  currentHoste = {
    name: "Amaka Okafor",
    role: "Event Host",
    rating: 4.8,
    initials: "AO",
  },
  onReassign,
}: ReassignHosteModalProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedHosteId, setSelectedHosteId] = useState("blessing-eze");

  const replacementHostes = [
    {
      id: "blessing-eze",
      name: "Blessing Eze",
      role: "Event Host",
      location: "Lagos Island (2.5 km)",
      rating: 4.9,
      status: "Available",
      initials: "BE",
      bgColor: "bg-[#FBE8D3]",
      textColor: "text-[#D97706]",
    },
    {
      id: "chiamaka-obi",
      name: "Chiamaka Obi",
      role: "Usher",
      location: "Ikeja (5.1 km)",
      rating: 4.7,
      status: "Available",
      initials: "CO",
      bgColor: "bg-[#E0E7FF]",
      textColor: "text-[#4338CA]",
    },
    {
      id: "grace-utomi",
      name: "Grace Utomi",
      role: "VIP Hostess",
      location: "Victoria Island (1.2 km)",
      rating: 4.9,
      status: "Available",
      initials: "GU",
      bgColor: "bg-[#EAF8F0]",
      textColor: "text-[#1B5E20]",
    },
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
      <div className="relative w-full max-w-[480px] rounded-2xl bg-white p-6 shadow-xl">
        <button
          onClick={onClose}
          type="button"
          className="absolute right-5 top-5 rounded-full p-1 text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-[#F1F3F5]">
          <ArrowLeftRight className="h-4 w-4 text-slate-700" />
        </div>

        <h2 className="text-xl font-bold text-slate-900 tracking-tight">
          Reassign Hosté
        </h2>
        <p className="mt-1 text-xs text-gray-500">
          Select a new Hosté to assign to booking{" "}
          <strong className="text-slate-900 font-bold">{bookingId}</strong>.
        </p>

        <div className="mt-5">
          <label className="text-[11px] font-bold text-slate-800">
            Current Hosté
          </label>
          <div className="mt-2 flex items-center justify-between rounded-xl border border-gray-100 bg-[#F8F9FA] p-3.5">
            <div className="flex items-center space-x-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#E2E8F0] text-xs font-bold text-slate-600">
                {currentHoste.initials}
              </div>
              <div>
                <p className="text-xs font-bold text-slate-900">
                  {currentHoste.name}
                </p>
                <p className="text-[11px] text-gray-400">{currentHoste.role}</p>
              </div>
            </div>
            <div className="flex items-center space-x-1 text-xs font-bold text-[#D97706]">
              <Star className="h-3.5 w-3.5 fill-[#D97706] text-[#D97706]" />
              <span>{currentHoste.rating}</span>
            </div>
          </div>
        </div>

        <div className="mt-5 space-y-3">
          <label className="text-[11px] font-bold text-slate-800">
            Select Replacement Hosté
          </label>

          <div className="relative">
            <Search className="absolute left-3 top-2.5 h-4 w-4 text-gray-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Hostés by name, role, or location..."
              className="w-full rounded-xl border border-gray-200 py-2.5 pl-9 pr-4 text-xs text-slate-800 placeholder-gray-400 focus:border-[#EE6038] focus:outline-none"
            />
          </div>

          <div className="space-y-2.5 pt-1">
            {replacementHostes.map((hoste) => {
              const isSelected = selectedHosteId === hoste.id;

              return (
                <div
                  key={hoste.id}
                  onClick={() => setSelectedHosteId(hoste.id)}
                  className={`flex cursor-pointer items-center justify-between rounded-xl border p-3.5 transition ${
                    isSelected
                      ? "border-[#EE6038] bg-[#FFF8F5]"
                      : "border-gray-200 bg-white hover:border-gray-300"
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`flex h-4 w-4 items-center justify-center rounded-full border ${
                        isSelected
                          ? "border-[#EE6038]"
                          : "border-gray-300 bg-white"
                      }`}
                    >
                      {isSelected && (
                        <div className="h-2 w-2 rounded-full bg-[#EE6038]" />
                      )}
                    </div>

                    <div
                      className={`flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold ${hoste.bgColor} ${hoste.textColor}`}
                    >
                      {hoste.initials}
                    </div>

                    <div>
                      <p className="text-xs font-bold text-slate-900">
                        {hoste.name}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        {hoste.role} • {hoste.location}
                      </p>
                    </div>
                  </div>

                  <div className="flex flex-col items-end space-y-1">
                    <span className="rounded-full bg-[#EAF8F0] px-2.5 py-0.5 text-[10px] font-bold text-[#1B5E20]">
                      {hoste.status}
                    </span>
                    <div className="flex items-center space-x-1 text-xs font-bold text-[#D97706]">
                      <Star className="h-3 w-3 fill-[#D97706] text-[#D97706]" />
                      <span>{hoste.rating}</span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-6 flex items-center justify-end space-x-3">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl border border-gray-200 px-6 py-2.5 text-xs font-bold text-slate-700 hover:bg-gray-50 transition"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={() => onReassign && onReassign(selectedHosteId)}
            className="rounded-xl bg-[#EE6038] px-6 py-2.5 text-xs font-bold text-white hover:bg-[#d8502a] transition shadow-sm"
          >
            Reassign Hosté
          </button>
        </div>
      </div>
    </div>
  );
}
