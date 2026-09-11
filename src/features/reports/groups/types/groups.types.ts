export type GroupAccountStatus =
  | "Active"
  | "Pending"
  | "Completed"
  | "Cancelled"
  | "Inactive";

export interface GroupsReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  subtext?: string;
  isPositive: boolean;
  highlight?: boolean;
}

export type GroupGrowthTab =
  | "Total Groups"
  | "New Groups"
  | "Active Groups"
  | "Inactive Groups";

export interface GroupGrowthPoint {
  date: string;
  label: string;
  newGroupsCreated: number;
  activeBookingGroups: number;
}

export interface GroupMembershipDistributionItem {
  range: string;
  percentage: number;
  count: number;
  barColor: string;
}

export interface GroupMembershipOverviewData {
  totalMembers: number;
  avgMembersPerGroup: string;
  smallestGroup: string;
  largestGroup: string;
  distribution: GroupMembershipDistributionItem[];
}

export interface GroupBookingAndRevenueData {
  totalGroupRevenue: string;
  revenueGrowth: string;
  avgRevenuePerGroup: string;
  avgBookingValue: string;
  totalBookings: number;
  confirmedBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  avgBookingsPerGroup: string;
}

export interface GroupStatusItem {
  status: GroupAccountStatus;
  label: string;
  count: number;
  percentage: number;
  color: string;
}

export interface TopPerformingGroupItem {
  rank: number;
  id: string;
  groupName: string;
  leader: string;
  members: number;
  bookings: number;
  revenue: string;
}

export interface GroupDirectoryItem {
  id: string;
  groupName: string;
  groupLeader: string;
  members: number;
  bookingsFormatted: string;
  revenue: string;
  status: GroupAccountStatus;
  createdDate: string;
  lastActivity: string;
  description?: string;
  category?: string;
}

export interface GroupsReportFilterParams {
  status: string;
  bookings: string;
  size: string;
  searchLeader: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
