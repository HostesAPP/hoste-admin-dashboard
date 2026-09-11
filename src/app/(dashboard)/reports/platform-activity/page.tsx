import { PlatformActivityReportView } from "@/features/reports/platform-activity";

export const metadata = {
  title: "Platform Activity Report | Hosté Admin",
  description:
    "Monitor platform usage, user engagement, and real-time activity trends across all Hosté modules.",
};

export default function PlatformActivityReportPage() {
  return <PlatformActivityReportView />;
}
