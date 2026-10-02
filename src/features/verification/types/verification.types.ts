import { VerificationStatus, ProfileType } from "@/features/profiles/types/profiles.types";

export interface VerificationApplication {
  id: string;
  profileId: string;
  profileName: string;
  profileType: ProfileType;
  email: string;
  phone: string;
  submittedAt: string;
  status: VerificationStatus;
  submittedData: {
    idType: string;
    idNumber: string;
    documentUrl: string;
    cacNumber?: string;
    businessRegistrationDoc?: string;
  };
  feePaymentStatus: "Unpaid" | "Paid" | "Failed" | "Waived";
  paymentReference?: string;
  approvedByStaffId?: string;
  rejectedReason?: string;
}
