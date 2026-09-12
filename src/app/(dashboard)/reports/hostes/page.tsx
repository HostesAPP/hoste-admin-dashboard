import type { Metadata } from "next";
import { HostesReportView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Hosté Users Report | Hosté Admin Dashboard",
  description:
    "Monitor Hosté growth, activity, verification status, bookings fulfillment, and earnings performance across Hosté.",
};

export default function HostesReportPage() {
  return <HostesReportView />;
}
