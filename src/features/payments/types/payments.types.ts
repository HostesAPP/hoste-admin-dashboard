export type PaymentType = "Verification" | "Advertisement" | "Engagement";
export type PaymentStatus = "Pending" | "Successful" | "Failed" | "Cancelled" | "Refunded";
export type PayoutStatus = "Pending" | "Processing" | "Successful" | "Failed";

export interface PaymentItem {
  id: string;
  referenceId: string; // PAY-YYMMDD-XXXX
  paymentType: PaymentType;
  engagementId?: string;
  grossAmount: number;
  serviceFee: number; // Payment.ServiceFee (10% Service Fee paid by Brand per PRD v2.2 §04)
  processingFee: number;
  status: PaymentStatus;
  retryChainCount?: number;
  payerProfileName: string;
  createdAt: string;
}

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
  platformFlatFee: number; // Payout.PlatformFlatFee (₦1,000 Platform Fee per Host per PRD v2.2 §04) TODO: pending product confirmation for field naming per §18
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
