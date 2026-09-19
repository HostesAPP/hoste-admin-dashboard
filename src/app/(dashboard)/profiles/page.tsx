import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Profiles | Hosté Admin Dashboard",
  description: "Manage host, brand, and event planner profiles and pending activations.",
};

// TODO: pending product confirmation — see UI/UX patch §4/§5 regarding whether Verification and Engagements are nested tabs inside Profiles or standalone routes
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
