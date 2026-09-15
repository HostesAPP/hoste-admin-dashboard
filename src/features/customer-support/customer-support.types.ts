// features/customer-support/customer-support.types.ts

export type ConversationStatus = "Open" | "Waiting" | "Escalated" | "Closed";
export type ConversationChannel = "Chat" | "WhatsApp" | "Email" | "Mobile App";

export interface CustomerMessage {
  id: string;
  senderName: string;
  senderRole: "Customer" | "Admin" | "System";
  senderAvatar?: string;
  senderInitial?: string;
  timestamp: string;
  isInternalNote?: boolean;
  content: string;
}

export interface CustomerBookingItem {
  id: string;
  title: string;
  date: string;
  image?: string;
}

export interface CustomerConversation {
  id: string;
  conversationCode: string;
  customerName: string;
  customerAvatar?: string;
  customerInitial?: string;
  customerEmail?: string;
  customerPhone?: string;
  customerLocation?: string;
  customerSince?: string;
  isVerifiedHoste?: boolean;
  isOnline?: boolean;
  lastMessage: string;
  unreadCount?: number;
  channel: ConversationChannel;
  status: ConversationStatus;
  lastActivity: string;
  totalBookings?: number;
  totalSpent?: string;
  verificationStatus?: string;
  assignedAdmin?: {
    name: string;
    role: string;
    initials?: string;
  };
  recentBookings?: CustomerBookingItem[];
  messages?: CustomerMessage[];
}

export interface CustomerSupportStatsData {
  openConversations: number;
  openChangeText: string;
  waitingForReply: number;
  waitingChangeText: string;
  escalated: number;
  escalatedChangeText: string;
  closedToday: number;
  closedChangeText: string;
  totalConversations: number;
}

export interface ConversationFilterParams {
  search?: string;
  status?: ConversationStatus | "All";
  channel?: ConversationChannel | "All";
  sortBy?: "newest" | "oldest" | "activity";
}

export interface CustomerActivityItem {
  id: string;
  type: "booking" | "payment" | "support" | "resolved";
  title: string;
  timestamp: string;
}

export interface CustomerInternalNote {
  id: string;
  content: string;
  author: string;
  timestamp: string;
  variant?: "amber" | "emerald" | "blue";
}

export interface CustomerProfileData {
  id: string;
  customerCode: string;
  customerName: string;
  customerAvatar?: string;
  customerInitial?: string;
  isVerified: boolean;
  customerStatus: "Active" | "Suspended" | "Flagged";
  email: string;
  phone: string;
  location: string;
  joinedDate: string;
  about: string;
  accountSummary: {
    totalBookings: number;
    totalSpent: string;
    outstandingBalance: string;
    completedBookings: number;
    cancelledBookings: number;
    noShowBookings: number;
  };
  overviewStats: {
    accountStatus: string;
    verificationStatus: string;
    customerSince: string;
    lastActive: string;
  };
  recentActivities: CustomerActivityItem[];
  supportSummary: {
    total: number;
    open: number;
    underReview: number;
    closed: number;
    resolved: number;
    closedSecond: number;
  };
  internalNotes: CustomerInternalNote[];
}

export type DisputeIssueCategory =
  | "Payout Issue"
  | "Booking Cancellation"
  | "Payment Discrepancy"
  | "Service Quality"
  | "Fraud Suspected"
  | "Other";

export type DisputePriorityLevel = "Urgent" | "High" | "Medium" | "Low";

export interface DisputeAttachment {
  id: string;
  name: string;
  size: string;
  type: "image" | "pdf" | "other";
}

export interface EscalateDisputePayload {
  conversationId: string;
  issueCategory: DisputeIssueCategory;
  priorityLevel: DisputePriorityLevel;
  reasonForEscalation: string;
  triedSoFar?: string;
  attachments?: DisputeAttachment[];
  assignedTeam: string;
  internalNote?: string;
  notifyCustomer: boolean;
}

export interface DisputeRelatedTicket {
  ticketCode: string;
  status: "Open" | "In Progress" | "Resolved" | "Closed";
  openedDate: string;
  issueSummary: string;
}

export interface DisputeBookingDetails {
  id: string;
  title: string;
  status: string;
  hostName: string;
  bookingCode: string;
  eventDate: string;
  amount: string;
  thumbnailUrl?: string;
}

