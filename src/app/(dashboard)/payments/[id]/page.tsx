import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { mockRefundAdapter } from "@/features/payments/refund.adapter";

export const metadata: Metadata = {
  title: "Payment Details | Hosté Admin Dashboard",
  description:
    "Detailed view of transaction, payment attempts, processing fees, and payout status.",
};

interface PaymentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailsPage({
  params,
}: PaymentDetailsPageProps) {
  const { id } = await params;

  const context = await mockRefundAdapter.load(id);
  if (!context?.transaction.bookingId) notFound();
  redirect(
    `/bookings/${encodeURIComponent(context.transaction.bookingId)}/payments`,
  );
}
