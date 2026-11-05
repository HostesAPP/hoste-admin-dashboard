"use client";

import React, { useEffect, useState } from "react";
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
  const [previousIsOpen, setPreviousIsOpen] = useState(isOpen);
  const [selectedHosteId, setSelectedHosteId] = useState("blessing-eze");

  if (previousIsOpen !== isOpen) {
    setPreviousIsOpen(isOpen);
    if (!isOpen) setSearchQuery("");
  }

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

  const filteredHostes = replacementHostes.filter((hoste) =>
    `${hoste.name} ${hoste.role} ${hoste.location}`
      .toLowerCase()
      .includes(searchQuery.toLowerCase().trim()),
  );

  // Lock background scrolling while the modal is open.
  useEffect(() => {
    if (!isOpen) return;

    const previousBodyOverflow = document.body.style.overflow;
    const previousHtmlOverflow = document.documentElement.style.overflow;

    document.body.style.overflow = "hidden";
    document.documentElement.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousBodyOverflow;
      document.documentElement.style.overflow = previousHtmlOverflow;
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center overflow-hidden bg-black/50 p-3 sm:p-5"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose?.();
        }
      }}
    >
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="reassign-hoste-title"
        className="relative flex max-h-[calc(100dvh-24px)] w-full max-w-[520px] flex-col overflow-hidden border border-gray-200 bg-white shadow-xl sm:max-h-[calc(100dvh-40px)]"
      >
        {/* FIXED MODAL HEADER */}
        <div className="relative shrink-0 border-b border-gray-100 px-5 py-5 sm:px-6">
          <button
            onClick={onClose}
            type="button"
            aria-label="Close reassign Hosté modal"
            className="absolute right-4 top-4 p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-700"
          >
            <X className="h-5 w-5" />
          </button>

          <div className="mb-3 flex h-10 w-10 items-center justify-center bg-[#F1F3F5]">
            <ArrowLeftRight className="h-4 w-4 text-slate-700" />
          </div>

          <h2
            id="reassign-hoste-title"
            className="text-lg font-bold tracking-tight text-slate-900 sm:text-xl"
          >
            Reassign Hosté
          </h2>

          <p className="mt-1 pr-6 text-xs leading-5 text-gray-500">
            Select a new Hosté to assign to booking{" "}
            <strong className="font-bold text-slate-900">{bookingId}</strong>.
          </p>
        </div>

        {/* SCROLLABLE MODAL CONTENT */}
        <div
          className="min-h-0 flex-1 space-y-5 overflow-y-auto overscroll-contain px-5 py-5 sm:px-6"
          style={{ WebkitOverflowScrolling: "touch" }}
        >
          {/* CURRENT HOSTÉ */}
          <section>
            <label className="text-xs font-bold text-slate-800">
              Current Hosté
            </label>

            <div className="mt-2 flex items-center justify-between gap-3 border border-gray-200 bg-[#F8F9FA] p-3">
              <div className="flex min-w-0 items-center gap-3">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center bg-[#E2E8F0] text-xs font-bold text-slate-600">
                  {currentHoste.initials}
                </div>

                <div className="min-w-0">
                  <p className="text-xs font-bold text-slate-900">
                    {currentHoste.name}
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    {currentHoste.role}
                  </p>
                </div>
              </div>

              <div className="flex shrink-0 items-center gap-1 text-xs font-bold text-[#D97706]">
                <Star className="h-3.5 w-3.5 fill-[#D97706] text-[#D97706]" />
                <span>{currentHoste.rating.toFixed(1)}</span>
              </div>
            </div>
          </section>

          {/* REPLACEMENT HOSTÉS */}
          <section>
            <label
              htmlFor="replacement-hoste-search"
              className="text-xs font-bold text-slate-800"
            >
              Select Replacement Hosté
            </label>

            <div className="relative mt-2">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />

              <input
                id="replacement-hoste-search"
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                placeholder="Search by name, role, or location..."
                className="w-full border border-gray-200 bg-white py-2.5 pl-9 pr-3 text-xs text-slate-800 outline-none placeholder:text-gray-400 focus:border-[#EF5A22] focus:ring-1 focus:ring-[#EF5A22]"
              />
            </div>

            <div className="mt-3 space-y-2">
              {filteredHostes.map((hoste) => {
                const isSelected = selectedHosteId === hoste.id;

                return (
                  <button
                    key={hoste.id}
                    type="button"
                    aria-pressed={isSelected}
                    onClick={() => setSelectedHosteId(hoste.id)}
                    className={`flex w-full items-center justify-between gap-3 border p-3 text-left transition ${
                      isSelected
                        ? "border-[#EF5A22] bg-[#FFF8F5]"
                        : "border-gray-200 bg-white hover:border-gray-300"
                    }`}
                  >
                    <div className="flex min-w-0 items-center gap-3">
                      {/* SELECTION INDICATOR */}
                      <div
                        className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border ${
                          isSelected ? "border-[#EF5A22]" : "border-gray-300"
                        }`}
                      >
                        {isSelected && (
                          <span className="h-2 w-2 rounded-full bg-[#EF5A22]" />
                        )}
                      </div>

                      {/* AVATAR */}
                      <div
                        className={`flex h-9 w-9 shrink-0 items-center justify-center text-xs font-bold ${hoste.bgColor} ${hoste.textColor}`}
                      >
                        {hoste.initials}
                      </div>

                      {/* HOSTÉ DETAILS */}
                      <div className="min-w-0">
                        <p className="text-xs font-bold text-slate-900">
                          {hoste.name}
                        </p>

                        <p className="mt-1 text-[10px] leading-4 text-gray-500 sm:text-[11px]">
                          {hoste.role} · {hoste.location}
                        </p>
                      </div>
                    </div>

                    {/* AVAILABILITY AND RATING */}
                    <div className="flex shrink-0 flex-col items-end gap-1.5">
                      <span className="border border-emerald-200 bg-emerald-50 px-2 py-0.5 text-[10px] font-semibold text-emerald-700">
                        {hoste.status}
                      </span>

                      <span className="flex items-center gap-1 text-xs font-bold text-slate-700">
                        <Star className="h-3 w-3 fill-amber-400 text-amber-400" />
                        {hoste.rating.toFixed(1)}
                      </span>
                    </div>
                  </button>
                );
              })}

              {filteredHostes.length === 0 && (
                <div className="border border-gray-200 px-4 py-8 text-center">
                  <Search className="mx-auto h-5 w-5 text-gray-400" />

                  <p className="mt-2 text-xs font-semibold text-slate-700">
                    No Hostés found
                  </p>

                  <p className="mt-1 text-[11px] text-gray-500">
                    Try another name, role, or location.
                  </p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* FIXED MODAL FOOTER */}
        <div className="flex shrink-0 flex-col-reverse gap-2 border-t border-gray-200 bg-white px-5 py-4 sm:flex-row sm:justify-end sm:px-6">
          <button
            type="button"
            onClick={onClose}
            className="border border-gray-300 bg-white px-5 py-2.5 text-xs font-semibold text-slate-700 transition hover:bg-gray-50"
          >
            Cancel
          </button>

          <button
            type="button"
            disabled={!selectedHosteId}
            onClick={() => onReassign?.(selectedHosteId)}
            className="bg-[#EF5A22] px-5 py-2.5 text-xs font-semibold text-white transition hover:bg-[#D94B18] disabled:cursor-not-allowed disabled:opacity-50"
          >
            Reassign Hosté
          </button>
        </div>
      </div>
    </div>
  );
}
