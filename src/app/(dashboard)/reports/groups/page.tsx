import type { Metadata } from "next";
import { GroupsReportView } from "@/features/reports/groups";

export const metadata: Metadata = {
  title: "Groups Report | Hosté Admin",
  description:
    "Monitor group activity, membership, bookings, and performance across the platform.",
};

export default function GroupsReportPage() {
  return <GroupsReportView />;
}
