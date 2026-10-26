// features/support-tickets/types/support-tickets.types.ts

/**
 * Confirmed categories per docs/SUPPORT-TICKETS.md §2:
 * "only Payment, Account, Booking, and NIN are confirmed (DB Design v1.3 §3.18).
 * The remaining values are a proposal pending product/support review and may change before launch."
 */
export const CONFIRMED_TICKET_TYPES = [
  "Payment",
  "Account",
  "Booking",
  "NIN",
] as const;

export const PROPOSED_TICKET_TYPES = [
  "Payout",
  "Refund",
  "CAC",
  "ProfileListing",
  "MediaUpload",
  "Notification",
  "Technical",
  "Other",
] as const;

export const ALL_TICKET_TYPES = [
  ...CONFIRMED_TICKET_TYPES,
  ...PROPOSED_TICKET_TYPES,
] as const;

export type ConfirmedTicketType = (typeof CONFIRMED_TICKET_TYPES)[number];
export type ProposedTicketType = (typeof PROPOSED_TICKET_TYPES)[number];
export type TicketType =
  | ConfirmedTicketType
  | ProposedTicketType
  | "Payment Issue"
  | (string & {});

export type TicketPriority =
  | "HIGH"
  | "MEDIUM"
  | "LOW"
  | "High"
  | "Medium"
  | "Low";

export type TicketStatus =
  | "OPEN"
  | "IN_PROGRESS"
  | "RESOLVED"
  | "Open"
  | "In Progress"
  | "Resolved";

export interface TicketMessage {
  id: string;
  senderName: string;
  senderRole: "Customer" | "Admin" | "System";
  senderAvatar?: string;
  senderInitial?: string;
  senderColor?: string;
  timestamp: string;
  isInternalNote?: boolean;
  subject?: string;
  content: string;
}

export interface SupportTicket {
  id: string; // UUID
  ticketNumber: string; // Human-readable reference e.g. "SUP-260912-K7B2"
  ticketCode?: string; // Legacy UI alias
  raisedByUserId?: string;
  raisedBy?: string;
  userInitial?: string;
  userEmail?: string;
  userPhone?: string;
  userLocation?: string;
  profileId?: string | null;
  assignedStaffId?: string | null;
  assignedAdmin?: {
    id?: string;
    name: string;
    role: string;
    avatar?: string;
  };
  type: TicketType;
  subject: string;
  description?: string;
  priority: TicketPriority;
  status: TicketStatus;
  createdAt: string;
  date?: string;
  resolvedAt?: string | null;
  source?: string;
  hosteId?: string;
  isVerified?: boolean;
  category?: string;
  subCategory?: string;
  bookingId?: string;
  paymentMethod?: string;
  transactionId?: string;
  amount?: string;
  updatedAt?: string;
  messages?: TicketMessage[];
}

export interface SupportTicketStats {
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  totalCount?: number;
  avgResolutionTime: string;
}

export interface SupportTicketFilterParams {
  search?: string;
  status?: TicketStatus | "All" | "ALL";
  type?: string | "All" | "ALL";
  priority?: TicketPriority | "All" | "ALL";
  skip?: number;
  take?: number;
}

export interface SupportTicketsResponse {
  tickets: SupportTicket[];
  total: number;
  stats?: SupportTicketStats;
}

export interface RawBackendSupportTicket {
  id?: string;
  ticketNumber?: string;
  ticketCode?: string;
  raisedByUserId?: string;
  raisedBy?: string;
  raisedByUser?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  user?: {
    name?: string;
    email?: string;
    phone?: string;
  };
  userInitial?: string;
  userEmail?: string;
  userPhone?: string;
  userLocation?: string;
  profileId?: string | null;
  assignedStaffId?: string | null;
  assignedStaff?: {
    id?: string;
    name: string;
    role: string;
    avatar?: string;
  };
  assignedAdmin?: {
    id?: string;
    name: string;
    role: string;
    avatar?: string;
  };
  type?: TicketType;
  subject?: string;
  description?: string;
  priority?: string;
  status?: string;
  createdAt?: string;
  date?: string;
  resolvedAt?: string | null;
  source?: string;
  hosteId?: string;
  isVerified?: boolean;
  category?: string;
  subCategory?: string;
  bookingId?: string;
  paymentMethod?: string;
  transactionId?: string;
  amount?: string;
  updatedAt?: string;
  messages?: TicketMessage[];
}

export interface SupportTicketsApiResponse {
  success: boolean;
  data: RawBackendSupportTicket[];
  meta?: {
    total?: number;
    skip?: number;
    take?: number;
  };
}

export interface SingleSupportTicketApiResponse {
  success: boolean;
  data: RawBackendSupportTicket;
}
