import { initialUsers } from "@/features/users/data/users.data";
import {
  ACCESS_SECTIONS,
  ACCESS_ACTIONS,
  type AccessPermissions,
  type AccessSnapshot,
} from "../settings.access.types";

function permissions(
  sections: readonly string[],
  actions: readonly (typeof ACCESS_ACTIONS)[number][] = ["View", "Manage"],
) {
  return Object.fromEntries(
    ACCESS_SECTIONS.map((section) => [
      section,
      sections.includes(section) ? [...actions] : ["View"],
    ]),
  ) as AccessPermissions;
}
const ROLES = [
  {
    id: "SUPER_ADMIN",
    name: "Super Admin",
    description:
      "Full system control, platform security, finance & access rules",
    scope: ["All Scope", "Role Management", "System Audit"],
    permissions: permissions(ACCESS_SECTIONS, ACCESS_ACTIONS),
    system: true,
  },
  {
    id: "OPERATIONS",
    name: "Operations",
    description:
      "Manages host listings, property approvals, and daily operations",
    scope: ["Host Approvals", "Listings Edit", "Booking Override"],
    permissions: permissions(
      ["Profiles", "Bookings", "Users", "Support Tickets"],
      ["View", "Create", "Edit", "Manage"],
    ),
    system: true,
  },
  {
    id: "FINANCE",
    name: "Finance",
    description:
      "Manages payments, host payouts, commissions, and revenue reporting",
    scope: ["Payments", "Host Payouts", "Revenue Exports"],
    permissions: permissions(["Payments", "Reports"]),
    system: true,
  },
  {
    id: "CUSTOMER_SUPPORT",
    name: "Customer Support",
    description:
      "Views booking details, handles tickets, and manages guest inquiries",
    scope: ["Ticket Access", "Guest Lookup", "Read Only PII"],
    permissions: permissions(["Bookings", "Support Tickets", "Notifications"]),
    system: true,
  },
  {
    id: "MODERATOR",
    name: "Moderator",
    description:
      "Reviews community content, guest reviews, and public listings",
    scope: ["Review Approval", "Content Moderation"],
    permissions: permissions(["Profiles", "Users", "Notifications"]),
    system: true,
  },
  {
    id: "VERIFICATION_OFFICER",
    name: "Verification Officer",
    description: "Reviews identity records and Hosté verification documents",
    scope: ["Profile Verification", "Identity Review"],
    permissions: permissions(["Profiles", "Users"]),
    system: true,
  },
];
const primaryAdmin = initialUsers.find((user) => user.id === "usr-00001")!;

export const MOCK_ACCESS_SNAPSHOT: AccessSnapshot = {
  canManage: true,
  roles: ROLES,
  admins: [
    {
      id: primaryAdmin.id,
      userId: primaryAdmin.id,
      name: primaryAdmin.name,
      email: primaryAdmin.email,
      roleId: "SUPER_ADMIN",
      status: "Active",
      permissions: ROLES[0].permissions,
    },
    ...[
      ["staff-002", "Sophia Martinez", "sophia.m@hoste.com", "SUPER_ADMIN"],
      ["staff-003", "Chioma Nnamdi", "chioma@hoste.com", "OPERATIONS"],
      ["staff-004", "Amara Kalu", "amara.k@hoste.com", "FINANCE"],
      ["staff-005", "Marcus Aurelius", "marcus@hoste.com", "CUSTOMER_SUPPORT"],
      ["staff-006", "Kofi Mensah", "kofi@hoste.com", "MODERATOR"],
      [
        "staff-007",
        "Darlene Robertson",
        "darlene.r@hoste.com",
        "VERIFICATION_OFFICER",
      ],
    ].map(([id, name, email, roleId]) => ({
      id,
      name,
      email,
      roleId,
      status: "Active" as const,
      permissions: ROLES.find((role) => role.id === roleId)!.permissions,
    })),
    {
      id: "staff-008",
      name: "Eleanor Pena",
      email: "eleanor.pena@hoste.com",
      roleId: "OPERATIONS",
      status: "Invited",
      permissions: ROLES[1].permissions,
    },
  ],
  settings: {
    sessionDuration: "2",
    maxLoginAttempts: 5,
    adminOnboarding: true,
    idleTimeout: "30",
    passwordExpiry: "90",
    twoFactor: true,
    trustedDevices: true,
    loginAlerts: true,
    ipBoundSessions: false,
    customers: true,
    hosts: true,
    brands: true,
    planners: false,
    emailVerification: true,
    accountApproval: false,
  },
  populations: [
    {
      id: "customers",
      name: "Customers",
      active: 12426,
      suspended: 24,
      badge: "Open Signup",
      access: "Unrestricted",
      tone: "primary",
    },
    {
      id: "hosts",
      name: "Hostés",
      active: 1204,
      suspended: 6,
      badge: "Verified Only",
      access: "High Privilege",
      tone: "secondary",
    },
    {
      id: "brands",
      name: "Brand Users",
      active: 378,
      suspended: 2,
      badge: "Corporate",
      access: "Partner Access",
      tone: "primary",
    },
    {
      id: "planners",
      name: "Event Planners",
      active: 240,
      suspended: 0,
      badge: "Restricted",
      access: "Invite Only",
      tone: "muted",
    },
  ],
  accounts: initialUsers
    .filter((user) => user.type !== "Admin")
    .map((user) => ({
      id: user.id,
      name: user.name,
      email: user.email,
      classification: user.type,
      status: user.status === "Deleted" ? "Deactivated" : user.status,
    })),
  accountTotals: { Active: 14248, Suspended: 32, Blocked: 14, Deactivated: 88 },
  activities: [
    {
      id: "access-001",
      name: primaryAdmin.name,
      type: "Super Admin",
      activity: "Admin signed in via 2FA (IP: 102.89.23.41)",
      at: "2026-08-23T16:42:00+01:00",
      status: "Successful",
    },
    {
      id: "access-002",
      name: "Chioma Nnamdi",
      type: "Operations",
      activity: "Admin role changed: Customer Support → Operations",
      at: "2026-08-23T15:10:00+01:00",
      status: "Completed",
    },
    {
      id: "access-003",
      name: "Blessing Eze",
      type: "Hosté",
      activity: "User account suspended: Violation #8821",
      at: "2026-08-23T11:25:00+01:00",
      status: "Blocked",
    },
    {
      id: "access-004",
      name: "Amara Kalu",
      type: "Finance",
      activity: "New admin invited: amara.k@hoste.com",
      at: "2026-08-22T18:05:00+01:00",
      status: "Completed",
    },
    {
      id: "access-005",
      name: "Unknown (198.51.100.4)",
      type: "External",
      activity: "Failed login attempt on admin portal (Invalid Password)",
      at: "2026-08-22T14:12:00+01:00",
      status: "Failed",
    },
    {
      id: "access-006",
      name: "Sarah Okafor",
      type: "Customer",
      activity: "User account reactivated after identity clearance",
      at: "2026-08-21T09:30:00+01:00",
      status: "Successful",
    },
  ],
};
