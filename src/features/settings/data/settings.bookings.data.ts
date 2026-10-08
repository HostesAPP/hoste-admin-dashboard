import type {
  BookingControlGroup,
  BookingsSettingsSnapshot,
} from "../settings.bookings.types";

// Screenshot fixtures. No refunds, assignment decisions, or status transitions are calculated here.
export const MOCK_BOOKINGS_SETTINGS: BookingsSettingsSnapshot = {
  canManage: true,
  stats: [
    {
      label: "Total Bookings",
      value: "24,892",
      detail: "+12% ↑",
      tone: "secondary",
    },
    {
      label: "Pending Bookings",
      value: "142",
      detail: "Action",
      tone: "primary",
    },
    {
      label: "Confirmed Bookings",
      value: "18,450",
      detail: "74.1%",
      tone: "secondary",
    },
    {
      label: "Cancelled Bookings",
      value: "1,204",
      detail: "4.8%",
      tone: "destructive",
    },
    {
      label: "Active Groups",
      value: "856",
      detail: "+5% ↑",
      tone: "secondary",
    },
    {
      label: "Group Bookings",
      value: "5,196",
      detail: "20.8%",
      tone: "neutral",
    },
  ],
  settings: {
    allowBookings: true,
    confirmation: true,
    cancellation: true,
    rescheduling: true,
    hostAcceptance: true,
    autoConfirm: false,
    bookingTypes: [
      {
        id: "full-time",
        name: "Full-Time",
        description: "Dedicated long-term continuous staffing for residences",
        enabled: true,
        commissionPercent: 15,
        requirements: "Min 30 days | Approval Required",
      },
      {
        id: "contract",
        name: "Contract",
        description: "Fixed-term short project or event seasonal coverage",
        enabled: true,
        commissionPercent: 12,
        requirements: "Fixed Dates | Deposit Required",
      },
      {
        id: "on-demand",
        name: "On-Demand",
        description: "Flexible hourly engagement for emergency / event needs",
        enabled: true,
        commissionPercent: 18,
        requirements: "Instant Confirm | Min 4 hrs",
      },
      {
        id: "vip",
        name: "VIP Group Event",
        description:
          "Exclusive multi-staff coordinated luxury concierge service",
        enabled: false,
        commissionPercent: 20,
        requirements: "Custom Scope | Admin Lead",
      },
    ],
    leadHours: "24",
    advanceDays: "90",
    eventDetails: true,
    eventDate: true,
    eventLocation: true,
    guestCount: true,
    serviceDetails: true,
    customerCancellation: true,
    hostCancellation: true,
    cancellationDeadlineHours: 48,
    cancellationFee: 25,
    cancellationCurrency: "USD",
    refundPercent: 80,
    policyRescheduling: true,
    reschedulingDeadlineHours: 24,
    groupsEnabled: true,
    groupCreation: true,
    adminGroupCreation: true,
    leaderManageMembers: true,
    leaderInvite: true,
    leaderRequired: true,
    groupCreationApproval: false,
    memberRemoval: true,
    groupBookings: true,
    groupLeaderApproval: true,
    groupAdminApproval: false,
    memberBookingRequests: true,
    leaderConfirmBooking: true,
    groupCancellation: true,
    groupRescheduling: true,
    minGroupSize: 5,
    maxGroupSize: 50,
    maxGroupsPerUser: 3,
    maxBookingMembers: 25,
    automaticAssignment: true,
    reassignmentAfterConfirmation: false,
    adminReassignment: true,
    reassignmentApproval: true,
    customerReassignment: true,
    expirePending: true,
    expirationHours: "24",
    notifyUser: true,
    notifyHost: true,
  },
};

export const BOOKING_CONTROL_GROUPS: BookingControlGroup[] = [
  {
    id: "general-bookings",
    title: "General Booking Configuration",
    columns: 2,
    fields: [
      {
        name: "allowBookings",
        label: "Allow New Bookings",
        description: "Allow users to create new bookings on the platform.",
      },
      {
        name: "confirmation",
        label: "Require Booking Confirmation",
        description: "Require confirmation before a booking becomes active.",
      },
      {
        name: "cancellation",
        label: "Allow Booking Cancellation",
        description:
          "Allow users to cancel according to the cancellation policy.",
      },
      {
        name: "rescheduling",
        label: "Allow Booking Rescheduling",
        description:
          "Allow eligible bookings to be rescheduled within the timeframe.",
      },
      {
        name: "hostAcceptance",
        label: "Require Hosté Acceptance",
        description:
          "Require the assigned Hosté to accept a booking request manually.",
      },
      {
        name: "autoConfirm",
        label: "Auto-Confirm Eligible Bookings",
        description: "Bypass manual review for instant-book verified accounts.",
      },
    ],
  },
  {
    id: "request-requirements",
    title: "Booking Request Requirements",
    columns: 1,
    fields: [
      { name: "eventDetails", label: "Require Event Details Before Booking" },
      { name: "eventDate", label: "Require Event Date" },
      { name: "eventLocation", label: "Require Event Location" },
      { name: "guestCount", label: "Require Guest Count" },
      { name: "serviceDetails", label: "Require Service Details" },
    ],
  },
  {
    id: "cancellation",
    title: "Cancellation & Rescheduling Policies",
    columns: 1,
    fields: [
      { name: "customerCancellation", label: "Allow Customer Cancellation" },
      { name: "hostCancellation", label: "Allow Hosté Cancellation" },
    ],
  },
  {
    id: "group-rules",
    title: "Platform-Wide Group Settings",
    columns: 2,
    fields: [
      {
        name: "groupsEnabled",
        label: "Enable Groups Platform-Wide",
        description:
          "Master switch to enable multi-user group structures across Hosté.",
      },
      {
        name: "groupCreation",
        label: "Allow Group Creation",
        description:
          "Permit standard users to form new public or private groups.",
      },
      {
        name: "adminGroupCreation",
        label: "Allow Admin to Create Groups",
        description: "Allow administrators to create managed groups.",
      },
      {
        name: "leaderManageMembers",
        label: "Allow Group Leaders to Manage Members",
        description:
          "Group leaders can edit member roles, titles, and permissions.",
      },
      {
        name: "leaderInvite",
        label: "Allow Group Leader to Invite Members",
        description:
          "Enable direct invite links and email invitations sent by leaders.",
      },
      {
        name: "leaderRequired",
        label: "Require Group Leader Designation",
        description:
          "Every active group must have at least one assigned leader.",
      },
      {
        name: "groupCreationApproval",
        label: "Require Admin Approval for Group Creation",
        description:
          "New user-created groups remain pending until admin review.",
      },
      {
        name: "memberRemoval",
        label: "Allow Group Member Removal",
        description:
          "Leaders or admins may remove inactive or violating members.",
      },
    ],
  },
  {
    id: "group-bookings",
    title: "Group Booking Operational Rules",
    columns: 1,
    fields: [
      {
        name: "groupBookings",
        label: "Allow Group Bookings",
        description: "Groups can book Hosté staff collectively.",
      },
      {
        name: "groupLeaderApproval",
        label: "Require Group Leader Approval",
        description: "Group leader must sign off before checkout.",
      },
      {
        name: "groupAdminApproval",
        label: "Require Admin Approval",
        description: "Admin verification for group booking requests.",
      },
      {
        name: "memberBookingRequests",
        label: "Allow Members to Request Booking",
        description: "Regular members can propose group bookings.",
      },
      {
        name: "leaderConfirmBooking",
        label: "Allow Group Leader to Confirm Booking",
        description: "Leader has final authority to authorize payment.",
      },
      { name: "groupCancellation", label: "Allow Group Booking Cancellation" },
      { name: "groupRescheduling", label: "Allow Group Booking Rescheduling" },
    ],
  },
  {
    id: "assignment",
    title: "Hosté Assignment & Reassignment Rules",
    columns: 2,
    fields: [
      {
        name: "automaticAssignment",
        label: "Allow Automatic Hosté Assignment",
        description: "Route requests automatically to an available Hosté.",
      },
      {
        name: "reassignmentAfterConfirmation",
        label: "Allow Hosté Reassignment After Confirmation",
        description: "Permit changes even after a booking has been confirmed.",
      },
      {
        name: "adminReassignment",
        label: "Allow Admin Reassignment",
        description: "Admins can override and swap assigned Hostés.",
      },
      {
        name: "reassignmentApproval",
        label: "Require Admin Approval for Reassignment",
        description: "Hosté swaps require explicit administrative approval.",
      },
      {
        name: "customerReassignment",
        label: "Allow Customer to Request Reassignment",
        description:
          "Customers can submit a request for a different staff member.",
      },
    ],
  },
  {
    id: "expiration",
    title: "Pending Booking Expiration Rules",
    columns: 2,
    fields: [
      {
        name: "expirePending",
        label: "Automatically Expire Pending Bookings",
        description:
          "Unaccepted requests expire after the configured deadline.",
      },
      {
        name: "notifyUser",
        label: "Notify User Before Expiration",
        description: "Send a reminder before the request expires.",
      },
      {
        name: "notifyHost",
        label: "Notify Hosté Before Expiration",
        description: "Alert assigned staff about the pending booking.",
      },
    ],
  },
];
