"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { initialUsers, initialUserStats } from "../data/users.data";
import type { User, UserFilterParams, UserStats } from "../types/users.types";

interface UsersQueryResponse {
  users: User[];
  totalCount: number;
  stats: UserStats;
  page: number;
  pageSize: number;
  totalPages: number;
}

// In-memory store for mutations in the current session
let sessionUsers: User[] = [...initialUsers];

async function fetchUsers(params: UserFilterParams): Promise<UsersQueryResponse> {
  await new Promise((resolve) => setTimeout(resolve, 80));

  let filtered = [...sessionUsers];

  // 1. Filter by Tab
  if (params.tab && params.tab !== "ALL") {
    if (params.tab === "HOSTES") {
      filtered = filtered.filter((u) => u.type === "Hosté");
    } else if (params.tab === "CUSTOMERS") {
      filtered = filtered.filter((u) => u.type === "Customer");
    } else if (params.tab === "ADMINS") {
      filtered = filtered.filter((u) => u.type === "Admin" || u.type === "Staff" || u.role === "Staff");
    }
  }

  // 2. Filter by Search
  if (params.search && params.search.trim()) {
    const q = params.search.toLowerCase().trim();
    filtered = filtered.filter(
      (u) =>
        u.name.toLowerCase().includes(q) ||
        u.email.toLowerCase().includes(q) ||
        u.userCode.toLowerCase().includes(q) ||
        (u.phoneNumber && u.phoneNumber.toLowerCase().includes(q))
    );
  }

  // 3. Filter by Status
  if (params.status && params.status !== "all" && params.status !== "") {
    filtered = filtered.filter(
      (u) => u.status.toLowerCase() === params.status?.toLowerCase()
    );
  }

  // 4. Filter by Role
  if (params.role && params.role !== "all" && params.role !== "") {
    const r = params.role.toLowerCase();
    filtered = filtered.filter(
      (u) =>
        u.type.toLowerCase().includes(r) ||
        (u.roleSubtitle && u.roleSubtitle.toLowerCase().includes(r))
    );
  }

  const page = params.page || 1;
  const pageSize = params.pageSize || 6;
  const totalCount = initialUserStats.totalUsers.count;
  const totalPages = 1249;

  return {
    users: filtered,
    totalCount,
    stats: initialUserStats,
    page,
    pageSize,
    totalPages,
  };
}

export function useUsers(filters: UserFilterParams) {
  return useQuery({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
    initialData:
      (!filters.tab || filters.tab === "ALL") &&
      !filters.search &&
      !filters.status &&
      !filters.role
        ? {
            users: initialUsers,
            totalCount: initialUserStats.totalUsers.count,
            stats: initialUserStats,
            page: 1,
            pageSize: 6,
            totalPages: 1249,
          }
        : undefined,
  });
}

export function useUserDetail(id: string) {
  return useQuery({
    queryKey: ["user-detail", id],
    queryFn: async (): Promise<User | null> => {
      await new Promise((resolve) => setTimeout(resolve, 60));
      const normalizedId = id.toLowerCase();
      const found = sessionUsers.find(
        (u) =>
          u.id.toLowerCase() === normalizedId ||
          u.userCode.toLowerCase() === normalizedId
      );
      return found || sessionUsers[0] || null;
    },
    initialData: () => {
      const normalizedId = id.toLowerCase();
      return (
        sessionUsers.find(
          (u) =>
            u.id.toLowerCase() === normalizedId ||
            u.userCode.toLowerCase() === normalizedId
        ) || sessionUsers[0]
      );
    },
  });
}

export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newStatus,
    }: {
      userId: string;
      newStatus: "Active" | "Suspended" | "Deleted";
    }) => {
      sessionUsers = sessionUsers.map((u) =>
        u.id === userId || u.userCode === userId
          ? { ...u, status: newStatus, accountStatus: newStatus }
          : u
      );
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail", variables.userId] });
    },
  });
}

export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
      newRoleSubtitle,
    }: {
      userId: string;
      newRole: "Hosté" | "Customer" | "Admin" | "Staff";
      newRoleSubtitle?: string;
    }) => {
      sessionUsers = sessionUsers.map((u) =>
        u.id === userId || u.userCode === userId
          ? { ...u, type: newRole, roleSubtitle: newRoleSubtitle }
          : u
      );
      return { success: true };
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["user-detail", variables.userId] });
    },
  });
}
