// features/dashboard/dashboard.types.ts

export type DashboardTimeframe = "Daily" | "Weekly" | "Monthly";

export interface DashboardMetricCard {
  label: string;
  value: string;
  changeText: string;
  changePositive: boolean;
  subtext: string;
}

export interface DashboardKpiData {
  totalUsers: DashboardMetricCard;
  totalHostes: DashboardMetricCard;
  totalBookings: DashboardMetricCard;
  platformRevenue: DashboardMetricCard;
}

export interface RevenueChartPoint {
  date: string;
  revenue: number;
  formattedRev: string;
}

export interface BookingPipelineBreakdown {
  confirmed: { count: number; percentage: number };
  completed: { count: number; percentage: number };
  ongoing: { count: number; percentage: number };
  pendingReview: { count: number; percentage: number };
  cancelled: { count: number; percentage: number };
  totalBookings: number;
}

export interface ActionRequiredItem {
  id: string;
  count: number;
  title: string;
  description: string;
  actionText: string;
  actionHref: string;
  badgeVariant: "primary" | "dark";
}

export type RecentBookingStatus = "Confirmed" | "Pending" | "Completed" | "Cancelled";

export interface DashboardRecentBooking {
  id: string;
  bookingCode: string;
  customerName: string;
  hosteName: string;
  eventDate: string;
  amount: string;
  status: RecentBookingStatus;
}

export interface DashboardRecentActivityItem {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "approval" | "booking" | "payment" | "suspension";
}

export interface DashboardOverviewData {
  kpis: DashboardKpiData;
  revenueOverview: {
    totalRevenue: string;
    growthText: string;
    chartData: Record<DashboardTimeframe, RevenueChartPoint[]>;
  };
  bookingPipeline: BookingPipelineBreakdown;
  actionsRequired: ActionRequiredItem[];
  recentBookings: DashboardRecentBooking[];
  recentActivities: DashboardRecentActivityItem[];
}
