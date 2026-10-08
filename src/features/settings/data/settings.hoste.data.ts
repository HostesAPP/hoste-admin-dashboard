import type { HosteSnapshot } from "../settings.hoste.types";

// Screenshot fixtures only; rates are not production fee rules.
export const MOCK_HOSTE_SETTINGS: HosteSnapshot = {
  canManage: true,
  stats: [
    { label: "Total Hostés", value: "1,248", detail: "+12%", tone: "neutral" },
    {
      label: "Verified Hostés",
      value: "940",
      detail: "75%",
      tone: "secondary",
    },
    {
      label: "Pending Verification",
      value: "42",
      detail: "Action",
      tone: "primary",
    },
    {
      label: "Active Subscriptions",
      value: "885",
      detail: "Active",
      tone: "secondary",
    },
    { label: "Expiring Soon", value: "18", detail: "7 days", tone: "primary" },
    { label: "Suspended", value: "14", detail: "", tone: "neutral" },
  ],
  settings: {
    registrations: true,
    approval: true,
    identity: true,
    autoApprove: false,
    badgeFee: 5000,
    badgeDuration: "1 Month",
    badgeVerification: true,
    badgeRenewal: false,
    reviewMethod: "Manual Review",
    requirements: [
      {
        id: "government-id",
        name: "Government-issued ID (Passport, Driver's License, NIN)",
        required: true,
        enabled: true,
      },
      {
        id: "profile-photo",
        name: "Profile Photo (Headshot Verification)",
        required: true,
        enabled: true,
      },
      {
        id: "address",
        name: "Proof of Address (Utility Bill, Bank Statement)",
        required: false,
        enabled: true,
      },
      {
        id: "reference",
        name: "Relevant Hospitality Certification / Reference",
        required: false,
        enabled: false,
      },
    ],
    plans: [
      {
        id: "starter",
        name: "Starter Hosté",
        duration: "1 Month",
        price: 15000,
        activeHosts: 420,
        enabled: true,
        note: "",
      },
      {
        id: "quarterly",
        name: "Pro Hosté Quarterly",
        duration: "3 Months",
        price: 40000,
        activeHosts: 315,
        enabled: true,
        note: "",
      },
      {
        id: "annual",
        name: "Annual Hosté VIP",
        duration: "12 Months",
        price: 140000,
        activeHosts: 150,
        enabled: true,
        note: "",
      },
      {
        id: "trial",
        name: "Trial Membership",
        duration: "14 Days",
        price: 0,
        activeHosts: 0,
        enabled: false,
        note: "",
      },
    ],
    commissions: [
      {
        id: "full-time",
        category: "Full-Time Hosté Rule",
        type: "Percentage (%)",
        value: 35,
        status: "Active",
      },
      {
        id: "contract",
        category: "Contract Hosté Rule",
        type: "Percentage (%)",
        value: 30,
        status: "Active",
      },
      {
        id: "base",
        category: "Platform Booking Base Commission",
        type: "Percentage (%)",
        value: 20,
        status: "Default",
      },
    ],
    defaultCommission: 20,
    defaultCommissionType: "Percentage (%)",
    deactivate: true,
    pause: true,
    reactivationApproval: true,
    suspendExpired: true,
    restrictUnverified: true,
    reminders: true,
    reminderDays: [30, 14, 7, 1],
    notifyHost: true,
    notifyAdmin: true,
    restrictExpired: true,
    customAvailability: true,
    requireAvailability: true,
    rejectRequests: true,
    disputeIntervention: true,
  },
};

export const HOSTE_CONTROL_GROUPS = [
  {
    title: "Registration & Approval Settings",
    fields: [
      [
        "registrations",
        "Allow New Hosté Registrations",
        "Allow new Hostés to create accounts on the platform.",
      ],
      [
        "approval",
        "Require Hosté Approval",
        "Require an admin to approve a Hosté before they can operate.",
      ],
      [
        "identity",
        "Require Identity Verification",
        "Require Hostés to submit government identity verification documents.",
      ],
      [
        "autoApprove",
        "Auto-Approve Verified Hostés",
        "Automatically approve Hostés upon successful ID verification.",
      ],
    ],
  },
  {
    title: "Account & Status Controls",
    fields: [
      [
        "deactivate",
        "Allow Hosté to Deactivate Account",
        "Hostés can self-deactivate from their dashboard.",
      ],
      [
        "pause",
        "Allow Hosté to Pause Availability",
        "Hostés can temporarily hide their profile.",
      ],
      [
        "reactivationApproval",
        "Require Approval for Reactivation",
        "Admin approval needed after self-deactivation or pause.",
      ],
      [
        "suspendExpired",
        "Automatically Suspend Expired Subscriptions",
        "Account suspension after subscription expiry.",
      ],
      [
        "restrictUnverified",
        "Automatically Restrict Unverified Hostés",
        "Limit booking requests for accounts pending ID submission.",
      ],
    ],
  },
  {
    title: "Expiry Alerts & Automation",
    fields: [
      [
        "reminders",
        "Enable Expiry Reminders",
        "Send automated notifications prior to subscription end.",
      ],
      [
        "notifyHost",
        "Notify Hosté (Email & Push)",
        "Send renewal links directly to registered contacts.",
      ],
      [
        "notifyAdmin",
        "Notify Admin Summary",
        "Include expiring Hostés in daily operations summaries.",
      ],
      [
        "restrictExpired",
        "Auto-Restrict Expired Hosté",
        "Delist profiles after subscription expiration.",
      ],
    ],
  },
  {
    title: "Performance & Availability Rules",
    fields: [
      [
        "customAvailability",
        "Allow Hosté to Set Custom Availability",
        "Hostés can block calendar dates and set working hours.",
      ],
      [
        "requireAvailability",
        "Require Availability Before Booking",
        "Require a configured calendar before booking requests.",
      ],
      [
        "rejectRequests",
        "Allow Hosté to Reject Booking Requests",
        "Hostés can decline incoming booking requests.",
      ],
      [
        "disputeIntervention",
        "Require Admin Intervention for Disputes",
        "Route disputes to the administrative support queue.",
      ],
    ],
  },
] as const;
