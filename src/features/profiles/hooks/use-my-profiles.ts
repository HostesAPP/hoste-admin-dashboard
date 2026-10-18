"use client";

import { useQuery } from "@tanstack/react-query";
import { getMyProfiles } from "../api/profile.api";
import { useAuthStore } from "@/features/auth/auth.store";
import type { GetMyProfilesResponse } from "../types/profiles.types";
import type { ApiError } from "@/lib/api-client";

export const MY_PROFILES_QUERY_KEY = ["profiles", "me"] as const;

/**
 * TanStack Query hook to fetch all non-deleted profiles owned by the logged-in user.
 * GET /api/v1/profiles/me
 * Scoped by authenticated user id to prevent cross-account cache collisions.
 */
export function useMyProfiles() {
  const accessToken = useAuthStore((state) => state.accessToken);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const user = useAuthStore((state) => state.user);

  return useQuery<GetMyProfilesResponse, ApiError>({
    queryKey: [...MY_PROFILES_QUERY_KEY, user?.id],
    queryFn: getMyProfiles,
    enabled: Boolean((accessToken || isAuthenticated) && user?.id),
    staleTime: 1000 * 60 * 5, // 5 minutes
    retry: 1,
  });
}
