import type { Metadata } from "next";
import { DashboardOverviewView } from "@/features/dashboard";

export const metadata: Metadata = {
  title: "Dashboard Overview | Hosté Admin Console",
  description: "Marketplace key metrics, revenue overview, booking pipeline, and recent activities.",
};

export default function DashboardOverviewPage() {
  return <DashboardOverviewView />;
}
