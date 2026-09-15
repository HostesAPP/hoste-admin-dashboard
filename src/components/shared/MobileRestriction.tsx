
"use client";

import React from "react";
import { ShieldCheck } from "lucide-react";
import { Button } from "@/components/ui/button";

export function MobileRestrictionPage({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      {/* Mobile / Tablet Restriction Screen (viewports < 1280px) */}
      <div className="flex xl:hidden min-h-screen w-full bg-background text-foreground flex-col items-center justify-between p-6 sm:p-8 select-none">
        {/* Top Spacer / Header Container */}
        <div className="w-full max-w-sm flex flex-col items-center pt-2 sm:pt-4">
          {/* Brand Header */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-primary/20 flex items-center justify-center border border-primary/60 shadow-xs">
              <span className="text-primary font-extrabold text-xs tracking-tight">
                HOSTÉ
              </span>
            </div>
            <div className="flex flex-col text-left">
              <span className="font-extrabold text-base tracking-wide text-foreground">
                HOSTÉ
              </span>
              <span className="text-xs text-muted-foreground font-normal">
                Admin Dashboard
              </span>
            </div>
          </div>
        </div>

        {/* Center Graphic & Message Card */}
        <div className="w-full max-w-sm flex flex-col items-center my-auto py-6">
          {/* Device Mockup Graphic with Floating Badges */}
          <div className="relative w-full max-w-70 sm:max-w-[320px] mb-6 flex flex-col items-center">
            {/* Laptop Vector */}
            <div className="relative w-full">
              <svg
                viewBox="0 0 320 200"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
                className="w-full h-auto drop-shadow-lg"
              >
                {/* Laptop Display Outer Bezel */}
                <rect
                  x="28"
                  y="12"
                  width="264"
                  height="162"
                  rx="10"
                  fill="#1E2022"
                />
                {/* Display Inner Screen Bezel */}
                <rect
                  x="34"
                  y="18"
                  width="252"
                  height="150"
                  rx="6"
                  fill="#111315"
                />
                {/* Webcam Notch */}
                <circle cx="160" cy="15" r="1.5" fill="#4B5563" />

                {/* Dashboard Screen Content */}
                <rect
                  x="38"
                  y="22"
                  width="244"
                  height="142"
                  rx="4"
                  fill="#FAFAFA"
                />

                {/* Screen UI - Mini Sidebar */}
                <rect x="38" y="22" width="42" height="142" fill="#F1F3F5" />
                <rect
                  x="44"
                  y="28"
                  width="18"
                  height="5"
                  rx="2"
                  fill="#EF5A22"
                  fillOpacity="0.8"
                />
                <rect
                  x="44"
                  y="40"
                  width="30"
                  height="4"
                  rx="2"
                  fill="#D1D5DB"
                />
                <rect
                  x="44"
                  y="48"
                  width="24"
                  height="4"
                  rx="2"
                  fill="#D1D5DB"
                />
                <rect
                  x="44"
                  y="56"
                  width="28"
                  height="4"
                  rx="2"
                  fill="#D1D5DB"
                />
                <rect
                  x="44"
                  y="64"
                  width="22"
                  height="4"
                  rx="2"
                  fill="#D1D5DB"
                />
                <rect
                  x="44"
                  y="72"
                  width="26"
                  height="4"
                  rx="2"
                  fill="#D1D5DB"
                />

                {/* Screen UI - Mini Topbar */}
                <rect x="80" y="22" width="202" height="16" fill="#FFFFFF" />
                <line
                  x1="80"
                  y1="38"
                  x2="282"
                  y2="38"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <rect
                  x="88"
                  y="27"
                  width="50"
                  height="6"
                  rx="3"
                  fill="#E5E7EB"
                />
                <circle cx="270" cy="30" r="4" fill="#EF5A22" />

                {/* Screen UI - Content Area Cards */}
                {/* Chat/Activity Bubble Left */}
                <rect
                  x="88"
                  y="46"
                  width="85"
                  height="22"
                  rx="4"
                  fill="#F4F5F7"
                />
                <rect
                  x="94"
                  y="52"
                  width="60"
                  height="4"
                  rx="2"
                  fill="#9CA3AF"
                />
                <rect
                  x="94"
                  y="59"
                  width="40"
                  height="3"
                  rx="1.5"
                  fill="#CBD5E1"
                />

                {/* Chat/Activity Bubble Right */}
                <rect
                  x="120"
                  y="74"
                  width="90"
                  height="24"
                  rx="4"
                  fill="#FFEFE6"
                />
                <rect
                  x="126"
                  y="80"
                  width="70"
                  height="4"
                  rx="2"
                  fill="#EF5A22"
                  fillOpacity="0.7"
                />
                <rect
                  x="126"
                  y="88"
                  width="45"
                  height="3"
                  rx="1.5"
                  fill="#EF5A22"
                  fillOpacity="0.4"
                />

                {/* Side Profile Card on Screen */}
                <rect
                  x="218"
                  y="46"
                  width="58"
                  height="62"
                  rx="4"
                  fill="#FFFFFF"
                  stroke="#E5E7EB"
                  strokeWidth="1"
                />
                <circle cx="247" cy="58" r="6" fill="#D1D5DB" />
                <rect
                  x="226"
                  y="68"
                  width="42"
                  height="3"
                  rx="1.5"
                  fill="#9CA3AF"
                />
                <rect
                  x="230"
                  y="74"
                  width="34"
                  height="3"
                  rx="1.5"
                  fill="#E5E7EB"
                />
                <rect
                  x="224"
                  y="84"
                  width="46"
                  height="8"
                  rx="2"
                  fill="#EF5A22"
                  fillOpacity="0.8"
                />

                {/* Laptop Bottom Base */}
                <path
                  d="M10 174C10 173 12 172 15 172H305C308 172 310 173 310 174L316 179C318 181 316 183 313 183H7C4 183 2 181 4 179L10 174Z"
                  fill="#9CA3AF"
                />
                <path
                  d="M4 179L10 174H310L316 179H4Z"
                  fill="#D1D5DB"
                  fillOpacity="0.6"
                />
                {/* Trackpad Opening */}
                <rect
                  x="138"
                  y="173"
                  width="44"
                  height="3"
                  rx="1.5"
                  fill="#6B7280"
                />
              </svg>

              {/* Security Shield Badge Overlaid on bottom right of laptop */}
              <div className="absolute -bottom-2 right-1 sm:right-3 w-10 h-10 rounded-full bg-white shadow-md border border-primary/20 flex items-center justify-center">
                <ShieldCheck className="w-5 h-5 text-primary" />
              </div>
            </div>

            {/* Restricted Phone Circular Badge Below Laptop */}
            <div className="w-14 h-14 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mt-3 shadow-xs">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="w-6 h-6 text-primary"
              >
                {/* Smartphone outline */}
                <rect x="5" y="2" width="14" height="20" rx="2" ry="2" />
                {/* Diagonal Strike */}
                <line x1="2" y1="2" x2="22" y2="22" strokeWidth="2.5" />
              </svg>
            </div>
          </div>

          {/* Restriction Copy */}
          <div className="text-center px-2 mt-6">
            <span className="text-xs sm:text-sm font-semibold text-primary">
              Sign In to HOSTÉ Admin
            </span>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground mt-1.5">
              Desktop Access Required
            </h1>
            <p className="text-xs sm:text-sm text-muted-foreground mt-2.5 leading-relaxed">
              The Hosté Admin Dashboard is currently only available on desktop
              devices.
            </p>
            <p className="text-xs sm:text-sm text-muted-foreground mt-1 leading-relaxed">
              Please log in using a PC or laptop to access your dashboard.
            </p>
          </div>

          {/* Got it Action Button */}
          <div className="w-full mt-6 sm:mt-8">
            <Button
              type="button"
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.location.reload();
                }
              }}
              className="w-full h-11 sm:h-12 bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl text-sm sm:text-base shadow-sm transition-all cursor-pointer"
            >
              Got it
            </Button>
          </div>
        </div>

        {/* Support Help Footer */}
        <div className="w-full max-w-sm pb-2 sm:pb-4">
          <div className="w-full h-px bg-border/60 mb-5" />
          <div className="flex items-center gap-3.5 text-left">
            <div className="w-9 h-9 rounded-full border border-primary/40 bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0">
              ?
            </div>
            <div>
              <p className="text-xs sm:text-sm font-bold text-foreground leading-snug">
                Need help?
              </p>
              <p className="text-xs text-muted-foreground">
                Contact our support team at{" "}
                <a
                  href="mailto:support@hoste.ng"
                  className="text-primary font-semibold hover:underline"
                >
                  support@hoste.ng
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Desktop Dashboard View (viewports >= 1280px) */}
      <div className="xl:flex min-h-full flex-col hidden">{children}</div>
    </>
  );
}
