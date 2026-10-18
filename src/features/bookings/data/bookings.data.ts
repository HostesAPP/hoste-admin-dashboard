import type { PaymentItem } from "@/features/payments/types/payments.types";
import type { Booking, BookingKPIs } from "../bookings.types";

export interface BookingRow {
  id: string;
  reference: string;
  event: string;
  client: string;
  customerEmail: string;
  hosteAssigned: string;
  date: string;
  location: string;
  amount?: string;
  payment?: "Paid" | "Unpaid" | "Pending";
  status: "Confirmed" | "Pending" | "Completed" | "Cancelled" | "Ongoing";
  type?: string;
}

export type BookingWithPayment = BookingRow & {
  paymentDetails: PaymentItem;
};

export const BOOKINGS_DATA: BookingWithPayment[] = [
  {
    id: "BK-10482",
    reference: "#BK-10482",
    event: "Luxury Corporate Dinner",
    client: "ABC Events Ltd",
    customerEmail: "bookings@abcevents.example",
    hosteAssigned: "Amaka Okafor + 7",
    date: "2026-08-28",
    location: "Victoria Island, Lagos",
    amount: "₦250,000",
    payment: "Paid",
    status: "Confirmed",
    paymentDetails: {
      id: "pay-bk-10482",
      referenceId: "PAY-260827-0482",
      paymentType: "Engagement",
      payerProfileName: "ABC Events Ltd",
      grossAmount: 250000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-27T10:00:00Z",
    },
  },
  {
    id: "BK-10481",
    reference: "#BK-10481",
    event: "Wedding Reception",
    client: "Sarah Events",
    customerEmail: "bookings@sarahevents.example",
    hosteAssigned: "Blessing Eze + 5",
    date: "2026-08-27",
    location: "Lekki, Lagos",
    amount: "₦180,000",
    payment: "Paid",
    status: "Pending",
    paymentDetails: {
      id: "pay-bk-10481",
      referenceId: "PAY-260826-0481",
      paymentType: "Engagement",
      payerProfileName: "Sarah Events",
      grossAmount: 180000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-26T09:30:00Z",
    },
  },
  {
    id: "BK-10480",
    reference: "#BK-10480",
    event: "Product Launch",
    client: "XYZ Brand",
    customerEmail: "events@xyzbrand.example",
    hosteAssigned: "Chiamaka Obi + 3",
    date: "2026-08-25",
    location: "Ikeja, Lagos",
    amount: "₦120,000",
    payment: "Paid",
    status: "Completed",
    paymentDetails: {
      id: "pay-bk-10480",
      referenceId: "PAY-260824-0480",
      paymentType: "Engagement",
      payerProfileName: "XYZ Brand",
      grossAmount: 120000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-24T11:00:00Z",
    },
  },
  {
    id: "BK-10479",
    reference: "#BK-10479",
    event: "Private Gala Night",
    client: "Vanguard Group",
    customerEmail: "events@vanguardgroup.example",
    hosteAssigned: "Amaka Okafor + 11",
    date: "2026-08-24",
    location: "Maitama, Abuja",
    amount: "₦450,000",
    payment: "Paid",
    status: "Confirmed",
    paymentDetails: {
      id: "pay-bk-10479",
      referenceId: "PAY-260823-0479",
      paymentType: "Engagement",
      payerProfileName: "Vanguard Group",
      grossAmount: 450000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-23T14:00:00Z",
    },
  },
  {
    id: "BK-10478",
    reference: "#BK-10478",
    event: "Annual Tech Summit",
    client: "Qodebyte Labs",
    customerEmail: "events@qodebytelabs.example",
    hosteAssigned: "Grace Utomi + 4",
    date: "2026-08-22",
    location: "GRA, Port Harcourt",
    amount: "₦210,000",
    payment: "Paid",
    status: "Completed",
    paymentDetails: {
      id: "pay-bk-10478",
      referenceId: "PAY-260821-0478",
      paymentType: "Engagement",
      payerProfileName: "Qodebyte Labs",
      grossAmount: 210000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-21T08:45:00Z",
    },
  },
  {
    id: "BK-10477",
    reference: "#BK-10477",
    event: "Fashion Week Afterparty",
    client: "Style House",
    customerEmail: "bookings@stylehouse.example",
    hosteAssigned: "Blessing Eze + 8",
    date: "2026-08-20",
    location: "Ikoyi, Lagos",
    amount: "₦320,000",
    payment: "Paid",
    status: "Pending",
    paymentDetails: {
      id: "pay-bk-10477",
      referenceId: "PAY-260819-0477",
      paymentType: "Engagement",
      payerProfileName: "Style House",
      grossAmount: 320000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-19T15:30:00Z",
    },
  },
  {
    id: "BK-10476",
    reference: "#BK-10476",
    event: "VIP Charity Luncheon",
    client: "Grace Foundation",
    customerEmail: "events@gracefoundation.example",
    hosteAssigned: "Amaka Okafor + 2",
    date: "2026-08-18",
    location: "Wuse, Abuja",
    amount: "₦95,000",
    payment: "Paid",
    status: "Completed",
    paymentDetails: {
      id: "pay-bk-10476",
      referenceId: "PAY-260817-0476",
      paymentType: "Engagement",
      payerProfileName: "Grace Foundation",
      grossAmount: 95000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-17T10:15:00Z",
    },
  },
  {
    id: "BK-10475",
    reference: "#BK-10475",
    event: "Business Networking Mixer",
    client: "Nexus Partners",
    customerEmail: "events@nexuspartners.example",
    hosteAssigned: "Grace Utomi + 3",
    date: "2026-08-17",
    location: "Bodija, Ibadan",
    amount: "₦150,000",
    payment: "Paid",
    status: "Pending",
    paymentDetails: {
      id: "pay-bk-10475",
      referenceId: "PAY-260816-0475",
      paymentType: "Engagement",
      payerProfileName: "Nexus Partners",
      grossAmount: 150000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-16T12:00:00Z",
    },
  },
  {
    id: "BK-10474",
    reference: "#BK-10474",
    event: "Brand Anniversary Celebration",
    client: "Bloom Africa",
    customerEmail: "events@bloomafrica.example",
    hosteAssigned: "Chiamaka Obi + 5",
    date: "2026-08-15",
    location: "Enugu Central, Enugu",
    amount: "₦275,000",
    payment: "Paid",
    status: "Cancelled",
    paymentDetails: {
      id: "pay-bk-10474",
      referenceId: "PAY-260814-0474",
      paymentType: "Engagement",
      payerProfileName: "Bloom Africa",
      grossAmount: 275000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-14T09:20:00Z",
    },
  },
  {
    id: "BK-10473",
    reference: "#BK-10473",
    event: "Executive Retreat",
    client: "Summit Holdings",
    customerEmail: "bookings@summitholdings.example",
    hosteAssigned: "Blessing Eze + 6",
    date: "2026-08-12",
    location: "Uyo, Akwa Ibom",
    amount: "₦380,000",
    payment: "Paid",
    status: "Completed",
    paymentDetails: {
      id: "pay-bk-10473",
      referenceId: "PAY-260811-0473",
      paymentType: "Engagement",
      payerProfileName: "Summit Holdings",
      grossAmount: 380000,
      serviceFee: 0,
      processingFee: 0,
      status: "Successful",
      createdAt: "2026-08-11T13:40:00Z",
    },
  },
];

/**
 * Adapt the existing booking records to the Booking type used by useBookings.
 * Keep BOOKINGS_DATA unchanged for screens that rely on paymentDetails.
 */
export const MOCK_BOOKINGS: Booking[] = BOOKINGS_DATA.map((item) => ({
  id: item.id,
  bookingCode: item.reference,
  customerName: item.client,
  customerEmail: item.customerEmail,
  hostName: item.hosteAssigned,
  brandName: item.client,
  eventName: item.event,
  eventCategory: item.type ?? "Event",
  eventDate: item.date,
  location: item.location,
  guestCount: 0,
  status: item.status,
  totalAmount: Number((item.amount ?? "0").replace(/[₦,\s]/g, "")),
  currency: "NGN",
  paymentStatus:
    item.payment === "Paid"
      ? "Paid"
      : item.payment === "Unpaid"
        ? "Failed"
        : "Pending",
  payoutStatus: "Pending",
  createdAt: item.paymentDetails.createdAt,
}));

export const MOCK_BOOKINGS_KPIS: BookingKPIs = {
  totalBookings: MOCK_BOOKINGS.length,
  confirmedBookings: MOCK_BOOKINGS.filter(
    (booking) => booking.status === "Confirmed",
  ).length,
  ongoingBookings: MOCK_BOOKINGS.filter(
    (booking) => booking.status === "Ongoing",
  ).length,
  completedBookings: MOCK_BOOKINGS.filter(
    (booking) => booking.status === "Completed",
  ).length,
  cancelledBookings: MOCK_BOOKINGS.filter(
    (booking) => booking.status === "Cancelled",
  ).length,
  disputedBookings: MOCK_BOOKINGS.filter(
    (booking) => booking.status === "Disputed",
  ).length,
  totalRevenue: MOCK_BOOKINGS.reduce(
    (total, booking) => total + booking.totalAmount,
    0,
  ),
};
