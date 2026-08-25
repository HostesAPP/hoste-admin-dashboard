import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue | Hosté Admin Dashboard",
  description: "Total marketplace commission revenue, analytics, and performance reports.",
};

export default function RevenuePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Total Revenue</h1>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Commission earned overview (from payments & payouts), monthly/weekly trends, and category performance breakdown.
        </p>
      </div>
    </div>
  );
}
