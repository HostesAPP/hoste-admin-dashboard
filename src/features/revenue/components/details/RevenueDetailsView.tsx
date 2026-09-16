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
  const { data: details = MOCK_REVENUE_TRANSACTION_DETAILS, isLoading } =
    useRevenueTransactionDetails(id);

  if (isLoading) {
    return (
      <div className="flex flex-col min-h-screen bg-background">
        <div className="w-full p-6 sm:p-8 space-y-6">
          <div className="h-10 w-48 bg-muted rounded-xl animate-pulse" />
          <div className="h-28 w-full bg-muted rounded-2xl animate-pulse" />
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            <div className="lg:col-span-8 h-96 bg-muted rounded-2xl animate-pulse" />
            <div className="lg:col-span-4 h-96 bg-muted rounded-2xl animate-pulse" />
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
