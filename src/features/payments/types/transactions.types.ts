import type { PaymentItem } from "./payments.types";

// Presentation models; adapt backend responses without changing PaymentItem.
export interface PaymentTransaction {
  payment: PaymentItem;
  customerEmail: string | null;
  bookingReference: string | null;
  method: "CREDIT_CARD" | "BANK_TRANSFER" | "PAYPAL";
  canRefund: boolean;
  canRetry: boolean;
}
export interface RefundContext {
  transaction: PaymentTransaction;
  availableAmount: number;
  booking: {
    reference: string;
    title: string;
    status: string;
    date: string;
    location: string;
    hostCount: number;
    imageUrl: string;
  } | null;
  reasons: { value: string; label: string }[];
  policy: string;
  recentRefunds: {
    id: string;
    reference: string;
    amount: number;
    date: string;
    status: string;
  }[];
}
export interface RefundDraft {
  amount: string;
  reason: string;
  description: string;
  destination: "Original Payment Method";
}
export interface RefundQuote {
  amount: number;
  processingFee: number;
  totalRefund: number;
}
export interface RefundReceipt extends RefundQuote {
  preview: true;
  reference: string;
  paymentReference: string;
  customer: string;
  customerEmail: string | null;
  amountPaid: number;
  booking: RefundContext["booking"];
  method: PaymentTransaction["method"];
  destination: RefundDraft["destination"];
  reason: string;
  description: string;
  createdAt: string;
  delivery: string;
}
export interface RefundAdapter {
  load: (paymentId: string) => Promise<RefundContext | null>;
  quote: (paymentId: string, draft: RefundDraft) => Promise<RefundQuote>;
  review: (
    paymentId: string,
    draft: RefundDraft,
  ) => Promise<{ message: string; receipt: RefundReceipt }>;
}
