import { PaymentItem, PayoutItem, RefundItem } from "../types/payments.types";
import { BOOKINGS_DATA } from "../../bookings/data/bookings.data";

export const MOCK_PAYMENTS: PaymentItem[] = BOOKINGS_DATA.map(
  (booking) => booking.paymentDetails,
);

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
    platformFlatFee: 1000,
    processingFee: 2250,
    finalAmount: 131750,
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
    paymentId: BOOKINGS_DATA[0].paymentDetails.id,
    amount: 45000,
    destination: "Original Payment Method",
    processingFee: 0,
    description:
      "Admin manual refund following client 48h cancellation tier approval.",
    initiatedByStaffId: "sprof-finance-01",
    createdAt: "2026-09-17T16:05:00Z",
  },
];
