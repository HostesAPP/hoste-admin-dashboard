// features/revenue/revenue.types.ts

export type RevenueTimeframe = "Daily" | "Weekly" | "Monthly";

export interface RevenueMetricCard {
  label: string;
  value: string;
  subtext?: string;
  isHighlight?: boolean;
}

export interface RevenueKpis {
  totalRevenue: RevenueMetricCard;
  revenueThisMonth: RevenueMetricCard;
  revenueLastMonth: RevenueMetricCard;
  revenueGrowth: RevenueMetricCard;
}

export interface RevenuePerformancePoint {
  date: string;
  revenue: number;
  formattedRev: string;
  isPeak?: boolean;
}

export interface RevenueSourceItem {
  id: string;
  name: string;
  amount: string;
  numericAmount: number;
  colorClass: string;
  percentage: number;
}

export interface RevenueTransaction {
  id: string;
  transactionCode: string;
  bookingCode: string;
  customerName: string;
  bookingValue: string;
  hosteRevenue: string;
  status: "Paid" | "Pending" | "Refunded";
  date: string;
}

export interface FinancialInsightsData {
  averageRevenuePerBooking: string;
  highestRevenueDay: {
    date: string;
    amount: string;
  };
  totalCompletedBookings: number;
  cancelledBookingValue: string;
}

export interface RevenueOverviewData {
  kpis: RevenueKpis;
  performance: {
    totalRevenue: string;
    growthText: string;
    chartData: Record<RevenueTimeframe, RevenuePerformancePoint[]>;
  };
  sources: RevenueSourceItem[];
  transactions: RevenueTransaction[];
  insights: FinancialInsightsData;
}

export interface PaymentJourneyStep {
  id: string;
  title: string;
  timestamp: string;
  details: string;
  completed: boolean;
}

export interface RevenueBookingInformation {
  brandName: string;
  hosteName: string;
  bookingType: string;
  eventName: string;
  eventDate: string;
  eventLocation: string;
}

export interface RevenueFinancialBreakdown {
  grossAmount: string;
  platformCommission: string;
  processingFee: string;
  hostePayout: string;
  netRevenue: string;
}

export interface RevenueTransactionDetails {
  transactionId: string;
  bookingId: string;
  paymentReference: string;
  transactionDateTime: string;
  paymentStatus: "Completed" | "Pending" | "Refunded";
  currency: string;
  paymentJourney: PaymentJourneyStep[];
  bookingInfo: RevenueBookingInformation;
  financialBreakdown: RevenueFinancialBreakdown;
}

