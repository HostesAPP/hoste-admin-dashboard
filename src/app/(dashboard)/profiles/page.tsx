import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profiles | Hosté Admin Dashboard",
  description: "Manage host, brand, and event planner profiles and pending activations.",
};

export default function ProfilesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold tracking-tight">Profiles</h1>
      </div>
      <div className="rounded-xl border bg-card p-6 shadow-sm">
        <p className="text-sm text-muted-foreground">
          Profile management & activation queue for Hosts, Brands, and Event Planners.
        </p>
      </div>
    </div>
  );
}
