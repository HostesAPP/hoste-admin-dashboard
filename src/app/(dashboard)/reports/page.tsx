import type { Metadata } from "next";
import { ReportsOverviewView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Reports | Hosté Admin Dashboard",
  description:
    "Monitor platform performance, business activity, category reports, and transaction logs across Hosté.",
};

export default function ReportsPage() {
  return <ReportsOverviewView />;
}
