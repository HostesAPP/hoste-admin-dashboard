// features/support-tickets/api/support-tickets.api.ts

import { apiClient } from "@/lib/api-client";
import {
  SupportTicket,
  SupportTicketStats,
  SupportTicketFilterParams,
  TicketStatus,
  TicketType,
  RawBackendSupportTicket,
  SupportTicketsApiResponse,
  SingleSupportTicketApiResponse,
} from "../types/support-tickets.types";

/**
 * Normalizes status values between UI formats ("Open", "In Progress", "Resolved")
 * and backend formats ("OPEN", "IN_PROGRESS", "RESOLVED").
 */
function normalizeStatusForBackend(status?: string): string | undefined {
  if (!status || status.toUpperCase() === "ALL") return undefined;
  const upper = status.toUpperCase().replace(/\s+/g, "_");
  if (upper === "OPEN" || upper === "IN_PROGRESS" || upper === "RESOLVED") {
    return upper;
  }
  return undefined;
}

export function normalizeTicketFromBackend(raw: RawBackendSupportTicket): SupportTicket {
  if (!raw) {
    throw new Error("Invalid ticket data received from backend");
  }

  const statusUpper = String(raw.status || "OPEN").toUpperCase();
  const normalizedStatus: TicketStatus =
    statusUpper === "RESOLVED"
      ? "Resolved"
      : statusUpper === "IN_PROGRESS"
      ? "In Progress"
      : "Open";

  const priorityUpper = String(raw.priority || "MEDIUM").toUpperCase();
  const normalizedPriority =
    priorityUpper === "HIGH"
      ? "High"
      : priorityUpper === "LOW"
      ? "Low"
      : "Medium";

  const ticketNumber =
    raw.ticketNumber || raw.ticketCode || `SUP-${String(raw.id || "").slice(0, 8)}`;

  const createdDate = raw.createdAt ? new Date(raw.createdAt) : new Date();
  const dateFormatted = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    : raw.date || "Today";

  const raisedByName =
    raw.raisedBy ||
    raw.raisedByUser?.name ||
    raw.user?.name ||
    (raw.raisedByUserId
      ? `User #${String(raw.raisedByUserId).slice(0, 6)}`
      : "Customer");

  return {
    id: raw.id || "",
    ticketNumber,
    ticketCode: ticketNumber,
    raisedByUserId: raw.raisedByUserId,
    raisedBy: raisedByName,
    userInitial:
      raw.userInitial || (raisedByName ? raisedByName.charAt(0).toUpperCase() : "U"),
    userEmail: raw.userEmail || raw.user?.email || raw.raisedByUser?.email,
    userPhone: raw.userPhone || raw.user?.phone || raw.raisedByUser?.phone,
    userLocation: raw.userLocation,
    profileId: raw.profileId,
    assignedStaffId: raw.assignedStaffId,
    assignedAdmin: raw.assignedStaff || raw.assignedAdmin,
    type: (raw.type as TicketType) || "Other",
    subject: raw.subject || "No Subject",
    description: raw.description || "",
    priority: normalizedPriority,
    status: normalizedStatus,
    createdAt: raw.createdAt || new Date().toISOString(),
    date: dateFormatted,
    resolvedAt: raw.resolvedAt || null,
    source: raw.source || "Support Portal",
    hosteId: raw.hosteId,
    isVerified: raw.isVerified ?? false,
    bookingId: raw.bookingId,
    paymentMethod: raw.paymentMethod,
    transactionId: raw.transactionId,
    amount: raw.amount,
    updatedAt: raw.updatedAt,
    messages: raw.messages || [],
  };
}

/**
 * List All Tickets (Staff endpoint)
 * Method: GET /api/v1/support-tickets?status=OPEN&type=Payment&skip=0&take=20
 * Access: Staff Only (Protected with Bearer token)
 */
export async function fetchSupportTickets(
  params?: SupportTicketFilterParams
): Promise<SupportTicket[]> {
  const queryParams = new URLSearchParams();
  const backendStatus = normalizeStatusForBackend(params?.status);
  if (backendStatus) queryParams.set("status", backendStatus);
  if (params?.type && params.type.toUpperCase() !== "ALL") {
    queryParams.set("type", params.type);
  }
  if (params?.skip !== undefined) queryParams.set("skip", String(params.skip));
  if (params?.take !== undefined) queryParams.set("take", String(params.take));

  const queryString = queryParams.toString();
  const endpoint = `/support-tickets${queryString ? `?${queryString}` : ""}`;

  const res = await apiClient<SupportTicketsApiResponse>(endpoint, {
    method: "GET",
  });

  const rawTickets = Array.isArray(res?.data) ? res.data : [];
  let tickets = rawTickets.map(normalizeTicketFromBackend);

  if (params?.search && params.search.trim()) {
    const q = params.search.toLowerCase();
    tickets = tickets.filter(
      (item) =>
        item.ticketNumber.toLowerCase().includes(q) ||
        item.subject.toLowerCase().includes(q) ||
        (item.raisedBy && item.raisedBy.toLowerCase().includes(q)) ||
        (item.raisedByUserId && item.raisedByUserId.toLowerCase().includes(q))
    );
  }

  return tickets;
}

/**
 * Get a Single Ticket (Staff or Author)
 * Method: GET /api/v1/support-tickets/:id
 * Access: Protected (Staff or Ticket Author)
 */
export async function fetchSupportTicketById(
  id: string
): Promise<SupportTicket> {
  const cleanId = id.trim();
  const res = await apiClient<SingleSupportTicketApiResponse>(
    `/support-tickets/${cleanId}`,
    {
      method: "GET",
    }
  );

  return normalizeTicketFromBackend(res.data);
}

/**
 * Update Ticket Status (Staff Only)
 * Method: PATCH /api/v1/support-tickets/:id/status
 * Request Body: { status: "OPEN" | "IN_PROGRESS" | "RESOLVED" }
 */
export async function updateSupportTicketStatus(
  id: string,
  status: TicketStatus
): Promise<SupportTicket> {
  const backendStatus =
    status.toUpperCase() === "RESOLVED"
      ? "RESOLVED"
      : status.toUpperCase() === "IN_PROGRESS" || status === "In Progress"
      ? "IN_PROGRESS"
      : "OPEN";

  const res = await apiClient<SingleSupportTicketApiResponse>(
    `/support-tickets/${id}/status`,
    {
      method: "PATCH",
      body: JSON.stringify({ status: backendStatus }),
    }
  );

  return normalizeTicketFromBackend(res.data);
}

/**
 * Assign Ticket to Staff (Staff Only)
 * Method: PATCH /api/v1/support-tickets/:id/assign
 * Request Body: { staffId: string }
 */
export async function assignSupportTicket(
  id: string,
  staffId: string
): Promise<SupportTicket> {
  const res = await apiClient<SingleSupportTicketApiResponse>(
    `/support-tickets/${id}/assign`,
    {
      method: "PATCH",
      body: JSON.stringify({ staffId }),
    }
  );

  return normalizeTicketFromBackend(res.data);
}

/**
 * Fetch Support Ticket Stats (Computed from real backend tickets)
 */
export async function fetchSupportTicketStats(): Promise<SupportTicketStats> {
  const [openRes, inProgressRes, resolvedRes] = await Promise.allSettled([
    apiClient<SupportTicketsApiResponse>(
      "/support-tickets?status=OPEN&skip=0&take=100",
      { method: "GET" }
    ),
    apiClient<SupportTicketsApiResponse>(
      "/support-tickets?status=IN_PROGRESS&skip=0&take=100",
      { method: "GET" }
    ),
    apiClient<SupportTicketsApiResponse>(
      "/support-tickets?status=RESOLVED&skip=0&take=100",
      { method: "GET" }
    ),
  ]);

  const openTickets =
    openRes.status === "fulfilled" && Array.isArray(openRes.value?.data)
      ? openRes.value.data
      : [];
  const inProgressTickets =
    inProgressRes.status === "fulfilled" && Array.isArray(inProgressRes.value?.data)
      ? inProgressRes.value.data
      : [];
  const resolvedTickets =
    resolvedRes.status === "fulfilled" && Array.isArray(resolvedRes.value?.data)
      ? resolvedRes.value.data
      : [];

  const openCount =
    openRes.status === "fulfilled" && openRes.value?.meta?.total !== undefined
      ? openRes.value.meta.total
      : openTickets.length;

  const inProgressCount =
    inProgressRes.status === "fulfilled" && inProgressRes.value?.meta?.total !== undefined
      ? inProgressRes.value.meta.total
      : inProgressTickets.length;

  const resolvedCount =
    resolvedRes.status === "fulfilled" && resolvedRes.value?.meta?.total !== undefined
      ? resolvedRes.value.meta.total
      : resolvedTickets.length;

  const totalCount = openCount + inProgressCount + resolvedCount;

  // Calculate average resolution time from resolved tickets if timestamps exist
  let avgResolutionTime = "—";
  const validResolutions = resolvedTickets
    .map((t) => {
      if (t.createdAt && t.resolvedAt) {
        const start = new Date(t.createdAt).getTime();
        const end = new Date(t.resolvedAt).getTime();
        if (!isNaN(start) && !isNaN(end) && end >= start) {
          return (end - start) / (1000 * 60 * 60); // hours
        }
      }
      return null;
    })
    .filter((h): h is number => h !== null);

  if (validResolutions.length > 0) {
    const avgHours =
      validResolutions.reduce((sum, val) => sum + val, 0) / validResolutions.length;
    avgResolutionTime =
      avgHours < 1
        ? `${Math.max(1, Math.round(avgHours * 60))} mins`
        : `${avgHours.toFixed(1)} hrs`;
  }

  return {
    openCount,
    inProgressCount,
    resolvedCount,
    totalCount,
    avgResolutionTime,
  };
}

export async function addSupportTicketMessage(
  _id: string,
  message: import("../types/support-tickets.types").TicketMessage
): Promise<import("../types/support-tickets.types").TicketMessage> {
  return message;
}
