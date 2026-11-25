"use client";

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchUsers,
  fetchUserStats,
  fetchUserById,
  suspendUserApi,
  activateUserApi,
} from "../api/users.api";
import type {
  User,
  UserFilterParams,
  UsersStatsResponse,
  UsersQueryResponse,
  SuspendUserPayload,
  ActivateUserPayload,
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
 * Mutation to suspend a user account
 * Method: POST /api/v1/users/:id/suspend
 */
export function useSuspendUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload: SuspendUserPayload }) =>
      suspendUserApi(userId, payload),
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
 * Mutation to activate a user account
 * Method: POST /api/v1/users/:id/activate
 */
export function useActivateUser() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({ userId, payload }: { userId: string; payload?: ActivateUserPayload }) =>
      activateUserApi(userId, payload),
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
 * Mutation for updating user account status (suspending or activating).
 */
export function useUpdateUserStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      userId,
      newStatus,
      reason,
    }: {
      userId: string;
      newStatus: "Active" | "Suspended" | "Deleted";
      reason?: string;
    }) => {
      if (newStatus === "Suspended") {
        return suspendUserApi(userId, {
          reason: reason || "Administrative suspension by staff",
        });
      } else if (newStatus === "Active") {
        return activateUserApi(userId, {
          reason: reason?.trim() || "Account reactivated by staff administrator",
        });
      }
      throw new Error(`Status ${newStatus} is not supported for user status update.`);
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
