// features/dashboard/api/dashboard.api.ts

import { apiClient } from "@/lib/api-client";
import { formatDate } from "@/lib/utils";
import type {
  ActionRequiredItem,
  BackendDashboardTimeframe,
  BookingPipelineBreakdown,
  DashboardKpiData,
  DashboardMetricCard,
  DashboardOverviewData,
  DashboardRecentActivityItem,
  DashboardRecentBooking,
  DashboardTimeframe,
  RecentBookingStatus,
  RevenueChartPoint,
  RevenueOverviewData,
} from "../dashboard.types";

interface BackendKpiMetric {
  value: number | string;
  changePercent: number | null;
}

interface BackendDashboardOverviewData {
  timeframe: BackendDashboardTimeframe;
  kpis: {
    totalUsers: BackendKpiMetric | null;
    totalHostes: BackendKpiMetric | null;
    totalBookings: BackendKpiMetric | null;
    platformRevenue: BackendKpiMetric | null;
  };
  revenueOverview: {
    granularity: "day" | "week" | "month";
    range: {
      dateFrom: string;
      dateTo: string;
    };
    points: Array<{
      bucket: string;
      total: string;
    }>;
  } | null;
  bookingPipeline: {
    confirmed: number;
    completed: number;
    ongoing: number;
    pending: number;
    cancelled: number;
    disputed: number;
  } | null;
  actionsRequired: {
    pendingKycProfiles: number;
    pendingVerificationBadges: number | null;
    highPriorityTickets: number | null;
    pendingRefunds: number | null;
  };
  recentBookings: Array<{
    id: string;
    referenceId: string;
    title: string;
    status: string;
    clientName: string;
    hostName: string | null;
    hostCount: number;
    totalAmount: string;
    startDate: string;
    createdAt: string;
  }>;
  recentActivity: Array<{
    id: string;
    action: string;
    entityType: string;
    entityId: string;
    description: string;
    ipAddress: string | null;
    createdAt: string;
    staff: {
      userId: string;
      email: string | null;
      name: string | null;
      role: string | null;
    };
  }>;
}

function formatNaira(amount: number | string): string {
  const num = typeof amount === "string" ? Number(amount) : amount;
  if (!Number.isFinite(num)) return "₦0";
  return `₦${num.toLocaleString("en-NG", { maximumFractionDigits: 0 })}`;
}

function formatChangeText(changePercent: number | null): {
  text: string;
  positive: boolean;
} {
  if (changePercent === null || changePercent === undefined) {
    return { text: "—", positive: true };
  }
  const rounded = Number(changePercent.toFixed(1));
  return {
    text: `${rounded >= 0 ? "+" : ""}${rounded}%`,
    positive: rounded >= 0,
  };
}

function formatRelativeTime(dateStr: string): string {
  const date = new Date(dateStr);
  if (isNaN(date.getTime())) return "Recently";
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  if (diffMins < 1) return "Just now";
  if (diffMins < 60) return `${diffMins}m ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours}h ago`;
  const diffDays = Math.floor(diffHours / 24);
  if (diffDays < 30) return `${diffDays}d ago`;
  return formatDate(date);
}

function formatBucketLabel(bucket: string, granularity: "day" | "week" | "month"): string {
  const parsed = new Date(bucket);
  if (isNaN(parsed.getTime())) return bucket;

  if (granularity === "month") {
    return parsed.toLocaleDateString("en-US", { month: "short", year: "2-digit" });
  }
  return parsed.toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function mapActionTitle(action: string): string {
  return action
    .split("_")
    .filter(Boolean)
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
    .join(" ");
}

function mapActivityType(action: string): DashboardRecentActivityItem["type"] {
  const upper = action.toUpperCase();
  if (upper.includes("SUSPEND") || upper.includes("REJECT") || upper.includes("DEACTIVATE")) {
    return "suspension";
  }
  if (upper.includes("PAY") || upper.includes("REFUND") || upper.includes("DISBURSE")) {
    return "payment";
  }
  if (upper.includes("BOOKING") || upper.includes("ENGAGEMENT")) {
    return "booking";
  }
  return "approval";
}

function mapBookingStatus(status: string): RecentBookingStatus {
  const upper = status.toUpperCase();
  if (upper === "ACCEPTED" || upper === "CONFIRMED") return "Confirmed";
  if (upper === "COMPLETED") return "Completed";
  if (upper === "CANCELLED" || upper === "DECLINED") return "Cancelled";
  return "Pending";
}

function buildKpiCard(
  label: string,
  metric: BackendKpiMetric | null,
  subtext: string,
  isCurrency = false
): DashboardMetricCard | null {
  if (!metric) return null;
  const { text, positive } = formatChangeText(metric.changePercent);
  const formattedValue = isCurrency
    ? formatNaira(metric.value)
    : Number(metric.value).toLocaleString();

  return {
    label,
    value: formattedValue,
    changeText: text,
    changePositive: positive,
    subtext,
  };
}

function normalizeDashboardOverview(
  raw: BackendDashboardOverviewData,
  requestedTimeframe: DashboardTimeframe
): DashboardOverviewData {
  const kpis: DashboardKpiData = {
    totalUsers: buildKpiCard(
      "Total Users",
      raw.kpis?.totalUsers ?? null,
      "Registered platform accounts"
    ),
    totalHostes: buildKpiCard(
      "Total Hostés",
      raw.kpis?.totalHostes ?? null,
      "Active Host profiles"
    ),
    totalBookings: buildKpiCard(
      "Total Bookings",
      raw.kpis?.totalBookings ?? null,
      "Month-over-month booking growth"
    ),
    platformRevenue: buildKpiCard(
      "Platform Revenue",
      raw.kpis?.platformRevenue ?? null,
      "Month-to-date gross revenue",
      true
    ),
  };

  let revenueOverview: RevenueOverviewData | null = null;
  if (raw.revenueOverview) {
    const granularity = raw.revenueOverview.granularity;
    const chartData: RevenueChartPoint[] = (raw.revenueOverview.points || []).map(
      (pt) => {
        const num = Number(pt.total) || 0;
        return {
          date: formatBucketLabel(pt.bucket, granularity),
          revenue: num,
          formattedRev: formatNaira(num),
        };
      }
    );

    const periodSum = chartData.reduce((sum, pt) => sum + pt.revenue, 0);
    const totalRevFormatted =
      raw.kpis?.platformRevenue?.value !== undefined
        ? formatNaira(raw.kpis.platformRevenue.value)
        : formatNaira(periodSum);

    const growth = formatChangeText(raw.kpis?.platformRevenue?.changePercent ?? null);

    revenueOverview = {
      totalRevenue: totalRevFormatted,
      growthText:
        growth.text !== "—" ? `${growth.text} vs last month` : "Current period",
      chartData,
    };
  }

  let bookingPipeline: BookingPipelineBreakdown | null = null;
  if (raw.bookingPipeline) {
    const p = raw.bookingPipeline;
    const total =
      (p.confirmed || 0) +
      (p.completed || 0) +
      (p.ongoing || 0) +
      (p.pending || 0) +
      (p.cancelled || 0) +
      (p.disputed || 0);

    const pct = (count: number) =>
      total > 0 ? Math.round((count / total) * 100) : 0;

    bookingPipeline = {
      confirmed: { count: p.confirmed || 0, percentage: pct(p.confirmed || 0) },
      completed: { count: p.completed || 0, percentage: pct(p.completed || 0) },
      ongoing: { count: p.ongoing || 0, percentage: pct(p.ongoing || 0) },
      pendingReview: { count: p.pending || 0, percentage: pct(p.pending || 0) },
      cancelled: { count: p.cancelled || 0, percentage: pct(p.cancelled || 0) },
      totalBookings: total,
    };
  }

  const actionsRequired: ActionRequiredItem[] = [];
  const req = raw.actionsRequired;
  if (req) {
    if (req.pendingKycProfiles > 0) {
      actionsRequired.push({
        id: "pending-kyc",
        count: req.pendingKycProfiles,
        title: "Pending KYC Profiles",
        description: "Host & brand profiles awaiting activation review",
        actionText: "Review",
        actionHref: "/profiles",
        badgeVariant: "primary",
      });
    }
    if (req.pendingVerificationBadges !== null && req.pendingVerificationBadges > 0) {
      actionsRequired.push({
        id: "pending-badges",
        count: req.pendingVerificationBadges,
        title: "Verification Badges",
        description: "Badge applications awaiting verification",
        actionText: "Inspect",
        actionHref: "/verification",
        badgeVariant: "dark",
      });
    }
    if (req.highPriorityTickets !== null && req.highPriorityTickets > 0) {
      actionsRequired.push({
        id: "high-priority-tickets",
        count: req.highPriorityTickets,
        title: "High Priority Tickets",
        description: "Open support tickets requiring immediate response",
        actionText: "Resolve",
        actionHref: "/support",
        badgeVariant: "primary",
      });
    }
    if (req.pendingRefunds !== null && req.pendingRefunds > 0) {
      actionsRequired.push({
        id: "pending-refunds",
        count: req.pendingRefunds,
        title: "Pending Refunds",
        description: "Refund requests awaiting finance processing",
        actionText: "Process",
        actionHref: "/payments",
        badgeVariant: "dark",
      });
    }
  }

  const recentBookings: DashboardRecentBooking[] = (raw.recentBookings || []).map(
    (b) => ({
      id: b.id,
      bookingCode: b.referenceId,
      customerName: b.clientName,
      hosteName:
        b.hostName ||
        (b.hostCount > 0 ? `${b.hostCount} Hosté${b.hostCount > 1 ? "s" : ""}` : "Unassigned"),
      eventDate: formatDate(b.startDate),
      amount: formatNaira(b.totalAmount),
      status: mapBookingStatus(b.status),
    })
  );

  const recentActivities: DashboardRecentActivityItem[] = (raw.recentActivity || []).map(
    (a) => ({
      id: a.id,
      title: mapActionTitle(a.action),
      description: a.description,
      timestamp: formatRelativeTime(a.createdAt),
      type: mapActivityType(a.action),
    })
  );

  return {
    timeframe: requestedTimeframe,
    kpis,
    revenueOverview,
    bookingPipeline,
    actionsRequired,
    recentBookings,
    recentActivities,
  };
}

export async function fetchDashboardOverview(
  timeframe: DashboardTimeframe = "Daily"
): Promise<DashboardOverviewData> {
  const backendTimeframe = timeframe.toUpperCase() as BackendDashboardTimeframe;

  const response = await apiClient<{
    success: boolean;
    data: BackendDashboardOverviewData;
  }>(`/admin/dashboard/overview?timeframe=${backendTimeframe}`, {
    method: "GET",
  });

  console.log("[Dashboard API] GET /api/v1/admin/dashboard/overview response:", response);

  return normalizeDashboardOverview(response.data, timeframe);
}
