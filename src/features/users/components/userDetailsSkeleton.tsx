"use client";

import React from "react";

export function UserDetailsSkeleton() {
  return (
    <div className="flex flex-col min-h-screen bg-background space-y-6 pb-12 animate-pulse">
      {/* Top Header Skeleton */}
      <div className="p-6 border-b border-border/80 bg-card">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="space-y-1.5">
            <div className="h-6 w-36 bg-muted rounded-md" />
            <div className="h-3.5 w-64 bg-muted rounded" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-24 bg-muted rounded-full" />
            <div className="h-9 w-48 sm:w-60 bg-muted rounded-full" />
          </div>
        </div>
      </div>

      <main className="px-6 space-y-6">
        {/* Breadcrumb Navigation & Top Action Bar Skeleton */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-1">
          <div className="space-y-2">
            {/* Breadcrumb line */}
            <div className="flex items-center gap-2">
              <div className="h-3.5 w-16 bg-muted rounded" />
              <span className="text-muted-foreground/40 text-xs">/</span>
              <div className="h-3.5 w-12 bg-muted rounded" />
              <span className="text-muted-foreground/40 text-xs">/</span>
              <div className="h-3.5 w-24 bg-muted rounded" />
            </div>
            {/* Back link */}
            <div className="h-4 w-28 bg-muted rounded" />
          </div>

          <div className="flex items-center gap-3">
            <div className="h-9 w-32 bg-muted rounded-lg" />
          </div>
        </div>

        {/* User Profile Card Skeleton */}
        <div className="bg-card rounded-xl border border-border/80 p-5 sm:p-6 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-5">
          <div className="flex items-center gap-4 min-w-0">
            {/* Avatar */}
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-full bg-muted shrink-0 border border-border/60" />

            <div className="flex flex-col gap-2.5">
              <div className="flex items-center gap-2.5">
                <div className="h-6 w-44 bg-muted rounded-md" />
                <div className="h-5 w-20 bg-muted rounded-full" />
                <div className="h-4 w-24 bg-muted rounded font-mono" />
              </div>

              <div className="flex items-center gap-2">
                <div className="h-3.5 w-20 bg-muted rounded" />
                <span className="text-muted-foreground/30">•</span>
                <div className="h-3.5 w-36 bg-muted rounded" />
                <span className="text-muted-foreground/30">•</span>
                <div className="h-3.5 w-28 bg-muted rounded" />
                <span className="text-muted-foreground/30">•</span>
                <div className="h-3.5 w-24 bg-muted rounded" />
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="h-9 w-32 bg-muted rounded-md" />
            <div className="h-9 w-28 bg-muted rounded-md" />
          </div>
        </div>

        {/* Middle Grid of 4 Structured Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {/* Card 1: User Information */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-20 bg-muted rounded" />
                  <div className="h-3.5 w-28 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* Card 2: Role & Permissions */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-36 bg-muted rounded" />
            <div className="space-y-2.5 pb-2 border-b border-border/50">
              <div className="flex items-center justify-between">
                <div className="h-3 w-12 bg-muted rounded" />
                <div className="h-3.5 w-20 bg-muted rounded" />
              </div>
            </div>
            <div className="space-y-2.5">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="h-3.5 w-3.5 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/50 text-right">
              <div className="h-3.5 w-36 bg-muted rounded ml-auto" />
            </div>
          </div>

          {/* Card 3: Security & Access */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="space-y-3">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-28 bg-muted rounded" />
                  <div className="h-3.5 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="pt-2 border-t border-border/50 text-right">
              <div className="h-3.5 w-32 bg-muted rounded ml-auto" />
            </div>
          </div>

          {/* Card 4: Administrative Activity */}
          <div className="bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-40 bg-muted rounded" />
            <div className="space-y-4">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="flex items-center justify-between">
                  <div className="h-3 w-32 bg-muted rounded" />
                  <div className="h-5 w-14 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="h-4" />
          </div>
        </div>

        {/* Bottom Grid: Recent Activity & Account Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 lg:gap-5">
          {/* Recent Activity (8 cols) */}
          <div className="lg:col-span-8 bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map((i) => (
                <div
                  key={i}
                  className="p-3 rounded-lg bg-muted/20 border border-border/50 space-y-2.5"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 rounded-full bg-muted shrink-0" />
                    <div className="h-3.5 w-24 bg-muted rounded" />
                  </div>
                  <div className="h-3 w-full bg-muted rounded" />
                  <div className="h-2.5 w-20 bg-muted rounded" />
                </div>
              ))}
            </div>
            <div className="pt-2 text-right">
              <div className="h-3.5 w-28 bg-muted rounded ml-auto" />
            </div>
          </div>

          {/* Account Actions (4 cols) */}
          <div className="lg:col-span-4 bg-card rounded-xl border border-border/80 p-5 shadow-xs flex flex-col justify-between space-y-4">
            <div className="h-4 w-32 bg-muted rounded" />
            <div className="space-y-2.5">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-9 w-full bg-muted rounded-lg" />
              ))}
            </div>
            <div className="h-2" />
          </div>
        </div>
      </main>
    </div>
  );
}
