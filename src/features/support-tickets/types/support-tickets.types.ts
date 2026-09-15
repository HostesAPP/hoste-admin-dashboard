// features/support-tickets/types/support-tickets.types.ts

export type TicketType = "Payment" | "Account" | "Booking" | "NIN" | "Payment Issue";
export type TicketPriority = "High" | "Medium" | "Low";
export type TicketStatus = "Open" | "In Progress" | "Resolved";

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
  id: string;
  ticketCode: string;
  raisedBy: string;
  userInitial?: string;
  type: TicketType;
  subject: string;
  date: string;
  priority: TicketPriority;
  status: TicketStatus;
  source?: string;
  description?: string;
  userEmail?: string;
  userPhone?: string;
  userLocation?: string;
  hosteId?: string;
  isVerified?: boolean;
  category?: string;
  assignedAdmin?: {
    name: string;
    role: string;
    avatar?: string;
  };
  bookingId?: string;
  paymentMethod?: string;
  transactionId?: string;
  amount?: string;
  subCategory?: string;
  createdAt: string;
  updatedAt?: string;
  messages?: TicketMessage[];
}

export interface SupportTicketStats {
  openCount: number;
  inProgressCount: number;
  resolvedCount: number;
  avgResolutionTime: string;
}

export interface SupportTicketFilterParams {
  search?: string;
  status?: TicketStatus | "All";
  type?: TicketType | "All";
  priority?: TicketPriority | "All";
}
