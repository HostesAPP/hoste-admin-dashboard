import { BOOKINGS_DATA } from "../../bookings/data/bookings.data";
import type { PaymentTransaction } from "../types/transactions.types";

// Project the shared booking fixtures rather than maintain a second payment dataset.
export const MOCK_TRANSACTIONS: PaymentTransaction[] = BOOKINGS_DATA.map(
  (booking) => ({
    payment: booking.paymentDetails,
    customerEmail: booking.customerEmail,
    bookingId: booking.id,
    bookingReference: booking.reference,
    method: booking.paymentMethod,
    canRefund: booking.paymentDetails.status === "Successful",
    canRetry: booking.paymentDetails.status === "Failed",
  }),
);

export const MOCK_TRANSACTION_PERIOD_END = BOOKINGS_DATA.reduce(
  (latest, booking) => {
    const date = booking.paymentDetails.createdAt.slice(0, 10);
    return date > latest ? date : latest;
  },
  "",
);
