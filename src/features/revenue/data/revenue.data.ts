// features/revenue/data/revenue.data.ts

import { RevenueOverviewData } from "../revenue.types";

export const MOCK_REVENUE_OVERVIEW_DATA: RevenueOverviewData = {
  kpis: {
    totalRevenue: {
      label: "Total Revenue",
      value: "₦4,850,000",
      subtext: "Hosté defined platform revenue",
    },
    revenueThisMonth: {
      label: "Revenue This Month",
      value: "₦4,850,000",
    },
    revenueLastMonth: {
      label: "Revenue Last Month",
      value: "₦4,185,000",
    },
    revenueGrowth: {
      label: "Revenue Growth",
      value: "+15.8%",
      isHighlight: true,
    },
  },

  performance: {
    totalRevenue: "₦4,850,000",
    growthText: "+15.8%",
    chartData: {
      Weekly: [
        { date: "Aug 01", revenue: 1200000, formattedRev: "₦1,200,000" },
        { date: "Aug 05", revenue: 1600000, formattedRev: "₦1,600,000" },
        { date: "Aug 10", revenue: 2700000, formattedRev: "₦2,700,000" },
        { date: "Aug 15", revenue: 2200000, formattedRev: "₦2,200,000" },
        { date: "Aug 18", revenue: 4200000, formattedRev: "₦4,200,000", isPeak: true },
        { date: "Aug 20", revenue: 800000, formattedRev: "₦800,000" },
        { date: "Aug 21", revenue: 3100000, formattedRev: "₦3,100,000" },
      ],
      Monthly: [
        { date: "Week 1", revenue: 1200000, formattedRev: "₦1.2M" },
        { date: "Week 2", revenue: 2400000, formattedRev: "₦2.4M" },
        { date: "Week 3", revenue: 3600000, formattedRev: "₦3.6M" },
        { date: "Week 4", revenue: 4850000, formattedRev: "₦4.85M", isPeak: true },
      ],
      Daily: [
        { date: "Mon", revenue: 420000, formattedRev: "₦420K" },
        { date: "Tue", revenue: 680000, formattedRev: "₦680K" },
        { date: "Wed", revenue: 750000, formattedRev: "₦750K" },
        { date: "Thu", revenue: 920000, formattedRev: "₦920K" },
        { date: "Fri", revenue: 1100000, formattedRev: "₦1.1M" },
        { date: "Sat", revenue: 1420000, formattedRev: "₦1.42M", isPeak: true },
        { date: "Sun", revenue: 880000, formattedRev: "₦880K" },
      ],
    },
  },

  sources: [
    {
      id: "src-1",
      name: "One-Time Bookings",
      amount: "₦1,850,000",
      numericAmount: 1850000,
      colorClass: "bg-primary",
      percentage: 38,
    },
    {
      id: "src-2",
      name: "Full-Time Bookings",
      amount: "₦1,600,000",
      numericAmount: 1600000,
      colorClass: "bg-secondary",
      percentage: 33,
    },
    {
      id: "src-3",
      name: "Contract Bookings",
      amount: "₦1,200,000",
      numericAmount: 1200000,
      colorClass: "bg-foreground/80",
      percentage: 25,
    },
    {
      id: "src-4",
      name: "Other Platform Fees",
      amount: "₦200,000",
      numericAmount: 200000,
      colorClass: "bg-foreground",
      percentage: 4,
    },
  ],

  transactions: [
    {
      id: "tx-1",
      transactionCode: "TXN-10482",
      bookingCode: "BK-10482",
      customerName: "ABC Events",
      bookingValue: "₦250,000",
      hosteRevenue: "₦50,000",
      status: "Paid",
      date: "Aug 21, 2026",
    },
    {
      id: "tx-2",
      transactionCode: "TXN-10481",
      bookingCode: "BK-10481",
      customerName: "Kovak Logistics",
      bookingValue: "₦180,000",
      hosteRevenue: "₦36,000",
      status: "Paid",
      date: "Aug 21, 2026",
    },
    {
      id: "tx-3",
      transactionCode: "TXN-10480",
      bookingCode: "BK-10480",
      customerName: "Zenith Workspaces",
      bookingValue: "₦420,000",
      hosteRevenue: "₦84,000",
      status: "Paid",
      date: "Aug 20, 2026",
    },
    {
      id: "tx-4",
      transactionCode: "TXN-10479",
      bookingCode: "BK-10479",
      customerName: "Apex Studios",
      bookingValue: "₦95,000",
      hosteRevenue: "₦19,000",
      status: "Paid",
      date: "Aug 20, 2026",
    },
  ],

  insights: {
    averageRevenuePerBooking: "₦38,860",
    highestRevenueDay: {
      date: "August 18",
      amount: "₦420,000",
    },
    totalCompletedBookings: 714,
    cancelledBookingValue: "₦180,000",
  },
};

export const MOCK_REVENUE_TRANSACTION_DETAILS: import("../revenue.types").RevenueTransactionDetails = {
  transactionId: "TRX-2025-00847",
  bookingId: "BK-NG-LAG-78243",
  paymentReference: "PAY-7m5d2a9h4",
  transactionDateTime: "19-Jan-2026, 14:35 WAT",
  paymentStatus: "Completed",
  currency: "₦ Nigerian Naira (NGN)",
  paymentJourney: [
    {
      id: "pj-1",
      title: "Booking Created",
      timestamp: "19 Jan 2026, 10:52 WAT",
      details: "System",
      completed: true,
    },
    {
      id: "pj-2",
      title: "Payment Received",
      timestamp: "19 Jan 2026, 12:52 WAT",
      details: "₦185,000 via Bank Transfer",
      completed: true,
    },
    {
      id: "pj-3",
      title: "Funds Held in Escrow",
      timestamp: "19 Jan 2026, 12:54 WAT",
      details: "Funds secured pending event completion",
      completed: true,
    },
    {
      id: "pj-4",
      title: "Event Completed",
      timestamp: "25 Feb 2026, 20:00 WAT",
      details: "Confirmed by Brand",
      completed: true,
    },
    {
      id: "pj-5",
      title: "Hoste Paid",
      timestamp: "26 Feb 2026, 06:00 WAT",
      details: "₦159,000 disbursed to Chioma Okafor",
      completed: true,
    },
    {
      id: "pj-6",
      title: "Transaction Closed",
      timestamp: "26 Feb 2026, 06:01 WAT",
      details: "Net Revenue of ₦18,500 credited to HOSTE",
      completed: true,
    },
  ],
  bookingInfo: {
    brandName: "Luxury Event Ltd.",
    hosteName: "Amara Okafor",
    bookingType: "Full-Time",
    eventName: "Child Dedication",
    eventDate: "25, February 2026",
    eventLocation: "Eko Hotels & Suites, Victoria Island. Lagos.",
  },
  financialBreakdown: {
    grossAmount: "₦185,000.00",
    platformCommission: "-₦22,200.00",
    processingFee: "-₦3,700.00",
    hostePayout: "₦159,900.00",
    netRevenue: "₦18,500.00",
  },
};

