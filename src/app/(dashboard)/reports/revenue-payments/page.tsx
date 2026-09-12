import type { Metadata } from "next";
import { ReportsView } from "@/features/reports";

export const metadata: Metadata = {
  title: "Revenue & Payments Report | Hosté Admin Dashboard",
  description:
    "Track revenue, commissions, transactions, and payment activity across the Hosté platform.",
};

export default function RevenuePaymentsReportPage() {
  return <ReportsView />;
}
