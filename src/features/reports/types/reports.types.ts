export type TransactionStatus = "Successful" | "Pending" | "Refunded" | "Failed";

export type BookingType = "One-Time Event" | "Full-Time Placement" | "Contract Retainer";

export type UserType = "Brand User" | "Customer" | "Event Planner" | "Hosté";

export type PaymentMethod =
  | "Card (Paystack)"
  | "Bank Transfer"
  | "Bank Transfer *"
  | "USSD Payment"
  | "Card (Mastercard)"
  | "Card (Visa)";

export interface ReportKpiMetric {
  id: string;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
}

export interface RevenueChartDataPoint {
  date: string;
  label: string;
  grossRevenue: number;
  commission: number;
  hosteEarnings: number;
  formattedRev: string;
  formattedComm: string;
}

export interface PaymentStatusItem {
  status: TransactionStatus;
  label: string;
  amount: string;
  count: number;
  percentage: number;
  colorClass: string;
}

export interface BookingTypeRevenueItem {
  type: string;
  amount: string;
  txnsCount: number;
}

export interface ReportTransaction {
  id: string;
  txnId: string;
  customerName: string;
  customerType: string;
  bookingId: string;
  bookingType: string;
  amount: string;
  numericAmount: number;
  commission: string;
  commissionPercentage?: string;
  isReversed?: boolean;
  paymentMethod: string;
  status: TransactionStatus;
  date: string;
}

export interface ReportFilterParams {
  search: string;
  status: string;
  bookingType: string;
  userType: string;
  paymentMethod: string;
  dateRange: string;
  page: number;
  pageSize: number;
}

export type ChartMetricView = "total" | "commission" | "earnings";
