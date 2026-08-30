export type UserStatus = "Active" | "Suspended" | "Deleted"

export type User = {
  id: string;
  email: string;
  phoneNumber: string;
  role: "User" | "Staff";
  emailVerified: boolean;
  phoneVerified: boolean;
  accountStatus: UserStatus;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
};