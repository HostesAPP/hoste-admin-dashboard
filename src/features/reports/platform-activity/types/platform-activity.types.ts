export type ActivityTimeRange = "Today" | "7 Days" | "30 Days" | "This Month" | "Custom";

export type PlatformActivityMetricTab = "Active Users" | "New Users" | "Bookings" | "Transactions";

export type ActivityLogStatus = "Success" | "Completed" | "Active" | "Pending" | "In Review" | "Cancelled";

export type PlatformUserRole = "All Types" | "Customer" | "Hosté (Host)" | "Event Planner" | "Brand User";

export type PlatformModuleArea = "All Areas" | "Bookings" | "Payments" | "Profiles" | "Groups" | "Support";

export interface PlatformActivityKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  isHighlighted?: boolean;
  valueColor?: "primary" | "secondary";
}

export interface PlatformActivityChartPoint {
  date: string;
  label: string;
  currentPeriod: number;
  previousPeriod: number;
  formattedCurrent: string;
  formattedPrevious: string;
}

export interface UserActivityBreakdownItem {
  id: string;
  roleName: string;
  totalUsers: number;
  newUsers: number;
  activeUsers: number;
  activePercentage: number;
  barColor: "green" | "orange";
}

export interface EngagementTrendPoint {
  day: string;
  value: number;
}

export interface BookingVelocityPoint {
  period: string;
  velocity: number;
}

export interface PlatformAreaActivityItem {
  id: string;
  areaName: string;
  percentage: number;
  volumeFormatted: string;
  colorClass: string;
}

export interface PlatformActivityLogItem {
  id: string;
  activityDescription: string;
  user: string;
  userType: "Customer" | "Hosté (Host)" | "Event Planner" | "Brand User";
  activityType: string;
  dateTime: string;
  status: ActivityLogStatus;
  area: "Bookings" | "Payments" | "Profiles" | "Groups" | "Support";
  details?: {
    ipAddress?: string;
    device?: string;
    referenceId?: string;
    notes?: string;
    amount?: string;
  };
}

export interface PlatformActivityFilterParams {
  timeRange: ActivityTimeRange;
  metricTab: PlatformActivityMetricTab;
  userType: string;
  activityType: string;
  status: string;
  area: string;
  searchQuery: string;
}
