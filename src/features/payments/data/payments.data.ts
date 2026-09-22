import { PaymentItem, PayoutItem, RefundItem } from "../types/payments.types";

// PRD v2.2 §04 Fee Alignment: 10% Service Fee + ₦1,000 Platform Flat Fee per Host
export const MOCK_PAYMENTS: PaymentItem[] = [
  {
    id: "pay-101",
    referenceId: "PAY-260918-0012",
    paymentType: "Engagement",
    engagementId: "ENG-260918-9901",
    grossAmount: 150000,
    serviceFee: 15000, // 10% Service Fee
    processingFee: 2250, // 1.5% gateway cost
    status: "Successful",
    retryChainCount: 1,
    payerProfileName: "Luxe Event Planners",
    createdAt: "2026-09-18T10:00:00Z",
  },
  {
    id: "pay-102",
    referenceId: "PAY-260917-8821",
    paymentType: "Verification",
    grossAmount: 5000,
    serviceFee: 0,
    processingFee: 75,
    status: "Successful",
    payerProfileName: "Amara Okonkwo",
    createdAt: "2026-09-17T14:30:00Z",
  },
  {
    id: "pay-103",
    referenceId: "PAY-260915-4411",
    paymentType: "Engagement",
    engagementId: "ENG-260912-8819",
    grossAmount: 200000,
    serviceFee: 20000, // 10% Service Fee
    processingFee: 3000,
    status: "Failed",
    retryChainCount: 3,
    payerProfileName: "Brand Hotel Corporate",
    createdAt: "2026-09-15T09:12:00Z",
  },
];

export const MOCK_PAYOUTS: PayoutItem[] = [
  {
    id: "pyo-201",
    referenceId: "PYO-260918-5001",
    engagementId: "ENG-260918-9901",
    recipientProfileName: "David Host Services",
    bankAccountName: "David Host Services Ltd",
    bankName: "Guaranty Trust Bank",
    accountNumber: "0123456789",
    grossAmount: 150000,
    serviceFee: 15000,
    platformFlatFee: 1000, // ₦1,000 Flat Fee per Host
    processingFee: 2250,
    finalAmount: 131750, // 150,000 - 15,000 (service fee) - 1,000 (flat fee) - 2,250 (processing)
    status: "Pending",
    heldEscrowDays: 3,
    createdAt: "2026-09-18T10:05:00Z",
  },
  {
    id: "pyo-202",
    referenceId: "PYO-260916-4102",
    engagementId: "ENG-260916-1120",
    recipientProfileName: "Kemi Luxe Events",
    bankAccountName: "Kemi Events Concept",
    bankName: "Zenith Bank",
    accountNumber: "2233445566",
    grossAmount: 80000,
    serviceFee: 8000,
    platformFlatFee: 1000,
    processingFee: 1200,
    finalAmount: 69800,
    status: "Successful",
    heldEscrowDays: 5,
    createdAt: "2026-09-16T11:00:00Z",
  },
];

export const MOCK_REFUNDS: RefundItem[] = [
  {
    id: "ref-301",
    referenceId: "REF-260917-009",
    paymentId: "pay-101",
    engagementId: "ENG-260910-101",
    amount: 45000,
    destination: "Original Payment Method",
    processingFee: 0,
    description: "Admin manual refund following client 48h cancellation tier approval.",
    initiatedByStaffId: "sprof-finance-01",
    createdAt: "2026-09-17T16:05:00Z",
  },
];
