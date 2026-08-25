import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payment Details | Hosté Admin Dashboard",
  description: "Detailed view of transaction, payment attempts, processing fees, and payout status.",
};

interface PaymentDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function PaymentDetailsPage({
  params,
}: PaymentDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payment Details</h1>
        <span className="text-sm font-mono text-muted-foreground">ID: {id}</span>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Transaction breakdown, fee analysis, payment attempt chain, and payout/refund audit logs.
        </p>
      </div>
    </div>
  );
}
