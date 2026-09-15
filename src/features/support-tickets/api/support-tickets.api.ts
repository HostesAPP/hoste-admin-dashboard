// features/support-tickets/api/support-tickets.api.ts

import {
  SupportTicket,
  SupportTicketStats,
  SupportTicketFilterParams,
} from "../types/support-tickets.types";
import {
  MOCK_SUPPORT_TICKETS,
  MOCK_TICKET_STATS,
} from "../data/support-tickets.data";

const sessionTickets = [...MOCK_SUPPORT_TICKETS];

export async function fetchSupportTickets(
  params?: SupportTicketFilterParams
): Promise<SupportTicket[]> {
  try {
    let data = [...sessionTickets];

    if (params?.status && params.status !== "All") {
      data = data.filter((item) => item.status === params.status);
    }

    if (params?.type && params.type !== "All") {
      data = data.filter((item) => item.type === params.type);
    }

    if (params?.priority && params.priority !== "All") {
      data = data.filter((item) => item.priority === params.priority);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.ticketCode.toLowerCase().includes(q) ||
          item.raisedBy.toLowerCase().includes(q) ||
          item.subject.toLowerCase().includes(q)
      );
    }

    return data;
  } catch {
    return sessionTickets;
  }
}

export async function fetchSupportTicketById(
  idOrCode: string
): Promise<SupportTicket | null> {
  try {
    const formattedId = idOrCode.toLowerCase().replace("#", "");
    const ticket = sessionTickets.find(
      (t) =>
        t.id.toLowerCase() === formattedId ||
        t.ticketCode.toLowerCase().replace("#", "") === formattedId
    );
    return ticket || sessionTickets[0] || null;
  } catch {
    return sessionTickets[0] || null;
  }
}

export async function updateSupportTicketStatus(
  idOrCode: string,
  status: SupportTicket["status"]
): Promise<SupportTicket | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const ticketIndex = sessionTickets.findIndex(
    (t) =>
      t.id.toLowerCase() === formattedId ||
      t.ticketCode.toLowerCase().replace("#", "") === formattedId
  );
  if (ticketIndex !== -1) {
    sessionTickets[ticketIndex] = {
      ...sessionTickets[ticketIndex],
      status,
      updatedAt: "Just now",
    };
    return sessionTickets[ticketIndex];
  }
  return null;
}

export async function addSupportTicketMessage(
  idOrCode: string,
  message: import("../types/support-tickets.types").TicketMessage
): Promise<SupportTicket | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const ticketIndex = sessionTickets.findIndex(
    (t) =>
      t.id.toLowerCase() === formattedId ||
      t.ticketCode.toLowerCase().replace("#", "") === formattedId
  );
  if (ticketIndex !== -1) {
    const existingMessages = sessionTickets[ticketIndex].messages || [];
    sessionTickets[ticketIndex] = {
      ...sessionTickets[ticketIndex],
      messages: [...existingMessages, message],
      updatedAt: "Just now",
    };
    return sessionTickets[ticketIndex];
  }
  return null;
}

export async function fetchSupportTicketStats(): Promise<SupportTicketStats> {
  try {
    const openCount = sessionTickets.filter((t) => t.status === "Open").length;
    const inProgressCount = sessionTickets.filter(
      (t) => t.status === "In Progress"
    ).length;
    const resolvedCount = sessionTickets.filter(
      (t) => t.status === "Resolved"
    ).length;

    return {
      openCount,
      inProgressCount,
      resolvedCount,
      avgResolutionTime: MOCK_TICKET_STATS.avgResolutionTime,
    };
  } catch {
    return MOCK_TICKET_STATS;
  }
}
