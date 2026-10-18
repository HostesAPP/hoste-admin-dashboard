import { apiClient } from "@/lib/api-client";
import type { GetMyProfilesResponse } from "../types/profiles.types";

/**
 * Returns all non-deleted profiles owned by the authenticated user.
 * Method & Path: GET /api/v1/profiles/me
 * Access: Protected (Bearer <token>)
 */
export async function getMyProfiles(): Promise<GetMyProfilesResponse> {
  return apiClient<GetMyProfilesResponse>("/profiles/me", {
    method: "GET",
  });
}
