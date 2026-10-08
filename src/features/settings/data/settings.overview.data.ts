import type { SettingsCategory } from "../settings.types";

// Overview fixtures, not a platform configuration API contract.
export const SETTINGS_CATEGORIES: SettingsCategory[] = [
  {
    id: "general",
    title: "General",
    description: "Manage basic platform information and branding.",
    items: [
      "Platform Information",
      "Branding",
      "Contact Information",
      "Regional Settings",
    ],
    summary: "Hosté • Nigeria • Africa/Lagos",
    tone: "primary",
    href: "/settings/general",
  },
  {
    id: "access",
    title: "Users & Access",
    description: "Manage administrator access, roles, and permissions.",
    items: [
      "Admin & Roles",
      "Admin Permissions",
      "User Access",
      "Account Status Controls",
    ],
    summary: "5 Admins • 5 Roles",
    tone: "secondary",
    href: "/settings/users-access",
  },
  {
    id: "hoste",
    title: "Hosté Management",
    description:
      "Configure Hosté verification, subscriptions, badges, and commissions.",
    items: [
      "Hosté Verification",
      "Hosté Badge",
      "Hosté Subscription",
      "Hosté Commission Settings",
    ],
    summary: "Verification enabled • Badge active",
    tone: "primary",
    href: "/settings/hoste-management",
  },
  {
    id: "bookings",
    title: "Bookings & Groups",
    description:
      "Manage booking rules, booking types, cancellations, and group settings.",
    items: [
      "Booking Settings & Types",
      "Cancellation Rules",
      "Group Settings",
      "Group Booking Rules",
    ],
    summary: "3 Booking Types • Group bookings enabled",
    tone: "secondary",
    href: "/settings/bookings-groups",
  },
  {
    id: "payments",
    title: "Payments & Finance",
    description:
      "Manage payment processing, escrow, commissions, refunds, and payouts.",
    items: [
      "Payment Gateway & Paystack",
      "Escrow & Commission Settings",
      "Refund & Payout Settings",
    ],
    summary: "Paystack connected • Escrow enabled",
    tone: "primary",
    href: "/settings/payments-finance",
  },
  {
    id: "notifications",
    title: "Notifications",
    description: "Manage platform alerts and preferences.",
    items: [
      "Email & Push Notifications",
      "Booking Alerts",
      "Payment Alerts",
      "Support Alerts",
    ],
    summary: "Email enabled • Push enabled",
    tone: "secondary",
    href: "/notifications",
  },
  {
    id: "content",
    title: "Platform Content",
    description: "Manage content displayed across the Hosté platform.",
    items: ["Banners & Blog", "FAQs", "Help & Support Content"],
    summary: "12 Published Articles • 4 Active Banners",
    tone: "primary",
    href: "/blog",
  },
  {
    id: "security",
    title: "Security",
    description: "Manage authentication and administrative security controls.",
    items: ["Authentication & 2FA", "Session Management", "Login Security"],
    summary: "2FA enabled • Secure sessions active",
    tone: "secondary",
    href: "/settings/configuration",
  },
  {
    id: "system",
    title: "System",
    description:
      "Manage platform availability, preferences, and administrative activity.",
    items: [
      "Maintenance Mode & Availability",
      "System Preferences",
      "Audit Logs",
    ],
    summary: "Platform Online • Maintenance Mode Off",
    tone: "primary",
    href: "/settings/configuration",
  },
];
