import type { Metadata } from "next";
import { CustomersReportView } from "@/features/reports/customers";

export const metadata: Metadata = {
  title: "Customer Report | Hosté Admin",
  description:
    "Monitor customer growth, activity, bookings, and spending across the Hosté platform.",
};

export default function CustomersReportPage() {
  return <CustomersReportView />;
}
