export type BookingStatus =
  | "Pending"
  | "Confirmed"
  | "Ongoing"
  | "Completed"
  | "Cancelled"
  | "Disputed";

export type PaymentStatus = "Paid" | "Pending" | "Refunded" | "Partially Refunded" | "Failed";
export type PayoutStatus = "Paid" | "Pending" | "On Hold" | "Failed";

export interface Booking {
  id: string;
  bookingCode: string;
  customerName: string;
  customerEmail: string;
  hostName: string;
  brandName?: string;
  eventName: string;
  eventCategory: string;
  eventDate: string;
  location: string;
  guestCount: number;
  status: BookingStatus;
  totalAmount: number;
  currency: string;
  paymentStatus: PaymentStatus;
  payoutStatus: PayoutStatus;
  createdAt: string;
  cancellationReason?: string;
  disputeReason?: string;
  disputeNotes?: string;
  specialRequests?: string;
}

export interface BookingKPIs {
  totalBookings: number;
  confirmedBookings: number;
  ongoingBookings: number;
  completedBookings: number;
  cancelledBookings: number;
  disputedBookings: number;
  totalRevenue: number;
}

export interface BookingFilterParams {
  search?: string;
  status?: BookingStatus | "All";
  paymentStatus?: PaymentStatus | "All";
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}
