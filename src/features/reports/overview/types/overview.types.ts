export interface OverviewKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export type PerformanceMetricTab = "Revenue" | "Bookings" | "New Users" | "Active Users";

export interface PlatformPerformancePoint {
  date: string;
  label: string;
  currentPeriod: number;
  previousPeriod: number;
  formattedCurrent: string;
  formattedPrevious: string;
}

export interface UserDistributionItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
  colorClass: string;
}

export interface ReportCategoryCardItem {
  id: string;
  title: string;
  iconName: string;
  iconBg: string;
  iconColor: string;
  bulletPoints: string[];
  href: string;
}

export type RecentReportStatus = "Ready" | "Processing";

export interface RecentReportItem {
  id: string;
  name: string;
  category: string;
  categoryColor: string;
  generatedBy: string;
  date: string;
  status: RecentReportStatus;
  fileType: "pdf" | "csv" | "xlsx";
}
