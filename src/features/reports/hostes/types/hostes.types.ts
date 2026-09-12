export type HosteVerificationStatus =
  | "Verified"
  | "Pending"
  | "Unverified"
  | "Suspended";

export type HosteAccountStatus =
  | "Active"
  | "Pending"
  | "Suspended"
  | "Inactive";

export interface HosteReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  isEarningsHighlight?: boolean;
}

export type HosteGrowthTab = "Total Hostés" | "New Hostés" | "Active Hostés" | "Inactive Hostés";

export interface HosteGrowthPoint {
  date: string;
  label: string;
  totalHostes: number;
  activeBaseline: number;
}

export interface HosteVerificationBreakdownItem {
  name: string;
  count: number;
  percentage: number;
  color: string;
  colorClass: string;
}

export interface HosteAccountStatusBlock {
  status: HosteAccountStatus;
  label: string;
  count: number;
  percentage: number;
  badgeClass: string;
}

export interface BookingPerformanceData {
  totalBookings: string;
  confirmedBookings: string;
  completedBookings: string;
  cancelledBookings: string;
  avgBookingsPerHoste: string;
  completionRate: string;
  velocityPoints: { day: string; val: number }[];
}

export interface EarningsOverviewData {
  totalEarnings: string;
  avgEarningsPerHoste: string;
  avgBookingValue: string;
  breakdown: {
    type: string;
    amount: string;
    percentage: number;
    colorClass: string;
  }[];
}

export interface TopPerformingHosteItem {
  rank: number;
  id: string;
  name: string;
  initials: string;
  avatarColor: string;
  totalBookings: number;
  completed: number;
  completionRate: string;
  totalEarnings: string;
  avgRating: number;
  status: string;
}

export interface HosteDirectoryItem {
  id: string;
  name: string;
  email: string;
  verification: HosteVerificationStatus;
  bookings: {
    total: number;
    completed: number;
    cancelled: number;
  };
  completionRate: string;
  totalEarnings: string;
  rating: number;
  lastActive: string;
  accountStatus: HosteAccountStatus;
  joinedDate: string;
}

export interface HostesReportFilterParams {
  verification: string;
  accountStatus: string;
  booking: string;
  type: string;
  rating: string;
  search: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
