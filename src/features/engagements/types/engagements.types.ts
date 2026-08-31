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

export type EngagementParticipant = {
  id: string;
  engagementId: string;
  profileId: string;
  role?: EngagementParticipantRole;
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
