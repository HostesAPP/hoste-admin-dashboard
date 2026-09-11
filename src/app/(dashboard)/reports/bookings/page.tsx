import type { Metadata } from "next";
import { BookingsReportView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Bookings Report | Hosté Admin Dashboard",
  description:
    "Monitor booking activity, trends, user category volume, and performance across the Hosté platform.",
};

export default function BookingsReportPage() {
  return <BookingsReportView />;
}
