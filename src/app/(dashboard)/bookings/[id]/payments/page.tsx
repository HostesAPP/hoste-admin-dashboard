"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, MoreHorizontal, Lock } from "lucide-react";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function PaymentDetailsPage({ params }: PageProps) {
  const resolvedParams = React.use(params);
  const rawId = resolvedParams?.id || "BK-10482";
  const bookingId = rawId.startsWith("#") ? rawId : `#${rawId}`;

  return (
    <div className="min-h-screen bg-[#F8F9FA] p-8 text-xs text-[#333333] font-sans">
      <main className="mx-auto max-w-[1400px] space-y-6">
        <div className="flex items-center justify-between">
          <div className="text-xs text-gray-400">
            <span>Bookings</span>
            <span className="mx-1.5">/</span>
            <span>{bookingId}</span>
            <span className="mx-1.5">/</span>
            <span className="font-semibold text-slate-800">
              Payment Details
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              href={`/bookings/${rawId}`}
              className="inline-flex items-center space-x-1.5 border border-gray-200 bg-white px-3.5 py-1.5 text-xs font-semibold text-slate-700 hover:bg-gray-50"
            >
              <ArrowLeft className="h-3.5 w-3.5 text-slate-500" />
              <span>Back to Booking</span>
            </Link>

            <button className="border border-gray-200 bg-white p-1.5 text-gray-500 hover:bg-gray-50">
              <MoreHorizontal className="h-4 w-4" />
            </button>
          </div>
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-slate-900">
          Payment Details
        </h1>
        <div className="grid grid-cols-6 items-center border border-gray-200 bg-white p-6 shadow-sm">
          <div>
            <p className="text-[10px] font-medium text-gray-400">Total Paid</p>
            <p className="mt-1 text-2xl font-extrabold text-slate-900">
              ₦250,000
            </p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400">
              Payment Status
            </p>
            <div className="mt-1.5">
              <span className="inline-block border border-[#C6F0D6] bg-[#E8F8EE] px-2.5 py-0.5 text-[11px] font-semibold text-[#006837]">
                Paid
              </span>
            </div>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400">
              Payment Method
            </p>
            <p className="mt-1 text-xs font-bold text-slate-900">Paystack</p>
            <p className="text-[10px] text-gray-400">Card (•••• 4092)</p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400">
              Payment Date
            </p>
            <p className="mt-1 text-xs font-bold text-slate-900">
              August 21, 2026
            </p>
            <p className="text-[10px] text-gray-400">10:24 AM WAT</p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400">
              Transaction ID
            </p>
            <p className="mt-1 text-xs font-bold text-slate-900">
              PSK-8F72K91X
            </p>
            <p className="text-[10px] text-gray-400">Ref: HOST-20260821-104</p>
          </div>

          <div>
            <p className="text-[10px] font-medium text-gray-400">
              Escrow Status
            </p>
            <div className="mt-1.5">
              <span className="inline-block bg-[#FFEDD5] px-2.5 py-0.5 text-[11px] font-semibold text-[#C2410C]">
                Held in Escrow
              </span>
            </div>
          </div>
        </div>
        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7 space-y-6">
            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-900">
                Payment Breakdown
              </h2>

              <div className="space-y-4 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-500">Booking Amount (Gross)</span>
                  <span className="font-bold text-slate-900">₦250,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Hosté Service Commission{" "}
                    <span className="text-[10px]">(20%)</span>
                  </span>
                  <span className="font-bold text-[#006837]">+ ₦50,000</span>
                </div>

                <div className="flex justify-between">
                  <span className="text-gray-500">
                    Hosté Net Payout Pool{" "}
                    <span className="text-[10px]">(8 Staff)</span>
                  </span>
                  <span className="font-bold text-[#C2410C]">₦200,000</span>
                </div>

                <div className="flex items-center justify-between border-t border-gray-100 bg-[#F8F9FA] p-4 font-bold">
                  <span className="text-xs text-slate-900">
                    Total Paid by Client
                  </span>
                  <span className="text-base text-slate-900">₦250,000</span>
                </div>
              </div>
            </div>
            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center space-x-2">
                <h2 className="text-sm font-bold text-slate-900">Escrow</h2>
                <span className="bg-[#FFEDD5] px-2 py-0.5 text-[10px] font-semibold text-[#C2410C]">
                  Held
                </span>
              </div>

              <div className="mb-6 grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Amount Held in Escrow
                  </p>
                  <p className="mt-1 text-xl font-extrabold text-slate-900">
                    ₦200,000
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Expected Hosté Payout Date
                  </p>
                  <p className="mt-1 text-xs font-bold text-slate-900">
                    August 29, 2026
                  </p>
                  <p className="text-[10px] text-gray-400">
                    (24 hours post-event completion)
                  </p>
                </div>
              </div>

              <div className="flex items-center space-x-2 border border-emerald-100 bg-[#E8F8EE]/50 p-3 text-xs text-[#006837]">
                <Lock className="h-4 w-4 shrink-0 text-[#006837]" />
                <span className="text-[11px] font-medium">
                  Funds are held securely until the booking is completed
                  according to Hosté&apos;s payment policy.
                </span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN */}
          <div className="col-span-5 space-y-6">
            {/* CLIENT & BOOKING */}
            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-900">
                Client & Booking
              </h2>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Client
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">
                    ABC Events Limited
                  </p>
                  <p className="text-[10px] text-gray-400">
                    Contact: John Okafor
                  </p>
                </div>

                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Booking & Event
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">
                    Luxury Corporate Dinner
                  </p>
                  <p className="text-[10px] text-gray-400">ID: {bookingId}</p>
                </div>
              </div>

              <div className="mt-4 flex items-center justify-between pt-2">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Event Date
                  </p>
                  <p className="mt-0.5 text-xs font-bold text-slate-900">
                    August 28, 2026
                  </p>
                </div>

                <Link
                  href={`/bookings/${rawId}`}
                  className="border border-gray-200 bg-[#F8F9FA] px-4 py-2 text-xs font-bold text-slate-700 hover:bg-gray-100"
                >
                  View Booking
                </Link>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <h2 className="mb-4 text-sm font-bold text-slate-900">
                Transaction Activity
              </h2>

              <div className="relative space-y-5 border-l border-gray-200 pl-4 text-xs">
                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#006837]" />
                  <div>
                    <p className="font-bold text-slate-800">
                      Payment initiated
                    </p>
                    <p className="text-[10px] text-gray-400">
                      August 21, 2026 - 10:20 AM
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#006837]" />
                  <div>
                    <p className="font-bold text-slate-800">
                      Payment successful
                    </p>
                    <p className="text-[10px] text-gray-400">
                      August 21, 2026 - 10:24 AM
                    </p>
                  </div>
                </div>

                <div className="relative">
                  <span className="absolute -left-[21px] top-1 h-2.5 w-2.5 rounded-full bg-[#006837]" />
                  <div>
                    <p className="font-bold text-slate-800">
                      Funds placed in escrow
                    </p>
                    <p className="text-[10px] text-gray-400">
                      August 21, 2026 - 10:25 AM
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <div className="border border-gray-200 bg-white p-6 shadow-sm">
              <div className="mb-4 flex items-center justify-between">
                <h2 className="text-sm font-bold text-slate-900">Refund</h2>
                <span className="bg-[#F1F5F9] px-2 py-0.5 text-[10px] font-semibold text-slate-500">
                  No refund issued
                </span>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <p className="text-[10px] font-medium text-gray-400">
                    Refundable Amount
                  </p>
                  <p className="mt-0.5 text-lg font-extrabold text-slate-900">
                    ₦250,000
                  </p>
                </div>

                <button
                  type="button"
                  className="border border-[#FECACA] bg-white px-4 py-2 text-xs font-bold text-[#DC2626] hover:bg-[#FECACA]/20"
                >
                  Refund Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
