import type { RefundContext } from "../types/transactions.types";

// Preview-only eligibility snapshots; production balances must come from the backend.
export const MOCK_REFUND_AVAILABLE_AMOUNTS: Readonly<Record<string, number>> = {
  "pay-bk-10482": 205000,
  "pay-bk-10481": 180000,
  "pay-bk-10480": 120000,
  "pay-bk-10479": 450000,
  "pay-bk-10478": 210000,
  "pay-bk-10477": 320000,
  "pay-bk-10476": 95000,
  "pay-bk-10475": 150000,
  "pay-bk-10474": 275000,
  "pay-bk-10473": 380000,
};

export const MOCK_REFUND_REASONS: RefundContext["reasons"] = [
  { value: "customer-request", label: "Customer request" },
  { value: "booking-cancellation", label: "Booking cancellation" },
  { value: "payment-issue", label: "Payment issue" },
  { value: "other", label: "Other" },
];

export const MOCK_REFUND_POLICY =
  "Refunds are processed within 1–3 business days. The customer will be notified once the refund has been processed.";
