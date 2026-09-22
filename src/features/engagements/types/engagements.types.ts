export type BookingType =
  | "INDIVIDUAL"
  | "GROUP"
  | "EXPERIENCE"
  | "VENUE"
  | "HOST_SERVICE"
  | "EVENT_PLANNING";

export type EngagementStatus =
  | "PENDING"
  | "ACCEPTED"
  | "IN_PROGRESS"
  | "COMPLETED"
  | "CANCELLED"
  | "DISPUTED";

export type EngagementParticipantRole =
  | "HOST"
  | "CLIENT"
  | "COLLABORATOR"
  | "MEMBER";

export type ParticipantStatus = "Pending" | "Accepted" | "Declined" | "Cancelled" | "Completed";

export type EngagementParticipant = {
  id: string;
  engagementId: string;
  profileId: string;
  profileName?: string;
  role?: EngagementParticipantRole;
  status?: ParticipantStatus; // Declined (normal) vs Cancelled (triggers moderation strike per PRD v2.2 §06)
  amount?: number;
  createdAt?: string;
};

export type Engagement = {
  id: string;
  referenceId: string;
  createdByProfileId: string;
  paymentId: string | null;
  groupId: string | null;
  bookingType: BookingType;
  title: string;
  description: string;
  status: EngagementStatus;
  cancellationReason: string | null;
  startDate: string;
  endDate: string;
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
  participants?: EngagementParticipant[];
};
