import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Overview | Hosté Admin Dashboard",
  description: "Marketplace key metrics, pending approvals, and activity overview.",
};

export default function DashboardOverviewPage() {
  return (
    <div className="space-y-6">
      
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Dashboard Overview</h1>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Overview metrics: Commission revenue, engagements by status, active profile counts, held funds, and open support tickets.
        </p>
      </div>
    </div>
  );
}
