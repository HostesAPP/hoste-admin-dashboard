import { MOCK_PAYMENTS, MOCK_REFUNDS } from "./payments.data";
import type {
  PaymentTransaction,
  RefundContext,
} from "../types/transactions.types";

export const MOCK_TRANSACTIONS: PaymentTransaction[] = [
  {
    payment: MOCK_PAYMENTS[0],
    customerEmail: "bookings@luxeevents.example",
    bookingReference: MOCK_PAYMENTS[0].engagementId ?? null,
    method: "CREDIT_CARD",
    canRefund: true,
    canRetry: false,
  },
  {
    payment: MOCK_PAYMENTS[1],
    customerEmail: "amara@example.com",
    bookingReference: null,
    method: "BANK_TRANSFER",
    canRefund: true,
    canRetry: false,
  },
  {
    payment: MOCK_PAYMENTS[2],
    customerEmail: "accounts@brandhotel.example",
    bookingReference: MOCK_PAYMENTS[2].engagementId ?? null,
    method: "CREDIT_CARD",
    canRefund: false,
    canRetry: true,
  },
  ...[
    {
      id: "pay-104",
      referenceId: "PAY-260918-0013",
      payerProfileName: "Arlene McCoy",
      grossAmount: 84200,
      status: "Successful" as const,
      method: "PAYPAL" as const,
      date: "2026-09-18T09:00:00Z",
    },
    {
      id: "pay-105",
      referenceId: "PAY-260917-0014",
      payerProfileName: "Robert Fox",
      grossAmount: 21400,
      status: "Pending" as const,
      method: "BANK_TRANSFER" as const,
      date: "2026-09-17T14:00:00Z",
    },
    {
      id: "pay-106",
      referenceId: "PAY-260916-0015",
      payerProfileName: "Esther Howard",
      grossAmount: 450000,
      status: "Successful" as const,
      method: "CREDIT_CARD" as const,
      date: "2026-09-16T11:00:00Z",
    },
    {
      id: "pay-107",
      referenceId: "PAY-260915-0016",
      payerProfileName: "Devon Lane",
      grossAmount: 196000,
      status: "Successful" as const,
      method: "PAYPAL" as const,
      date: "2026-09-15T10:00:00Z",
    },
  ].map((item) => ({
    payment: {
      id: item.id,
      referenceId: item.referenceId,
      paymentType: "Verification" as const,
      payerProfileName: item.payerProfileName,
      grossAmount: item.grossAmount,
      serviceFee: 0,
      processingFee: 0,
      status: item.status,
      createdAt: item.date,
    },
    customerEmail: `${item.payerProfileName.toLowerCase().replaceAll(" ", ".")}@example.com`,
    bookingReference: null,
    method: item.method,
    canRefund: item.status === "Successful",
    canRetry: false,
  })),
];
export const MOCK_TRANSACTION_PERIOD_END = "2026-09-18";
export const MOCK_REFUND_CONTEXTS: RefundContext[] = MOCK_TRANSACTIONS.map(
  (transaction) => ({
    transaction,
    // Mock eligibility supplied by the adapter, not a frontend refund calculation.
    availableAmount:
      transaction.payment.id === "pay-101"
        ? 105000
        : transaction.canRefund
          ? transaction.payment.grossAmount
          : 0,
    booking:
      transaction.payment.id === "pay-101"
        ? {
            reference: transaction.bookingReference!,
            title: "Wedding Ceremony",
            status: "Completed",
            date: "2026-09-18T16:00:00Z",
            location: "Banquet Hall, Lekki, Lagos",
            hostCount: 8,
            imageUrl:
              "https://images.unsplash.com/photo-1519167758481-83f550bb49b3?auto=format&fit=crop&w=240&q=80",
          }
        : null,
    reasons: [
      { value: "customer-request", label: "Customer request" },
      { value: "booking-cancellation", label: "Booking cancellation" },
      { value: "payment-issue", label: "Payment issue" },
      { value: "other", label: "Other" },
    ],
    policy:
      "Refunds are processed within 1–3 business days. The customer will be notified once the refund has been processed.",
    recentRefunds: MOCK_REFUNDS.filter(
      (refund) => refund.paymentId === transaction.payment.id,
    ).map((refund) => ({
      id: refund.id,
      reference: refund.referenceId,
      amount: refund.amount,
      date: refund.createdAt,
      status: "Completed",
    })),
  }),
);
