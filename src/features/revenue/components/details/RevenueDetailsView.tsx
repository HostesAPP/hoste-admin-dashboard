// features/revenue/components/details/RevenueDetailsView.tsx

"use client";

import React from "react";
import { RevenueDetailsHeader } from "./RevenueDetailsHeader";
import { TransactionSummaryCard } from "./TransactionSummaryCard";
import { PaymentJourneyCard } from "./PaymentJourneyCard";
import { TransactionActionButtons } from "./TransactionActionButtons";
import { BookingInformationCard } from "./BookingInformationCard";
import { FinancialBreakdownCard } from "./FinancialBreakdownCard";
import { useRevenueTransactionDetails } from "../../hooks/revenue.hooks";
import { MOCK_REVENUE_TRANSACTION_DETAILS } from "../../data/revenue.data";

interface RevenueDetailsViewProps {
  id: string;
}

export function RevenueDetailsView({ id }: RevenueDetailsViewProps) {
  const {
    data: details = MOCK_REVENUE_TRANSACTION_DETAILS,
    isLoading,
    isError,
    refetch,
  } = useRevenueTransactionDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="w-full p-6 sm:p-8 space-y-6">
          {/* Header Skeleton */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-2 animate-pulse">
            <div className="space-y-2">
              <div className="h-4 w-48 bg-muted rounded" />
              <div className="h-3 w-64 bg-muted rounded" />
            </div>
            <div className="flex items-center gap-3">
              <div className="h-9 w-48 sm:w-64 bg-muted rounded-xl" />
              <div className="w-9 h-9 bg-muted rounded-xl" />
              <div className="flex items-center gap-2.5 pl-1">
                <div className="w-8 h-8 rounded-full bg-muted" />
                <div className="space-y-1">
                  <div className="h-3 w-16 bg-muted rounded" />
                  <div className="h-2.5 w-12 bg-muted rounded" />
                </div>
              </div>
            </div>
          </div>

          {/* 1. Transaction Summary Top Full Card Skeleton */}
          <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-6 animate-pulse">
            <div className="flex items-center justify-between">
              <div className="h-4 w-36 bg-muted rounded" />
              <div className="h-6 w-24 bg-muted rounded-full" />
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 pt-1 border-t border-border/60">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="space-y-2">
                  <div className="h-2.5 w-20 bg-muted rounded" />
                  <div className="h-3.5 w-24 bg-muted rounded" />
                </div>
              ))}
            </div>
          </div>

          {/* 2. Main 2-Column Split Skeleton */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            {/* Left Column Skeleton */}
            <div className="lg:col-span-8 space-y-5 animate-pulse">
              <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-6">
                <div className="h-4 w-32 bg-muted rounded" />
                <div className="space-y-6 pt-1">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="flex items-start gap-3.5">
                      <div className="w-4 h-4 rounded bg-muted mt-0.5 shrink-0" />
                      <div className="space-y-1.5 flex-1">
                        <div className="h-3.5 w-44 bg-muted rounded" />
                        <div className="h-3 w-3/4 bg-muted rounded" />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Action Buttons Skeleton */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <div className="h-10 w-36 bg-muted rounded-xl" />
                <div className="h-10 w-36 bg-muted rounded-xl" />
                <div className="h-10 w-28 bg-muted rounded-xl" />
                <div className="h-10 w-28 bg-muted rounded-xl" />
              </div>
            </div>

            {/* Right Column Skeleton */}
            <div className="lg:col-span-4 space-y-5 animate-pulse">
              {/* Booking Information Skeleton */}
              <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-5">
                <div className="h-3.5 w-32 bg-muted rounded" />
                <div className="grid grid-cols-2 gap-y-4 gap-x-6">
                  {[1, 2, 3, 4, 5, 6].map((i) => (
                    <div key={i} className="space-y-1.5">
                      <div className="h-2.5 w-16 bg-muted rounded" />
                      <div className="h-3.5 w-24 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>

              {/* Financial Breakdown Skeleton */}
              <div className="bg-card rounded-2xl border border-border/80 p-6 space-y-4">
                <div className="h-3.5 w-32 bg-muted rounded" />
                <div className="divide-y divide-border/60">
                  {[1, 2, 3, 4, 5].map((i) => (
                    <div key={i} className="py-2.5 flex items-center justify-between">
                      <div className="h-3 w-28 bg-muted rounded" />
                      <div className="h-3.5 w-20 bg-muted rounded" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (isError || !details) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="w-full p-6 sm:p-8 space-y-6">
          <RevenueDetailsHeader />
          <div className="bg-card rounded-2xl border border-destructive/20 p-10 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 rounded-full bg-destructive/10 text-destructive flex items-center justify-center font-bold text-lg">
              !
            </div>
            <div className="space-y-1 max-w-md">
              <h2 className="text-base font-bold text-foreground">
                Unable to Load Transaction Details
              </h2>
              <p className="text-xs text-muted-foreground">
                We encountered an issue retrieving transaction #{id}. Please try again or return to the overview.
              </p>
            </div>
            <div className="flex items-center gap-3 pt-2">
              <button
                type="button"
                onClick={() => refetch()}
                className="px-4 py-2 bg-primary text-primary-foreground text-xs font-semibold rounded-xl hover:bg-primary/90 transition-colors cursor-pointer"
              >
                Retry
              </button>
              <a
                href="/revenue"
                className="px-4 py-2 border border-border bg-card text-foreground text-xs font-semibold rounded-xl hover:bg-muted/50 transition-colors"
              >
                Back to Revenue
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Full width container without max-width restriction */}
      <div className="w-full p-6 sm:p-8 space-y-6">
        {/* Top Header */}
        <RevenueDetailsHeader />

        {/* 1. Transaction Summary Top Full Card */}
        <section>
          <TransactionSummaryCard details={details} />
        </section>

        {/* 2. Main 2-Column Split */}
        <section className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* Left Column (~65% / 8 cols): Payment Journey + Action Buttons */}
          <div className="lg:col-span-8 space-y-5">
            <PaymentJourneyCard steps={details.paymentJourney} />
            <TransactionActionButtons
              bookingId={details.bookingId}
              transactionId={details.transactionId}
            />
          </div>

          {/* Right Column (~35% / 4 cols): Booking Information + Financial Breakdown */}
          <div className="lg:col-span-4 space-y-5">
            <BookingInformationCard booking={details.bookingInfo} />
            <FinancialBreakdownCard breakdown={details.financialBreakdown} />
          </div>
        </section>
      </div>
    </div>
  );
}
