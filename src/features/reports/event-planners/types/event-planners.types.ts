export type EventPlannerAccountStatus =
  | "Active"
  | "Pending"
  | "Inactive"
  | "Suspended";

export interface EventPlannerReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  subtext?: string;
  isPositive: boolean;
  highlight?: boolean;
}

export type EventPlannerGrowthTab =
  | "Total Event Planners"
  | "New Event Planners"
  | "Active Event Planners"
  | "Inactive Event Planners";

export interface EventPlannerGrowthPoint {
  date: string;
  label: string;
  totalCumulative: number;
  activePlanners: number;
  newRegistrations?: number;
}

export interface AccountStatusBreakdownItem {
  status: EventPlannerAccountStatus;
  count: number;
  percentage: number;
  pillClass: string;
}

export interface BookingPerformanceData {
  confirmed: number;
  confirmedPercentage: number;
  avgEventsPerPlanner: string;
  avgBookingsPerPlanner: string;
  completedEvents: number;
  completedPercentage: number;
  cancelled: number;
  cancelledPercentage: number;
  weeklyTrends: {
    week: string;
    totalBookings: number;
    completedEvents: number;
  }[];
}

export interface SpendingOverviewData {
  avgSpendPerPlanner: string;
  avgBookingValue: string;
  spendingBreakdown: {
    type: string;
    percentage: number;
    amount: string;
    dotColor: string;
  }[];
  accountStatusBreakdown: AccountStatusBreakdownItem[];
}

export interface TopPerformingEventPlannerItem {
  rank: number;
  id: string;
  name: string;
  contactPerson: string;
  location: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  totalSpending: string;
  bookings: number;
  completedBookings: number;
  completionRate: string;
  lastActivity: string;
  isHighlighted?: boolean;
}

export interface EventPlannerDirectoryItem {
  id: string;
  name: string;
  email: string;
  initial: string;
  avatarBg: string;
  avatarColor: string;
  bookings: number;
  events: number;
  cancelled: number;
  completionRate: string;
  totalSpend: string;
  avgBooking: string;
  lastActivity: string;
  status: EventPlannerAccountStatus;
  joinedDate: string;
  phone?: string;
  agencyType?: string;
  city?: string;
}

export interface EventPlannerReportFilterParams {
  status: string;
  booking: string;
  type: string;
  spend: string;
  search: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
