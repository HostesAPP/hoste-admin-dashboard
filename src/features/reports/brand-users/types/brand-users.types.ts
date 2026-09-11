export type BrandAccountStatus =
  | "Active"
  | "Pending"
  | "Inactive"
  | "Suspended";

export interface BrandReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export type BrandGrowthTab = "Total Brands" | "New Brands" | "Active Brands" | "Inactive";

export interface BrandGrowthPoint {
  date: string;
  label: string;
  totalCumulative: number;
  activeBooking: number;
}

export interface BrandAccountStatusItem {
  status: BrandAccountStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
  colorClass: string;
  description: string;
}

export interface BrandBookingPerformanceData {
  totalBookings: number;
  confirmed: number;
  completed: number;
  cancelled: number;
  avgBookingsPerBrand: string;
  changeVsPrev30d: string;
  trendPoints: { day: string; val: number }[];
}

export interface BrandSpendingBreakdownData {
  totalSpending: string;
  platformRevenue: string;
  breakdown: {
    type: string;
    bookingsCount: number;
    amount: string;
    percentage: number;
  }[];
}

export interface TopPerformingBrandItem {
  rank: number;
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarColor: string;
  totalBookings: string;
  completed: string;
  totalSpending: string;
  avgBookingValue: string;
  lastActivity: string;
  status: string;
}

export interface BrandDirectoryItem {
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarColor: string;
  totalBookings: number;
  completed: number;
  cancelled: number;
  totalSpend: string;
  avgBookingValue: string;
  status: BrandAccountStatus;
  joinedDate: string;
}

export interface BrandReportFilterParams {
  status: string;
  booking: string;
  type: string;
  spend: string;
  brand: string;
  search: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
