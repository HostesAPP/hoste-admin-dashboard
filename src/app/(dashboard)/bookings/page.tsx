import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Bookings | Hosté Admin Dashboard",
  description: "View and filter marketplace engagements and bookings.",
};

export default function BookingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Bookings</h1>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Marketplace engagements, status filters (Pending, Accepted, In Progress, Completed, Cancelled, Disputed), and participant details.
        </p>
      </div>
    </div>
  );
}
