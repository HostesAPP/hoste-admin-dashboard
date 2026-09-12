import type {
  OverviewKpiMetric,
  PlatformPerformancePoint,
  UserDistributionItem,
  ReportCategoryCardItem,
  RecentReportItem,
} from "../types/overview.types";

export const OVERVIEW_KPI_METRICS: OverviewKpiMetric[] = [
  {
    id: "total-revenue",
    label: "TOTAL REVENUE",
    value: "₦284,500",
    change: "+14.2%",
    isPositive: true,
  },
  {
    id: "total-bookings",
    label: "TOTAL BOOKINGS",
    value: "1,420",
    change: "+8.5%",
    isPositive: true,
  },
  {
    id: "active-hostes",
    label: "ACTIVE HOSTÉS",
    value: "312",
    change: "+5.1%",
    isPositive: true,
  },
  {
    id: "brand-users",
    label: "BRAND USERS",
    value: "84",
    change: "+12.0%",
    isPositive: true,
  },
  {
    id: "active-customers",
    label: "ACTIVE CUSTOMERS",
    value: "8,940",
    change: "+18.4%",
    isPositive: true,
  },
  {
    id: "event-planners",
    label: "EVENT PLANNERS",
    value: "146",
    change: "-1.2%",
    isPositive: false,
  },
];

export const PLATFORM_PERFORMANCE_DATA: PlatformPerformancePoint[] = [
  {
    date: "2026-07-25",
    label: "Jul 25",
    currentPeriod: 22000,
    previousPeriod: 18000,
    formattedCurrent: "$22,000",
    formattedPrevious: "$18,000",
  },
  {
    date: "2026-08-01",
    label: "Aug 01",
    currentPeriod: 46000,
    previousPeriod: 32000,
    formattedCurrent: "$46,000",
    formattedPrevious: "$32,000",
  },
  {
    date: "2026-08-08",
    label: "Aug 08",
    currentPeriod: 52000,
    previousPeriod: 44000,
    formattedCurrent: "$52,000",
    formattedPrevious: "$44,000",
  },
  {
    date: "2026-08-12",
    label: "Aug 15",
    currentPeriod: 64280,
    previousPeriod: 28000,
    formattedCurrent: "64,280.00",
    formattedPrevious: "$28,000",
  },
  {
    date: "2026-08-22",
    label: "Aug 22",
    currentPeriod: 88000,
    previousPeriod: 62000,
    formattedCurrent: "$88,000",
    formattedPrevious: "$62,000",
  },
  {
    date: "2026-08-23",
    label: "Today",
    currentPeriod: 81000,
    previousPeriod: 54000,
    formattedCurrent: "$81,000",
    formattedPrevious: "$54,000",
  },
];

export const USER_DISTRIBUTION_DATA: UserDistributionItem[] = [
  {
    name: "Customers",
    count: 8940,
    percentage: 88,
    color: "#EF5A22", // Hosté Orange / Primary
    colorClass: "bg-primary",
  },
  {
    name: "Hostés",
    count: 312,
    percentage: 6,
    color: "#006837", // Hosté Green / Secondary
    colorClass: "bg-secondary",
  },
  {
    name: "Event Planners",
    count: 146,
    percentage: 4,
    color: "#F59E0B", // Amber / Yellow
    colorClass: "bg-amber-500",
  },
  {
    name: "Brand Users",
    count: 84,
    percentage: 2,
    color: "#1A1A1A", // Dark / Slate
    colorClass: "bg-[#1A1A1A]",
  },
];

export const REPORT_CATEGORY_CARDS: ReportCategoryCardItem[] = [
  {
    id: "revenue-payments",
    title: "Revenue & Payments",
    iconName: "Plus",
    iconBg: "bg-primary/10 text-primary border-primary/20",
    iconColor: "text-primary",
    bulletPoints: [
      "Platform revenue & commissions",
      "Payouts & transaction logs",
      "Payment activity summary",
    ],
    href: "/reports/revenue-payments",
  },
  {
    id: "bookings",
    title: "Bookings",
    iconName: "Calendar",
    iconBg: "bg-secondary/10 text-secondary border-secondary/20",
    iconColor: "text-secondary",
    bulletPoints: [
      "Total booking volume & status",
      "Cancellation & refund rates",
      "Seasonal booking trends",
    ],
    href: "/reports/bookings",
  },
  {
    id: "hostes",
    title: "Hostés",
    iconName: "Sparkles",
    iconBg: "bg-sky-500/10 text-sky-600 border-sky-500/20",
    iconColor: "text-sky-600",
    bulletPoints: [
      "Hosté onboarding & growth",
      "Verification status logs",
      "Hosté performance ratings",
    ],
    href: "/reports/hostes",
  },
  {
    id: "brand-users",
    title: "Brand Users",
    iconName: "Building2",
    iconBg: "bg-purple-500/10 text-purple-600 border-purple-500/20",
    iconColor: "text-purple-600",
    bulletPoints: [
      "Corporate brand engagement",
      "Brand bookings & spending",
      "Preferred partner metrics",
    ],
    href: "/reports/brand-users",
  },
  {
    id: "event-planners",
    title: "Event Planners",
    iconName: "Briefcase",
    iconBg: "bg-amber-500/10 text-amber-600 border-amber-500/20",
    iconColor: "text-amber-600",
    bulletPoints: [
      "Planner activity & events",
      "High-volume bookings",
      "Performance analytics",
    ],
    href: "/reports/event-planners",
  },
  {
    id: "customers",
    title: "Customers",
    iconName: "Users",
    iconBg: "bg-emerald-500/10 text-emerald-600 border-emerald-500/20",
    iconColor: "text-emerald-600",
    bulletPoints: [
      "User acquisition & retention",
      "Repeat booking behavior",
      "Customer lifetime value",
    ],
    href: "/reports/customers",
  },
  {
    id: "groups",
    title: "Groups",
    iconName: "Users2",
    iconBg: "bg-orange-500/10 text-orange-600 border-orange-500/20",
    iconColor: "text-orange-600",
    bulletPoints: [
      "Group creation & size",
      "Group member retention",
      "Group booking activity",
    ],
    href: "/reports/groups",
  },
  {
    id: "platform-activity",
    title: "Platform Activity",
    iconName: "Activity",
    iconBg: "bg-blue-500/10 text-blue-600 border-blue-500/20",
    iconColor: "text-blue-600",
    bulletPoints: [
      "Overall platform usage",
      "Active session metrics",
      "User engagement trends",
    ],
    href: "/reports/platform-activity",
  },
];

export const RECENT_REPORTS_DATA: RecentReportItem[] = [
  {
    id: "rep-1",
    name: "Monthly_Revenue_Summary_Aug2026.pdf",
    category: "Revenue & Payments",
    categoryColor: "bg-amber-500/10 text-amber-700 border-amber-500/30 dark:text-amber-400",
    generatedBy: "Naomi (Super Admin)",
    date: "Aug 22, 2026",
    status: "Ready",
    fileType: "pdf",
  },
  {
    id: "rep-2",
    name: "Hoste_Performance_Q3_Draft.csv",
    category: "Hostés",
    categoryColor: "bg-sky-500/10 text-sky-700 border-sky-500/30 dark:text-sky-400",
    generatedBy: "Kofi Asante (Admin)",
    date: "Aug 20, 2026",
    status: "Ready",
    fileType: "csv",
  },
  {
    id: "rep-3",
    name: "Customer_Acquisition_Trends.pdf",
    category: "Customers",
    categoryColor: "bg-emerald-500/10 text-emerald-700 border-emerald-500/30 dark:text-emerald-400",
    generatedBy: "System Auto-Gen",
    date: "Aug 18, 2026",
    status: "Processing",
    fileType: "pdf",
  },
  {
    id: "rep-4",
    name: "Brand_Booking_Activity_Jul2026.xlsx",
    category: "Brand Users",
    categoryColor: "bg-purple-500/10 text-purple-700 border-purple-500/30 dark:text-purple-400",
    generatedBy: "Naomi (Super Admin)",
    date: "Aug 01, 2026",
    status: "Ready",
    fileType: "xlsx",
  },
];
