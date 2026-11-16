"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUserStats,
  fetchUserById,
} from "../api/users.api";
import type {
  User,
  UserFilterParams,
  UsersStatsResponse,
  UsersQueryResponse,
} from "../types/users.types";

/**
 * Hook to fetch paginated users directory from backend API
 */
export function useUsers(filters: UserFilterParams) {
  return useQuery<UsersQueryResponse, Error>({
    queryKey: ["users", filters],
    queryFn: () => fetchUsers(filters),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch users statistics & tab counts from backend API
 */
export function useUserStats(filters: Partial<UserFilterParams> = {}) {
  return useQuery<UsersStatsResponse, Error>({
    queryKey: [
      "users-stats",
      filters.search,
      filters.dateFrom,
      filters.dateTo,
      filters.dateJoined,
    ],
    queryFn: () => fetchUserStats(filters),
    placeholderData: (previousData) => previousData,
  });
}

/**
 * Hook to fetch single user details by ID
 */
export function useUserDetail(id: string) {
  return useQuery<User | null, Error>({
    queryKey: ["user-detail", id],
    queryFn: () => fetchUserById(id),
    enabled: Boolean(id && id.trim().length > 0),
  });
}

/**
 * Stub mutation for updating user account status.
 * Status mutation endpoint is skipped / not yet supported on backend.
 */
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
      console.warn(
        `[Users API] Update user status for ${userId} to ${newStatus} is not supported on backend yet.`
      );
      throw new Error(
        "User status modification is not yet available on the backend."
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["user-detail", variables.userId],
      });
    },
  });
}

/**
 * Stub mutation for changing user role.
 * Role change endpoint is not yet supported on backend.
 */
export function useChangeUserRole() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newRole,
    }: {
      userId: string;
      newRole: "Hosté" | "Customer" | "Admin" | "Staff";
      newRoleSubtitle?: string;
    }) => {
      console.warn(
        `[Users API] Change user role for ${userId} to ${newRole} is not supported on backend yet.`
      );
      throw new Error(
        "User role modification is not yet available on the backend."
      );
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["users"] });
      queryClient.invalidateQueries({ queryKey: ["users-stats"] });
      queryClient.invalidateQueries({
        queryKey: ["user-detail", variables.userId],
      });
    },
  });
}
