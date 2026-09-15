// features/customer-support/api/customer-support.api.ts

import {
  CustomerConversation,
  CustomerSupportStatsData,
  ConversationFilterParams,
  CustomerMessage,
  ConversationStatus,
  CustomerProfileData,
} from "../customer-support.types";
import {
  MOCK_CUSTOMER_CONVERSATIONS,
  MOCK_CUSTOMER_STATS,
} from "../data/customer-support.data";
import { MOCK_CUSTOMER_PROFILES } from "../data/customer-profile.data";

const sessionConversations = [...MOCK_CUSTOMER_CONVERSATIONS];

export async function fetchCustomerConversations(
  params?: ConversationFilterParams
): Promise<CustomerConversation[]> {
  try {
    let data = [...sessionConversations];

    if (params?.status && params.status !== "All") {
      data = data.filter((item) => item.status === params.status);
    }

    if (params?.channel && params.channel !== "All") {
      data = data.filter((item) => item.channel === params.channel);
    }

    if (params?.search && params.search.trim()) {
      const q = params.search.toLowerCase();
      data = data.filter(
        (item) =>
          item.customerName.toLowerCase().includes(q) ||
          item.lastMessage.toLowerCase().includes(q) ||
          item.conversationCode.toLowerCase().includes(q)
      );
    }

    if (params?.sortBy === "oldest") {
      data = [...data].reverse();
    }

    return data;
  } catch {
    return sessionConversations;
  }
}

export async function fetchCustomerConversationById(
  idOrCode: string
): Promise<CustomerConversation | null> {
  try {
    const formattedId = idOrCode.toLowerCase().replace("#", "");
    const conv = sessionConversations.find(
      (c) =>
        c.id.toLowerCase() === formattedId ||
        c.conversationCode.toLowerCase().replace("#", "") === formattedId
    );
    return conv || sessionConversations[0] || null;
  } catch {
    return sessionConversations[0] || null;
  }
}

export async function fetchCustomerSupportStats(): Promise<CustomerSupportStatsData> {
  try {
    const openCount = sessionConversations.filter((c) => c.status === "Open").length;
    const waitingCount = sessionConversations.filter((c) => c.status === "Waiting").length;
    const escalatedCount = sessionConversations.filter((c) => c.status === "Escalated").length;
    const closedCount = sessionConversations.filter((c) => c.status === "Closed").length;

    return {
      openConversations: openCount || MOCK_CUSTOMER_STATS.openConversations,
      openChangeText: MOCK_CUSTOMER_STATS.openChangeText,
      waitingForReply: waitingCount || MOCK_CUSTOMER_STATS.waitingForReply,
      waitingChangeText: MOCK_CUSTOMER_STATS.waitingChangeText,
      escalated: escalatedCount || MOCK_CUSTOMER_STATS.escalated,
      escalatedChangeText: MOCK_CUSTOMER_STATS.escalatedChangeText,
      closedToday: closedCount || MOCK_CUSTOMER_STATS.closedToday,
      closedChangeText: MOCK_CUSTOMER_STATS.closedChangeText,
      totalConversations: sessionConversations.length || MOCK_CUSTOMER_STATS.totalConversations,
    };
  } catch {
    return MOCK_CUSTOMER_STATS;
  }
}

export async function updateCustomerConversationStatus(
  idOrCode: string,
  status: ConversationStatus
): Promise<CustomerConversation | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const index = sessionConversations.findIndex(
    (c) =>
      c.id.toLowerCase() === formattedId ||
      c.conversationCode.toLowerCase().replace("#", "") === formattedId
  );
  if (index !== -1) {
    sessionConversations[index] = {
      ...sessionConversations[index],
      status,
      lastActivity: "Just now",
    };
    return sessionConversations[index];
  }
  return null;
}

export async function addCustomerConversationMessage(
  idOrCode: string,
  message: CustomerMessage
): Promise<CustomerConversation | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const index = sessionConversations.findIndex(
    (c) =>
      c.id.toLowerCase() === formattedId ||
      c.conversationCode.toLowerCase().replace("#", "") === formattedId
  );
  if (index !== -1) {
    const existingMessages = sessionConversations[index].messages || [];
    sessionConversations[index] = {
      ...sessionConversations[index],
      messages: [...existingMessages, message],
      lastMessage: message.content,
      lastActivity: "Just now",
      unreadCount: 0,
    };
    return sessionConversations[index];
  }
  return null;
}

export async function createCustomerConversation(
  newConv: Partial<CustomerConversation>
): Promise<CustomerConversation> {
  const conversation: CustomerConversation = {
    id: `conv-${Date.now()}`,
    conversationCode: `#CNV-${Math.floor(100 + Math.random() * 900)}`,
    customerName: newConv.customerName || "Anonymous Customer",
    customerInitial: (newConv.customerName || "A").charAt(0).toUpperCase(),
    customerEmail: newConv.customerEmail,
    customerPhone: newConv.customerPhone,
    lastMessage: newConv.lastMessage || "Started a new conversation",
    unreadCount: 0,
    channel: newConv.channel || "Chat",
    status: newConv.status || "Open",
    lastActivity: "Just now",
    assignedAdmin: {
      name: "Super Admin",
      role: "Super Admin",
      initials: "SA",
    },
    messages: [
      {
        id: `msg-${Date.now()}`,
        senderName: newConv.customerName || "Customer",
        senderRole: "Customer",
        timestamp: "Just now",
        content: newConv.lastMessage || "Hello, I need support.",
      },
    ],
  };

  sessionConversations.unshift(conversation);
  return conversation;
}

const sessionProfiles = [...MOCK_CUSTOMER_PROFILES];

export async function fetchCustomerProfile(
  idOrCode: string
): Promise<CustomerProfileData | null> {
  try {
    const formattedId = idOrCode.toLowerCase().replace("#", "");
    const profile = sessionProfiles.find(
      (p) =>
        p.id.toLowerCase() === formattedId ||
        p.customerCode.toLowerCase() === formattedId
    );
    return profile || sessionProfiles[0] || null;
  } catch {
    return sessionProfiles[0] || null;
  }
}

export async function updateCustomerProfileStatus(
  idOrCode: string,
  status: CustomerProfileData["customerStatus"],
  reason?: string
): Promise<CustomerProfileData | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const index = sessionProfiles.findIndex(
    (p) =>
      p.id.toLowerCase() === formattedId ||
      p.customerCode.toLowerCase() === formattedId
  );
  if (index !== -1) {
    sessionProfiles[index] = {
      ...sessionProfiles[index],
      customerStatus: status,
      overviewStats: {
        ...sessionProfiles[index].overviewStats,
        accountStatus: status,
      },
    };
    return sessionProfiles[index];
  }
  return null;
}

export async function addCustomerInternalNote(
  idOrCode: string,
  content: string
): Promise<CustomerProfileData | null> {
  const formattedId = idOrCode.toLowerCase().replace("#", "");
  const index = sessionProfiles.findIndex(
    (p) =>
      p.id.toLowerCase() === formattedId ||
      p.customerCode.toLowerCase() === formattedId
  );
  if (index !== -1) {
    const newNote = {
      id: `note-${Date.now()}`,
      content,
      author: "Super Admin",
      timestamp: "Just now",
      variant: "amber" as const,
    };
    sessionProfiles[index] = {
      ...sessionProfiles[index],
      internalNotes: [newNote, ...(sessionProfiles[index].internalNotes || [])],
    };
    return sessionProfiles[index];
  }
  return null;
}

export async function escalateConversationToDispute(
  payload: import("../customer-support.types").EscalateDisputePayload
): Promise<{ success: boolean; disputeId: string; conversation: CustomerConversation | null }> {
  const conv = await updateCustomerConversationStatus(payload.conversationId, "Escalated");
  return {
    success: true,
    disputeId: `DSP-${Date.now().toString().slice(-5)}`,
    conversation: conv,
  };
}

