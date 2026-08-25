import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Revenue Details | Hosté Admin Dashboard",
  description: "Detailed breakdown of revenue reports, periods, and categories.",
};

interface RevenueDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function RevenueDetailsPage({
  params,
}: RevenueDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Revenue Details</h1>
        <span className="text-sm font-mono text-muted-foreground">ID: {id}</span>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Detailed breakdown by period, booking type, platform commissions, and export options.
        </p>
      </div>
    </div>
  );
}
