import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Payments | Hosté Admin Dashboard",
  description: "Manage transactions, held funds, payouts, and refund processing.",
};

export default function PaymentsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Payment Overview</h1>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Held funds, commission breakdown, manual payout triggers, and refund history.
        </p>
      </div>
    </div>
  );
}
