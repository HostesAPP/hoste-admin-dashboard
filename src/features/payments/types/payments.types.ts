export type PaymentType = "Verification" | "Advertisement" | "Engagement";
export type PaymentStatus = "Pending" | "Successful" | "Failed" | "Cancelled" | "Refunded";
export type PayoutStatus = "Pending" | "Processing" | "Successful" | "Failed";

export interface PaymentItem {
  id: string;
  referenceId: string; // PAY-YYMMDD-XXXX
  paymentType: PaymentType;
  engagementId?: string;
  grossAmount: number;
  serviceFee: number; // 10% Service Fee paid by Brand (PRD v2.3 §4)
  processingFee: number;
  status: PaymentStatus;
  retryChainCount?: number;
  payerProfileName: string;
  createdAt: string;
}

// TODO: pending confirmation - Payout.PlatformFlatFee field naming pending DB team sign-off (PRD v2.3 §4 & §23)
export interface PayoutItem {
  id: string;
  referenceId: string; // PYO-YYMMDD-XXXX
  engagementId: string;
  recipientProfileName: string;
  bankAccountName: string;
  bankName: string;
  accountNumber: string;
  grossAmount: number;
  serviceFee: number;
  platformFlatFee: number; // ₦1,000 flat per Host per engagement
  processingFee: number;
  finalAmount: number; // Locked historical final amount
  status: PayoutStatus;
  heldEscrowDays: number;
  createdAt: string;
}

export interface RefundItem {
  id: string;
  referenceId: string; // REF-YYMMDD-XXXX
  paymentId: string;
  engagementId?: string;
  amount: number;
  destination: "Original Payment Method"; // Strictly fixed
  processingFee: number;
  description: string; // Admin-only
  initiatedByStaffId: string;
  createdAt: string;
}
