import type {
  NotificationSettings,
  NotificationSettingsSnapshot,
} from "../settings.notifications.types";

const events = (
  id: string,
  labels: string[],
  pushDisabled: string[] = [],
): NotificationSettings["eventGroups"][number]["events"] =>
  labels.map((label, index) => ({
    id: `${id}-${index + 1}`,
    label,
    email: true,
    push: !pushDisabled.includes(label),
  }));

const preferenceCategories = () => [
  {
    id: "bookings",
    label: "Booking Updates",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "payments",
    label: "Payment Receipts",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "support",
    label: "Support & Messages",
    email: true,
    push: true,
    sms: false,
  },
  {
    id: "promotions",
    label: "Promotions & Offers",
    email: true,
    push: false,
    sms: false,
  },
  {
    id: "security",
    label: "Security Alerts",
    email: true,
    push: true,
    sms: true,
  },
];

const INITIAL_NOTIFICATION_SETTINGS: Omit<
  NotificationSettingsSnapshot,
  "defaults"
> = {
  canManage: true,
  stats: [
    { label: "Total Types", value: "48", detail: "Active" },
    {
      label: "Email Notifications",
      value: "42",
      detail: "87.5%",
      tone: "secondary",
    },
    {
      label: "Push Notifications",
      value: "36",
      detail: "75.0%",
      tone: "secondary",
    },
    {
      label: "SMS Notifications",
      value: "18",
      detail: "37.5%",
      tone: "destructive",
    },
    { label: "Active Alerts", value: "44", tone: "warning" },
    { label: "Disabled Alerts", value: "4" },
  ],
  channels: [
    {
      id: "EMAIL",
      label: "Email",
      description:
        "Send transactional and platform notifications to users via SMTP/SendGrid.",
      status: "Connected",
    },
    {
      id: "PUSH",
      label: "Push Notifications",
      description:
        "Deliver real-time mobile and web push alerts using Firebase Cloud Messaging.",
      status: "Active",
    },
    {
      id: "SMS",
      label: "SMS",
      description:
        "Send urgent SMS alerts and OTPs through Termii / Twilio gateway.",
      status: "Disabled",
    },
  ],
  settings: {
    channels: [
      {
        id: "EMAIL",
        enabled: true,
        configuration: {
          provider: "SendGrid API",
          sender: "Hosté Support & Bookings",
          senderEmail: "notifications@hoste.com",
          replyTo: "support@hoste.com",
        },
      },
      {
        id: "PUSH",
        enabled: true,
        configuration: {
          provider: "Firebase Cloud Messaging",
          sender: "Hosté",
        },
      },
      {
        id: "SMS",
        enabled: false,
        configuration: { provider: "Termii", sender: "Hoste" },
      },
    ],
    userPreferences: [
      {
        id: "customers",
        categories: preferenceCategories(),
        label: "Customers (Students)",
        email: true,
        push: true,
        sms: false,
      },
      {
        id: "hostes",
        categories: preferenceCategories(),
        label: "Hostés (Property Owners)",
        email: true,
        push: true,
        sms: true,
      },
      {
        id: "brands",
        categories: preferenceCategories(),
        label: "Brand Users",
        email: true,
        push: true,
        sms: false,
      },
      {
        id: "planners",
        categories: preferenceCategories(),
        label: "Event Planners",
        email: true,
        push: true,
        sms: false,
      },
      {
        id: "admins",
        categories: preferenceCategories(),
        label: "Admins & Operations",
        email: true,
        push: true,
        sms: true,
      },
    ],
    eventGroups: [
      {
        id: "bookings",
        title: "Booking Notifications",
        heading: "Event Type",
        events: events("bookings", [
          "New Booking Request",
          "Booking Confirmed",
          "Booking Cancelled",
          "Booking Rescheduled",
          "Booking Completed",
          "Hosté Assigned",
          "Hosté Reassigned",
          "Booking Reminder",
        ]),
      },
      {
        id: "lifecycle",
        title: "Hosté Lifecycle Notifications",
        heading: "Hosté Event",
        events: events(
          "lifecycle",
          [
            "Hosté Registration",
            "Verification Submitted",
            "Verification Approved",
            "Verification Rejected",
            "Subscription Activated",
            "Subscription Expiring",
            "Subscription Expired",
            "Verify Badge Activated",
            "Verify Badge Expiring",
            "Account Suspended",
            "Account Reactivated",
          ],
          ["Verification Submitted"],
        ),
      },
      {
        id: "support",
        title: "Customer Support Alerts",
        heading: "Support Event",
        events: events(
          "support",
          [
            "New Support Ticket",
            "Ticket Assigned",
            "Ticket Reply",
            "Ticket Status Changed",
            "Ticket Resolved",
            "Escalated Ticket (Urgent)",
          ],
          ["Ticket Resolved"],
        ),
      },
      {
        id: "finance",
        title: "Payment & Finance Alerts",
        heading: "Financial Event",
        events: events(
          "finance",
          [
            "Payment Successful",
            "Payment Failed",
            "Refund Processed",
            "Refund Failed",
            "Payout Processed",
            "Payout Failed",
            "Escrow Released",
            "Escrow Held / Dispute Raised",
            "Commission Deducted",
          ],
          ["Commission Deducted"],
        ),
      },
      {
        id: "groups",
        title: "Group Booking & Collaboration",
        heading: "Group Event",
        events: events(
          "groups",
          [
            "Group Created",
            "Member Added / Removed",
            "Group Invitation",
            "Group Booking Request",
            "Group Booking Confirmed",
            "Group Booking Cancelled",
            "Group Leader Changed",
          ],
          ["Group Leader Changed"],
        ),
      },
      {
        id: "security",
        title: "System & Security Alerts",
        heading: "Security Event",
        events: events(
          "security",
          [
            "New Admin Account Created",
            "Admin Invitation",
            "Role / Permission Changed",
            "Suspicious Login Detected",
            "Failed Login Attempts",
            "Account Suspended / Reactivated",
            "System Maintenance / Outage",
          ],
          ["Admin Invitation"],
        ),
      },
    ],
    bookingReminderLeadTime: "24 Hours & 48 Hours before check-in",
    subscriptionReminders: "30, 14, 7, and 1 day before expiry",
    quietHours: true,
    quietStart: "22:00",
    quietEnd: "07:00",
    enableNewTypes: true,
    allowMarketingOptOut: true,
    allowUserPreferences: true,
    automaticTransactional: true,
    retryFailed: true,
    maxRetries: 3,
    templates: [
      {
        id: "booking-email",
        channel: "EMAIL",
        name: "Booking Confirmation",
        subject: "Your booking is confirmed",
        body: "Your booking has been confirmed. View the booking details in your Hosté account.",
      },
      {
        id: "payment-push",
        channel: "PUSH",
        name: "Payment Receipt",
        subject: "Payment received",
        body: "Your payment receipt is available in your Hosté account.",
      },
      {
        id: "expiry-sms",
        channel: "SMS",
        name: "Subscription Expiry",
        subject: "Subscription reminder",
        body: "Your Hosté subscription is expiring soon. Review your subscription in your account.",
      },
    ],
  },
  templateSummaries: [
    {
      channel: "EMAIL",
      label: "Email Templates",
      summary: "32 Active HTML templates · SendGrid Engine",
    },
    {
      channel: "PUSH",
      label: "Push Notification Templates",
      summary: "24 Active Push payload formats",
    },
    {
      channel: "SMS",
      label: "SMS Templates",
      summary: "12 Registered DLT SMS templates",
    },
  ],
  activity: [
    {
      id: "notification-1",
      notification: "Booking Confirmation Sent",
      recipient: "chidi.o@gmail.com",
      channel: "Email",
      date: "Aug 24, 2026 · 11:42 AM",
      status: "Delivered",
    },
    {
      id: "notification-2",
      notification: "Payment Receipt Notification",
      recipient: "grace.care@store.com",
      channel: "Email & Push",
      date: "Aug 24, 2026 · 11:30 AM",
      status: "Sent",
    },
    {
      id: "notification-3",
      notification: "Subscription Expiry Reminder",
      recipient: "+234 803 456 7890",
      channel: "SMS",
      date: "Aug 24, 2026 · 10:15 AM",
      status: "Failed",
    },
    {
      id: "notification-4",
      notification: "Escrow Release Alert",
      recipient: "hoste_lounge@domain.com",
      channel: "Push",
      date: "Aug 24, 2026 · 09:00 AM",
      status: "Delivered",
    },
  ],
};

export const MOCK_NOTIFICATION_SETTINGS: NotificationSettingsSnapshot = {
  ...INITIAL_NOTIFICATION_SETTINGS,
  defaults: structuredClone(INITIAL_NOTIFICATION_SETTINGS.settings),
};
