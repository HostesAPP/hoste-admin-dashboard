import type { Metadata } from "next";
import { RevenueOverviewView } from "@/features/revenue";

export const metadata: Metadata = {
  title: "Revenue Overview | Hosté Admin Console",
  description: "Track platform revenue, trends, transaction performance, and financial insights.",
};

export default function RevenuePage() {
  return <RevenueOverviewView />;
}
