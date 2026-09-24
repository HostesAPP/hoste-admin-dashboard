// features/dashboard/data/dashboard.data.ts

import { DashboardOverviewData } from "../dashboard.types";

export const MOCK_DASHBOARD_OVERVIEW_DATA: DashboardOverviewData = {
  kpis: {
    totalUsers: {
      label: "Total Users",
      value: "12,482",
      changeText: "+8.4%",
      changePositive: true,
      subtext: "Compared with last month",
    },
    totalHostes: {
      label: "Total Hostés",
      value: "4,286",
      changeText: "+6.2%",
      changePositive: true,
      subtext: "Registered professionals",
    },
    totalBookings: {
      label: "Total Bookings",
      value: "1,248",
      changeText: "+12.5%",
      changePositive: true,
      subtext: "Across the platform",
    },
    platformRevenue: {
      label: "Platform Revenue (Net)",
      value: "₦4,850,000",
      changeText: "+15.8%",
      changePositive: true,
      subtext: "Hosté service fee revenue",
    },
  },

  revenueOverview: {
    totalRevenue: "₦4,850,000",
    growthText: "+15.8% growth vs last month",
    chartData: {
      Monthly: [
        { date: "Aug 1", revenue: 1900000, formattedRev: "₦1.90M" },
        { date: "Aug 6", revenue: 2300000, formattedRev: "₦2.30M" },
        { date: "Aug 11", revenue: 2100000, formattedRev: "₦2.10M" },
        { date: "Aug 16", revenue: 3200000, formattedRev: "₦3.20M" },
        { date: "Aug 21", revenue: 2900000, formattedRev: "₦2.90M" },
        { date: "Aug 26", revenue: 4100000, formattedRev: "₦4.10M" },
        { date: "Aug 31", revenue: 4850000, formattedRev: "₦4.85M" },
      ],
      Weekly: [
        { date: "Week 1", revenue: 1100000, formattedRev: "₦1.10M" },
        { date: "Week 2", revenue: 2400000, formattedRev: "₦2.40M" },
        { date: "Week 3", revenue: 3600000, formattedRev: "₦3.60M" },
        { date: "Week 4", revenue: 4850000, formattedRev: "₦4.85M" },
      ],
      Daily: [
        { date: "Mon", revenue: 540000, formattedRev: "₦540K" },
        { date: "Tue", revenue: 680000, formattedRev: "₦680K" },
        { date: "Wed", revenue: 750000, formattedRev: "₦750K" },
        { date: "Thu", revenue: 890000, formattedRev: "₦890K" },
        { date: "Fri", revenue: 1050000, formattedRev: "₦1.05M" },
        { date: "Sat", revenue: 1200000, formattedRev: "₦1.20M" },
        { date: "Sun", revenue: 950000, formattedRev: "₦950K" },
      ],
    },
  },

  bookingPipeline: {
    confirmed: { count: 598, percentage: 48 },
    completed: { count: 350, percentage: 28 },
    ongoing: { count: 150, percentage: 12 },
    pendingReview: { count: 100, percentage: 8 },
    cancelled: { count: 50, percentage: 4 },
    totalBookings: 1248,
  },

  actionsRequired: [
    {
      id: "pending-profiles",
      count: 18,
      title: "Pending Profile Approvals",
      description: "Hosté profiles waiting for review.",
      actionText: "Review",
      actionHref: "/profiles?status=Pending",
      badgeVariant: "primary",
    },
    {
      id: "pending-bookings",
      count: 12,
      title: "Pending Bookings",
      description: "Require administrative attention.",
      actionText: "View",
      actionHref: "/bookings?status=Pending",
      badgeVariant: "primary",
    },
    {
      id: "open-tickets",
      count: 5,
      title: "Open Support Tickets",
      description: "Customer issues awaiting resolution.",
      actionText: "Resolve",
      actionHref: "/support-tickets?status=Open",
      badgeVariant: "dark",
    },
  ],

  recentBookings: [
    {
      id: "rb-1",
      bookingCode: "#BK-10482",
      customerName: "ABC Events",
      hosteName: "Amaka Okafor",
      eventDate: "Aug 28, 2026",
      amount: "₦250,000",
      status: "Confirmed",
    },
    {
      id: "rb-2",
      bookingCode: "#BK-10481",
      customerName: "XYZ Events",
      hosteName: "Blessing Eze",
      eventDate: "Aug 27, 2026",
      amount: "₦180,000",
      status: "Pending",
    },
    {
      id: "rb-3",
      bookingCode: "#BK-10480",
      customerName: "Prime Events",
      hosteName: "Chika Obi",
      eventDate: "Aug 26, 2026",
      amount: "₦320,000",
      status: "Completed",
    },
    {
      id: "rb-4",
      bookingCode: "#BK-10479",
      customerName: "Lagos Gala Ltd",
      hosteName: "Tunde Adeniyi",
      eventDate: "Aug 25, 2026",
      amount: "₦500,000",
      status: "Confirmed",
    },
    {
      id: "rb-5",
      bookingCode: "#BK-10478",
      customerName: "Silverbird Group",
      hosteName: "Nneka Nwosu",
      eventDate: "Aug 24, 2026",
      amount: "₦150,000",
      status: "Confirmed",
    },
  ],

  recentActivities: [
    {
      id: "act-1",
      title: "Profile Approved",
      description: "Amaka Okafor's Hosté profile was approved.",
      timestamp: "10 mins ago",
      type: "approval",
    },
    {
      id: "act-2",
      title: "Booking Confirmed",
      description: "Booking #BK-10482 was confirmed.",
      timestamp: "32 mins ago",
      type: "booking",
    },
    {
      id: "act-3",
      title: "Payment Received",
      description: "₦250,000 payment received for #BK-10482.",
      timestamp: "1 hour ago",
      type: "payment",
    },
    {
      id: "act-4",
      title: "User Suspended",
      description: "Blessing Eze's account was suspended.",
      timestamp: "2 hours ago",
      type: "suspension",
    },
  ],
};
