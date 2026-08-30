// TEMPORARY MOCK DATA
// Replace with API data when the User service is available.
import type { User } from "@/features/users";

export const Users: User[] = [
  {
    id: "10000000-0000-4000-8000-000000000001",
    email: "john.ade@example.com",
    phoneNumber: "+2348012345678",
    role: "User",
    emailVerified: true,
    phoneVerified: true,
    accountStatus: "Active",
    lastLoginAt: "2026-08-25T14:30:00.000Z",
    createdAt: "2026-06-12T09:00:00.000Z",
    updatedAt: "2026-08-25T14:30:00.000Z",
  },
  {
    id: "10000000-0000-4000-8000-000000000002",
    email: "sarah.okafor@example.com",
    phoneNumber: "+2348098765432",
    role: "User",
    emailVerified: true,
    phoneVerified: true,
    accountStatus: "Active",
    lastLoginAt: "2026-08-24T11:15:00.000Z",
    createdAt: "2026-05-20T10:30:00.000Z",
    updatedAt: "2026-08-24T11:15:00.000Z",
  },
  {
    id: "10000000-0000-4000-8000-000000000003",
    email: "michael.bello@example.com",
    phoneNumber: "+2348034567890",
    role: "User",
    emailVerified: true,
    phoneVerified: false,
    accountStatus: "Suspended",
    lastLoginAt: "2026-08-18T08:45:00.000Z",
    createdAt: "2026-04-15T13:20:00.000Z",
    updatedAt: "2026-08-20T16:00:00.000Z",
  },
];