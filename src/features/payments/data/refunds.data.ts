import type { RefundContext } from "../types/transactions.types";

// Preview-only eligibility snapshots; production balances must come from the backend.
export const MOCK_REFUND_AVAILABLE_AMOUNTS: Readonly<Record<string, number>> = {
  "pay-101": 105000,
  "pay-102": 5000,
  "pay-103": 0,
  "pay-104": 84200,
  "pay-105": 0,
  "pay-106": 450000,
  "pay-107": 196000,
};

export const MOCK_REFUND_REASONS: RefundContext["reasons"] = [
  { value: "customer-request", label: "Customer request" },
  { value: "booking-cancellation", label: "Booking cancellation" },
  { value: "payment-issue", label: "Payment issue" },
  { value: "other", label: "Other" },
];

export const MOCK_REFUND_POLICY =
  "Refunds are processed within 1–3 business days. The customer will be notified once the refund has been processed.";
