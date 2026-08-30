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

export type ProfileType = "HOST" | "BRAND" | "EVENT_PLANNER";


export type Profile = {
  id: string;
  userId: string;
  profileType: ProfileType;
  attributes: Record<string, unknown>;
  attributesVersion: number;
  activationData: Record<string, unknown>;
  displayName: string;
  description: string;
  phone: string;
  email: string;
  country: string;
  state: string;
  city: string;
  address: string;
  verificationStatus: VerificationStatus;
  status: ProfileStatus;
  suspendedUntil: string | null;
  createdAt: string;
  updatedAt: string;
};