export type BookingStatusType =
  | "Confirmed"
  | "Completed"
  | "In Progress"
  | "Pending"
  | "Cancelled";

export type BookingPaymentStatusType =
  | "Paid"
  | "Partial"
  | "Unpaid"
  | "Refunded";

export interface BookingReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  colorType?: "default" | "warning";
}

export type BookingVolumeTab = "Total Volume" | "Confirmed" | "Completed" | "Cancelled";

export interface BookingVolumeTrendPoint {
  date: string;
  label: string;
  totalVolume: number;
  completedBookings: number;
  confirmedBookings: number;
  cancelledBookings: number;
}

export interface BookingStatusBreakdownItem {
  status: BookingStatusType;
  label: string;
  count: number;
  percentage: number;
  colorClass: string;
  barColor: string;
}

export interface BookingTypePerformanceItem {
  type: string;
  bookingCount: string;
  revenue: string;
  completionRate: string;
}

export interface BookingUserCategoryItem {
  id: string;
  category: string;
  countWithPercent: string;
  totalRevenue: string;
}

export interface BookingReportItem {
  id: string;
  bookingId: string;
  customerName: string;
  customerType: string;
  hosteName: string;
  hosteRole: string;
  bookingType: string;
  eventDate: string;
  amount: string;
  numericAmount: number;
  bookingStatus: BookingStatusType;
  paymentStatus: BookingPaymentStatusType;
  createdDate: string;
}

export interface BookingReportFilterParams {
  search: string;
  status: string;
  bookingType: string;
  userType: string;
  paymentStatus: string;
  hoste: string;
  dateRange: string;
  page: number;
  pageSize: number;
}
