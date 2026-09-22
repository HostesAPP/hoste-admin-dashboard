"use client";

import React from "react";

export function GroupDetailsSkeleton() {
  return (
    <div className="space-y-6 pb-12 animate-pulse">
      {/* 1. Page Header Skeleton */}
      <div className="p-6 border-b border-border/80 bg-card">
        {/* Breadcrumb */}
        <div className="flex items-center gap-2">
          <div className="h-3.5 w-16 bg-muted rounded" />
          <span className="text-muted-foreground/40 text-xs">/</span>
          <div className="h-3.5 w-12 bg-muted rounded" />
          <span className="text-muted-foreground/40 text-xs">/</span>
          <div className="h-3.5 w-28 bg-muted rounded" />
        </div>

        {/* Back Link */}
        <div className="mt-4">
          <div className="h-4 w-28 bg-muted rounded" />
        </div>

        {/* Title & Action Buttons */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mt-6">
          <div className="flex items-center gap-3 flex-wrap">
            <div className="h-8 w-56 bg-muted rounded-lg" />
            <div className="h-5 w-20 bg-muted rounded" />
            <div className="h-6 w-16 bg-muted rounded-full" />
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-32 bg-muted rounded-lg" />
            <div className="h-9 w-9 bg-muted rounded-lg" />
          </div>
        </div>
      </div>

      {/* 2. Main Content Area */}
      <main className="px-4 sm:px-6 lg:px-8 space-y-6 max-w-7xl mx-auto">
        {/* Bio & Hero Card */}
        <section className="p-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col sm:flex-row items-start sm:items-center gap-5">
          <div className="w-24 h-24 rounded-2xl bg-muted shrink-0 border border-border/50" />
          <div className="flex-1 space-y-3 w-full">
            <div className="flex items-center gap-2.5">
              <div className="h-7 w-48 bg-muted rounded-lg" />
              <div className="h-5 w-28 bg-muted rounded-full" />
            </div>
            <div className="space-y-1.5 max-w-3xl">
              <div className="h-4 w-full bg-muted rounded" />
              <div className="h-4 w-4/5 bg-muted rounded" />
            </div>
            <div className="flex items-center gap-3 pt-1">
              <div className="h-3.5 w-32 bg-muted rounded" />
              <span className="text-muted-foreground/30">•</span>
              <div className="h-3.5 w-36 bg-muted rounded" />
              <span className="text-muted-foreground/30">•</span>
              <div className="h-3.5 w-24 bg-muted rounded" />
            </div>
          </div>
        </section>

        {/* 4 Stat Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {[1, 2, 3, 4].map((i) => (
            <div
              key={i}
              className="p-5 rounded-xl border border-border/80 bg-card shadow-xs space-y-2.5"
            >
              <div className="h-3.5 w-24 bg-muted rounded" />
              <div className="h-8 w-20 bg-muted rounded-lg" />
              <div className="h-3 w-32 bg-muted rounded" />
            </div>
          ))}
        </section>

        {/* Group Information & Group Leader (3 Columns: 2 + 1) */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Information Card (2 cols) */}
          <section className="lg:col-span-2 p-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-border/70">
              <div className="h-5 w-36 bg-muted rounded" />
              <div className="h-8 w-28 bg-muted rounded-lg" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-y-5 gap-x-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-1.5">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-4 w-32 bg-muted rounded" />
                </div>
              ))}
              <div className="col-span-1 sm:col-span-2 space-y-1.5 pt-1">
                <div className="h-3 w-20 bg-muted rounded" />
                <div className="h-4 w-full bg-muted rounded" />
              </div>
            </div>
          </section>

          {/* Group Leader Card (1 col) */}
          <section className="p-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-5">
            <div className="pb-4 border-b border-border/70">
              <div className="h-5 w-28 bg-muted rounded" />
            </div>
            <div className="space-y-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full bg-muted shrink-0" />
                <div className="space-y-1.5">
                  <div className="h-4 w-28 bg-muted rounded" />
                  <div className="h-3 w-36 bg-muted rounded" />
                  <div className="h-3 w-20 bg-muted rounded" />
                </div>
              </div>
              <div className="space-y-2 pt-3 border-t border-border/60">
                <div className="h-3.5 w-44 bg-muted rounded" />
                <div className="h-3.5 w-40 bg-muted rounded" />
                <div className="h-3.5 w-36 bg-muted rounded" />
              </div>
            </div>
            <div className="pt-2">
              <div className="h-9 w-full bg-muted rounded-lg" />
            </div>
          </section>
        </div>

        {/* Group Members Table Card */}
        <section className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-5 border-b border-border/70 flex items-center justify-between">
            <div className="space-y-1">
              <div className="h-5 w-36 bg-muted rounded" />
              <div className="h-3 w-48 bg-muted rounded" />
            </div>
            <div className="h-8 w-32 bg-muted rounded-lg" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-muted" />
                  <div className="space-y-1">
                    <div className="h-3.5 w-28 bg-muted rounded" />
                    <div className="h-3 w-36 bg-muted rounded" />
                  </div>
                </div>
                <div className="h-6 w-20 bg-muted rounded-full" />
                <div className="h-6 w-16 bg-muted rounded-full" />
                <div className="h-3.5 w-24 bg-muted rounded" />
                <div className="h-8 w-8 bg-muted rounded-lg" />
              </div>
            ))}
          </div>
        </section>

        {/* Performance & Activity (2 Columns) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Performance Card */}
          <section className="p-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-4">
            <div className="space-y-1">
              <div className="h-5 w-40 bg-muted rounded" />
              <div className="h-3 w-56 bg-muted rounded" />
            </div>
            <div className="h-36 w-full bg-muted/60 rounded-xl" />
            <div className="grid grid-cols-3 gap-2 pt-4 border-t border-border/70">
              {[1, 2, 3].map((i) => (
                <div key={i} className="space-y-1">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-5 w-14 bg-muted rounded" />
                </div>
              ))}
            </div>
          </section>

          {/* Activity Card */}
          <section className="p-6 rounded-xl border border-border/80 bg-card shadow-xs flex flex-col justify-between space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-border/70">
              <div className="h-5 w-32 bg-muted rounded" />
              <div className="h-3.5 w-24 bg-muted rounded" />
            </div>
            <div className="space-y-4 py-2">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-3 h-3 rounded-full bg-muted mt-1 shrink-0" />
                  <div className="space-y-1 flex-1">
                    <div className="h-3.5 w-4/5 bg-muted rounded" />
                    <div className="h-3 w-28 bg-muted rounded" />
                  </div>
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <div className="h-3 w-36 bg-muted rounded ml-auto" />
            </div>
          </section>
        </div>

        {/* Recent Group Bookings Card */}
        <section className="rounded-xl border border-border/80 bg-card shadow-xs overflow-hidden">
          <div className="p-5 border-b border-border/70 flex items-center justify-between">
            <div className="h-5 w-48 bg-muted rounded" />
            <div className="h-3.5 w-28 bg-muted rounded" />
          </div>
          <div className="p-4 space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="flex items-center justify-between py-2 border-b border-border/50 last:border-0"
              >
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-4 w-36 bg-muted rounded" />
                <div className="h-3.5 w-24 bg-muted rounded" />
                <div className="h-4 w-20 bg-muted rounded" />
                <div className="h-6 w-20 bg-muted rounded-full" />
              </div>
            ))}
          </div>
        </section>

        {/* Management Controls (Danger Zone) */}
        <section className="p-6 rounded-xl border border-border/80 bg-card shadow-xs flex items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="h-5 w-44 bg-muted rounded" />
            <div className="h-3.5 w-72 bg-muted rounded" />
          </div>
          <div className="h-9 w-36 bg-muted rounded-lg" />
        </section>
      </main>
    </div>
  );
}
