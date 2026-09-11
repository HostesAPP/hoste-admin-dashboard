export type CustomerAccountStatus =
  | "Active"
  | "Pending"
  | "Inactive"
  | "Suspended";

export interface CustomerReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  subtext?: string;
  isPositive: boolean;
  highlight?: boolean;
}

export type CustomerGrowthTab =
  | "Total Customers"
  | "New Customers"
  | "Active Customers"
  | "Inactive Customers";

export interface CustomerGrowthPoint {
  date: string;
  label: string;
  totalCumulative: number;
  activeCustomers: number;
  newRegistrations?: number;
}

export interface CustomerAccountStatusBreakdownItem {
  status: CustomerAccountStatus;
  count: string;
  percentage: number;
  pillClass: string;
}

export interface CustomerBookingPerformanceData {
  confirmedBookings: number;
  confirmedPercentage: number;
  cancelledBookings: string;
  completedBookings: number;
  completedPercentage: number;
  avgBookingsPerUser: number;
  avgBookingsPercentage: number;
  weeklyTrends: {
    week: string;
    totalBookings: number;
    completedBookings: number;
  }[];
}

export interface CustomerSpendingOverviewData {
  avgSpendPerCustomer: string;
  avgBookingValue: string;
  spendingBreakdown: {
    type: string;
    percentage: number;
    amount: string;
    dotColor: string;
  }[];
  accountStatusBreakdown: CustomerAccountStatusBreakdownItem[];
}

export interface TopCustomerItem {
  rank: number;
  id: string;
  name: string;
  location: string;
  customerType: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  totalSpending: string;
  bookings: number;
  completedBookings: number;
  avgValue: string;
  lastActivity: string;
  isHighlighted?: boolean;
}

export interface CustomerDirectoryItem {
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  bookings: number;
  completed: number;
  cancelled: number;
  totalSpend: string;
  avgBooking: string;
  lastActivity: string;
  status: CustomerAccountStatus;
  joinedDate: string;
  phone?: string;
  city?: string;
  tier?: string;
}

export interface CustomerReportFilterParams {
  status: string;
  booking: string;
  type: string;
  spend: string;
  search: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
