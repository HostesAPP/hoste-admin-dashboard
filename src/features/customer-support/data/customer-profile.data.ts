// features/customer-support/data/customer-profile.data.ts

import { CustomerProfileData } from "../customer-support.types";

export const MOCK_CUSTOMER_PROFILES: CustomerProfileData[] = [
  {
    id: "conv-001",
    customerCode: "CUS-001245",
    customerName: "Sarah Johnson",
    customerAvatar: "/avatar-placeholder.png",
    customerInitial: "S",
    isVerified: true,
    customerStatus: "Active",
    email: "Sarahjohnson@gmail.com",
    phone: "+234 812 346 6789",
    location: "Lagos Nigeria",
    joinedDate: "Joined on March 12, 2026",
    about:
      "Sarah is regular customer who books premium hosts for corporate events. She prefers communication via Whatsapp and usually books on weekend.",
    accountSummary: {
      totalBookings: 12,
      totalSpent: "1,245,000.00",
      outstandingBalance: "0",
      completedBookings: 9,
      cancelledBookings: 3,
      noShowBookings: 1,
    },
    overviewStats: {
      accountStatus: "Active",
      verificationStatus: "Verified",
      customerSince: "March 12, 2026",
      lastActive: "Jul 30, 2026 (10:45am)",
    },
    recentActivities: [
      {
        id: "act-1",
        type: "booking",
        title: "New booking created: Wedding Reception",
        timestamp: "Jul 28, 2026 . 10:30 AM",
      },
      {
        id: "act-2",
        type: "payment",
        title: "Payment of 120,000 was completed",
        timestamp: "Jul 30, 2026 . 11:20 AM",
      },
      {
        id: "act-3",
        type: "support",
        title: "Support ticket: Billing issue",
        timestamp: "Jun 29, 2026 . 10:30 AM",
      },
      {
        id: "act-4",
        type: "resolved",
        title: "Ticket resolved by Admin",
        timestamp: "Jul 28, 2026 . 10:30 AM",
      },
      {
        id: "act-5",
        type: "booking",
        title: "New booking created: Co-operate event",
        timestamp: "Aug 28, 2026 . 10:30 AM",
      },
      {
        id: "act-6",
        type: "booking",
        title: "New booking created: Wedding Reception",
        timestamp: "Feb 28, 2026 . 10:30 AM",
      },
    ],
    supportSummary: {
      total: 7,
      open: 2,
      underReview: 1,
      closed: 1,
      resolved: 3,
      closedSecond: 1,
    },
    internalNotes: [
      {
        id: "note-1",
        content: "Prefers whatsApp for quick communication.",
        author: "Super Admin",
        timestamp: "Jul 29, 2026 . 02:50 PM",
        variant: "amber",
      },
      {
        id: "note-2",
        content: "Had a billing issue resolved on Jul 29, 2026.",
        author: "Admin",
        timestamp: "Jul 29, 2026 . 11:50 AM",
        variant: "emerald",
      },
    ],
  },
];
