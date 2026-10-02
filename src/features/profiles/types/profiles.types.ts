export type VerificationStatus =
  | "Pending"
  | "Approved_Awaiting_Payment"
  | "Active"
  | "Rejected"
  | "Expired";

export type ProfileStatus =
  | "Pending"
  | "Active"
  | "Rejected"
  | "Suspended"
  | "Deleted";

export type ProfileType = "HOST" | "BRAND" | "EVENT_PLANNER" | "INDIVIDUAL";

export type ProfileTab =
  | "pending"
  | "approved"
  | "rejected"
  | "suspended"
  | "deactivated";

export interface ExperienceItem {
  role: string;
  company: string;
  period: string;
}

export interface BookingHistoryItem {
  id?: string;
  event: string;
  client: string;
  date: string;
  status: "Completed" | "Pending" | "Cancelled" | "InProgress";
}

export interface AvailabilityInfo {
  status: "Available" | "Unavailable" | "Busy";
  days: string;
  hours: string;
}

export interface VerificationSummaryInfo {
  identityStatus: "Pending" | "Verified" | "Rejected";
  certificatesCount: number;
  backgroundStatus: "Pending" | "Verified" | "Rejected";
}

export type Profile = {
  id: string;
  hosteId: string; // e.g. "HOSTE-1123"
  userId: string;
  profileType: ProfileType;
  categoryRole?: string; // e.g. "Professional Hosté", "Event Assistant"
  profession?: string;
  subLocation?: string; // e.g. "Lagos, Nigeria"
  attributes: Record<string, unknown>;
  attributesVersion: number;
  activationData: Record<string, unknown>;
  displayName: string;
  description: string;
  aboutText?: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  verificationStatus: VerificationStatus;
  status: ProfileStatus;
  suspendedUntil: string | null;
  completedBookingsCount?: number;
  rating?: number;
  reviewsCount?: number;
  recentReviewText?: string;
  avatarBgColor?: string;
  avatarInitial?: string;
  avatarUrl?: string;
  memberSince?: string;
  services?: string[];
  skills?: string[];
  experienceList?: ExperienceItem[];
  availability?: AvailabilityInfo;
  bookingHistory?: BookingHistoryItem[];
  verificationSummary?: VerificationSummaryInfo;
  createdAt: string;
  updatedAt: string;
};

export type ActionType = "approve" | "reject" | "suspend" | "restore" | "ban" | null;

export interface ProfileCounts {
  pending: number;
  approved: number;
  rejected: number;
  suspended: number;
  deactivated: number;
}

export interface ActivityTrailItem {
  id: string;
  date: string;
  user: string;
  action: string;
  note: string;
}

export interface AdminNoteItem {
  id: string;
  author: string;
  role: string;
  text: string;
  date: string;
}

export interface VerificationDocumentInfo {
  idType: string;
  idNumber: string;
  nameOnId: string;
  expiryDate: string;
  ninMaskedNumber?: string;
  photoMatchPercent: number;
  status: "Unverified" | "Verified" | "Pending" | "Rejected";
  idMatchApproved: boolean;
  photoMatchApproved: boolean;
  backgroundStatus: "Pending Report" | "Verified" | "Failed";
  adminNotes: AdminNoteItem[];
  activityTrail: ActivityTrailItem[];
}