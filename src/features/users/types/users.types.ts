export type UserStatus = "Active" | "Suspended" | "Deleted";

export type UserType = "Hosté" | "Customer" | "Admin" | "Staff";

export type UserTab = "ALL" | "HOSTES" | "CUSTOMERS" | "ADMINS";

export type UserPermissionItem = {
  id: string;
  name: string;
  granted: boolean;
};

export type UserSecurityInfo = {
  emailVerified: boolean;
  phoneVerified: boolean;
  twoFactorEnabled: boolean;
  lastLogin: string;
  lastLoginDevice: string;
  lastLoginLocation: string;
};

export type UserAdminActivity = {
  profilesReviewed: number;
  usersManaged: number;
  bookingsManaged: number;
  reportsGenerated: number;
};

export type UserRecentActivityItem = {
  id: string;
  title: string;
  description: string;
  timestamp: string;
  type: "approved" | "updated" | "suspended" | "notification";
};

export type User = {
  id: string;
  userCode: string; // e.g. "USR-10482" or "USR-00001"
  name: string;
  fullName?: string;
  email: string;
  phoneNumber?: string;
  type: UserType;
  roleSubtitle?: string; // e.g. "Event Host", "Super Admin", "Usher", "VIP Waitstaff"
  role?: "User" | "Staff";
  avatarUrl?: string;
  emailVerified?: boolean;
  phoneVerified?: boolean;
  accountStatus: UserStatus;
  status: UserStatus; // alias for UI consistency
  dateJoined: string; // formatted e.g. "Aug 15, 2026"
  lastActive: string; // formatted e.g. "2 hours ago"
  lastLoginAt?: string | null;
  createdAt?: string;
  updatedAt?: string;

  // Detailed fields
  permissions?: UserPermissionItem[];
  security?: UserSecurityInfo;
  adminActivity?: UserAdminActivity;
  recentActivities?: UserRecentActivityItem[];
};

export type UserStats = {
  totalUsers: {
    count: number;
    growthPercent: number;
    growthPeriod: string;
  };
  hostes: {
    count: number;
    subtitle: string;
  };
  customers: {
    count: number;
    subtitle: string;
  };
  adminsAndStaff: {
    count: number;
    subtitle: string;
  };
};

export type UserFilterParams = {
  tab?: UserTab;
  search?: string;
  filter?: string;
  dateJoined?: string;
  status?: string;
  role?: string;
  page?: number;
  pageSize?: number;
};