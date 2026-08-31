import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Booking Details | Hosté Admin Dashboard",
  description: "Engagement details, status timeline, participant breakdown, and payment context.",
};

interface BookingDetailsPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailsPage({
  params,
}: BookingDetailsPageProps) {
  const { id } = await params;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Booking Details</h1>
        <span className="text-sm font-mono text-muted-foreground">ID: {id}</span>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Booking information, participant profiles, booking activity & status timeline, and payment/payout context.
        </p>
      </div>
    </div>
  );
}
