import type { Metadata } from "next";
import { EventPlannersReportView } from "@/features/reports/event-planners";

export const metadata: Metadata = {
  title: "Event Planners Report | Hosté Admin",
  description:
    "Monitor Event Planner growth, activity, bookings, and performance across Hosté venues.",
};

export default function EventPlannersReportPage() {
  return <EventPlannersReportView />;
}
