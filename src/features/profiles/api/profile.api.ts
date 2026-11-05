// features/profiles/api/profile.api.ts

import { apiClient } from "@/lib/api-client";
import { useAuthStore } from "@/features/auth/auth.store";
import type {
  Profile,
  ProfileCounts,
  ProfileFilterParams,
  ProfilesListResponse,
  ProfileStatus,
  ProfileType,
  VerificationStatus,
  GetMyProfilesResponse,
  ReviewActivationPayload,
  ReviewActivationResponse,
} from "../types/profiles.types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "";

/**
 * Normalizes backend profile DTO into the frontend Profile contract
 */
export function normalizeProfileFromBackend(raw: Record<string, unknown>): Profile {
  const rawStatus = String(raw.status || "PENDING").toUpperCase();
  const normalizedStatus: ProfileStatus =
    rawStatus === "ACTIVE"
      ? "Active"
      : rawStatus === "REJECTED"
      ? "Rejected"
      : rawStatus === "SUSPENDED"
      ? "Suspended"
      : rawStatus === "DELETED"
      ? "Deleted"
      : "Pending";

  const rawVerification = String(raw.verificationStatus || "UNVERIFIED").toUpperCase();
  const normalizedVerification: VerificationStatus =
    rawVerification === "ACTIVE"
      ? "Active"
      : rawVerification === "APPROVED_AWAITING_PAYMENT"
      ? "Approved_Awaiting_Payment"
      : rawVerification === "REJECTED"
      ? "Rejected"
      : rawVerification === "EXPIRED"
      ? "Expired"
      : "Pending";

  const rawType = String(raw.profileType || raw.type || "HOST").toUpperCase();
  const normalizedType: ProfileType =
    rawType === "BRAND"
      ? "BRAND"
      : rawType === "EVENT_PLANNER"
      ? "EVENT_PLANNER"
      : "HOST";

  const attrs = (raw.attributes as Record<string, unknown>) || {};
  const activation = (raw.activationData as Record<string, unknown>) || {};

  const id = String(raw.id || "");
  const hosteId =
    (raw.hosteId as string) ||
    (id ? `HOSTE-${id.replace(/-/g, "").slice(0, 6).toUpperCase()}` : "HOSTE-0000");

  const displayName =
    (raw.displayName as string) ||
    (raw.name as string) ||
    (attrs.displayName as string) ||
    (attrs.name as string) ||
    "Hosté Member";

  const createdDate = raw.createdAt ? new Date(String(raw.createdAt)) : new Date();
  const memberSince = !isNaN(createdDate.getTime())
    ? createdDate.toLocaleDateString("en-US", { month: "short", year: "numeric" })
    : "Recent";

  return {
    id,
    hosteId,
    userId: String(raw.userId || ""),
    profileType: normalizedType,
    categoryRole:
      (raw.categoryRole as string) ||
      (raw.profession as string) ||
      (attrs.role as string) ||
      (attrs.category as string) ||
      (normalizedType === "HOST" ? "Professional Hosté" : normalizedType),
    profession: (raw.profession as string) || (attrs.profession as string) || "",
    subLocation:
      (raw.subLocation as string) ||
      (attrs.subLocation as string) ||
      (raw.city ? `${raw.city}, ${raw.country || "Nigeria"}` : "Lagos, Nigeria"),
    attributes: attrs,
    attributesVersion: Number(raw.attributesVersion || 1),
    activationData: activation,
    displayName,
    description: (raw.description as string) || (attrs.bio as string) || (attrs.description as string) || "",
    aboutText: (raw.aboutText as string) || (attrs.about as string) || (attrs.bio as string) || "",
    phone: (raw.phone as string) || (raw.phoneNumber as string) || (attrs.phone as string) || "",
    email: (raw.email as string) || "",
    country: (raw.country as string) || (attrs.country as string) || "Nigeria",
    state: (raw.state as string) || (attrs.state as string) || "Lagos",
    city: (raw.city as string) || (attrs.city as string) || "Lagos",
    address: (raw.address as string) || (attrs.address as string) || "",
    verificationStatus: normalizedVerification,
    status: normalizedStatus,
    suspendedUntil: (raw.suspendedUntil as string) || null,
    completedBookingsCount: Number(raw.completedBookingsCount || attrs.completedBookings || 0),
    rating: Number(raw.rating || attrs.rating || 5.0),
    reviewsCount: Number(raw.reviewsCount || attrs.reviewsCount || 0),
    recentReviewText: (raw.recentReviewText as string) || (attrs.recentReview as string) || "",
    avatarBgColor: (raw.avatarBgColor as string) || (attrs.avatarBgColor as string) || "#EF5A22",
    avatarInitial: displayName.charAt(0).toUpperCase() || "H",
    avatarUrl: (raw.avatarUrl as string) || (attrs.avatarUrl as string) || undefined,
    memberSince,
    services: (raw.services as string[]) || (attrs.services as string[]) || ["Event Hosting", "VIP Hospitality"],
    skills: (raw.skills as string[]) || (attrs.skills as string[]) || ["Communication", "Guest Coordination"],
    experienceList: (raw.experienceList as import("../types/profiles.types").ExperienceItem[]) || [],
    availability: (raw.availability as import("../types/profiles.types").AvailabilityInfo) || {
      status: "Available",
      days: "Mon - Sat",
      hours: "9:00 AM - 10:00 PM",
    },
    bookingHistory: (raw.bookingHistory as import("../types/profiles.types").BookingHistoryItem[]) || [],
    verificationSummary: (raw.verificationSummary as import("../types/profiles.types").VerificationSummaryInfo) || {
      identityStatus: normalizedVerification === "Active" ? "Verified" : "Pending",
      certificatesCount: 2,
      backgroundStatus: normalizedVerification === "Active" ? "Verified" : "Pending",
    },
    createdAt: String(raw.createdAt || new Date().toISOString()),
    updatedAt: String(raw.updatedAt || new Date().toISOString()),
  };
}

/**
 * 1. List All Profiles (Staff Management List)
 * Method: GET /api/v1/profiles
 * Access: Staff Only
 */
export async function fetchProfiles(
  params: ProfileFilterParams = {}
): Promise<ProfilesListResponse> {
  const queryParams = new URLSearchParams();

  if (params.skip !== undefined) queryParams.set("skip", String(params.skip));
  if (params.take !== undefined) queryParams.set("take", String(params.take));
  if (params.status) queryParams.set("status", params.status.toUpperCase());
  if (params.profileType) queryParams.set("profileType", params.profileType.toUpperCase());
  if (params.verificationStatus) {
    queryParams.set("verificationStatus", params.verificationStatus.toUpperCase());
  }
  if (params.search?.trim()) queryParams.set("search", params.search.trim());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(`/profiles${queryString}`, {
    method: "GET",
  });

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const rawItems = Array.isArray(dataObj?.items)
    ? (dataObj.items as Record<string, unknown>[])
    : Array.isArray(response?.data)
    ? (response.data as Record<string, unknown>[])
    : Array.isArray(response)
    ? (response as Record<string, unknown>[])
    : [];

  const total =
    typeof dataObj?.total === "number"
      ? dataObj.total
      : typeof response?.total === "number"
      ? response.total
      : rawItems.length;

  const skip = typeof dataObj?.skip === "number" ? dataObj.skip : params.skip || 0;
  const take = typeof dataObj?.take === "number" ? dataObj.take : params.take || 50;

  return {
    items: rawItems.map(normalizeProfileFromBackend),
    total,
    skip,
    take,
  };
}

/**
 * 2. Profile Counts (Dashboard Tabs)
 * Method: GET /api/v1/profiles/counts
 * Access: Staff Only
 */
export async function fetchProfileCounts(
  params: Partial<ProfileFilterParams> = {}
): Promise<ProfileCounts> {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.set("status", params.status.toUpperCase());
  if (params.profileType) queryParams.set("profileType", params.profileType.toUpperCase());
  if (params.verificationStatus) {
    queryParams.set("verificationStatus", params.verificationStatus.toUpperCase());
  }
  if (params.search?.trim()) queryParams.set("search", params.search.trim());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const response = await apiClient<Record<string, unknown>>(`/profiles/counts${queryString}`, {
    method: "GET",
  });

  const dataObj =
    response?.data && typeof response.data === "object"
      ? (response.data as Record<string, unknown>)
      : response;

  const byStatus = (dataObj?.byStatus as Record<string, number>) || {};

  return {
    pending: Number(byStatus.PENDING || 0),
    approved: Number(byStatus.ACTIVE || 0),
    rejected: Number(byStatus.REJECTED || 0),
    suspended: Number(byStatus.SUSPENDED || 0),
    deactivated: Number(byStatus.DELETED || 0),
  };
}

/**
 * 3. List Pending Profiles for Activation Review (FIFO order)
 * Method: GET /api/v1/profiles/pending-activation
 * Access: Staff Only
 */
export async function fetchPendingProfiles(
  skip = 0,
  take = 50
): Promise<ProfilesListResponse> {
  const response = await apiClient<Record<string, unknown>>(
    `/profiles/pending-activation?skip=${skip}&take=${take}`,
    {
      method: "GET",
    }
  );

  const dataObj =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : response;

  const rawItems = Array.isArray(dataObj?.items)
    ? (dataObj.items as Record<string, unknown>[])
    : Array.isArray(response?.data)
    ? (response.data as Record<string, unknown>[])
    : Array.isArray(response)
    ? (response as Record<string, unknown>[])
    : [];

  const total =
    typeof dataObj?.total === "number"
      ? dataObj.total
      : typeof response?.total === "number"
      ? response.total
      : rawItems.length;

  return {
    items: rawItems.map(normalizeProfileFromBackend),
    total,
    skip,
    take,
  };
}

/**
 * 4. Get Admin Profile Detail (With KYC ActivationData)
 * Method: GET /api/v1/profiles/:id/admin-detail
 * Access: Staff Only
 */
export async function fetchAdminProfileDetail(id: string): Promise<Profile> {
  const cleanId = id.trim();
  const response = await apiClient<Record<string, unknown>>(
    `/profiles/${cleanId}/admin-detail`,
    {
      method: "GET",
    }
  );

  const profileData =
    response?.data && typeof response.data === "object" && !Array.isArray(response.data)
      ? (response.data as Record<string, unknown>)
      : (response as Record<string, unknown>);

  return normalizeProfileFromBackend(profileData);
}

/**
 * 5. Review & Approve/Reject Profile Activation
 * Method: POST /api/v1/profiles/:id/review-activation
 * Access: Staff Only
 */
export async function reviewProfileActivation(
  id: string,
  payload: ReviewActivationPayload
): Promise<ReviewActivationResponse> {
  const cleanId = id.trim();
  return apiClient<ReviewActivationResponse>(
    `/profiles/${cleanId}/review-activation`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    }
  );
}

/**
 * 6. Export Profiles (CSV)
 * Method: GET /api/v1/profiles/export
 * Access: Staff Only
 * Downloads filtered list as CSV blob using Bearer token authentication.
 */
export async function exportProfilesCsv(
  params: ProfileFilterParams = {}
): Promise<{ truncated: boolean; filename: string }> {
  const queryParams = new URLSearchParams();

  if (params.status) queryParams.set("status", params.status.toUpperCase());
  if (params.profileType) queryParams.set("profileType", params.profileType.toUpperCase());
  if (params.verificationStatus) {
    queryParams.set("verificationStatus", params.verificationStatus.toUpperCase());
  }
  if (params.search?.trim()) queryParams.set("search", params.search.trim());

  const queryString = queryParams.toString() ? `?${queryParams.toString()}` : "";
  const accessToken = useAuthStore.getState().accessToken;

  const response = await fetch(`${API_URL}/profiles/export${queryString}`, {
    method: "GET",
    headers: {
      ...(accessToken ? { Authorization: `Bearer ${accessToken}` } : {}),
    },
    credentials: "include",
  });

  if (!response.ok) {
    throw new Error(`Export failed with status ${response.status}`);
  }

  const isTruncated = response.headers.get("X-Export-Truncated") === "true";
  const disposition = response.headers.get("Content-Disposition");
  let filename = `profiles-${new Date().toISOString().split("T")[0]}.csv`;
  if (disposition && disposition.includes("filename=")) {
    const match = disposition.match(/filename="?([^"]+)"?/);
    if (match && match[1]) {
      filename = match[1];
    }
  }

  const blob = await response.blob();
  const url = window.URL.createObjectURL(blob);
  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = filename;
  document.body.appendChild(anchor);
  anchor.click();
  anchor.remove();
  window.URL.revokeObjectURL(url);

  return { truncated: isTruncated, filename };
}

/**
 * Returns all non-deleted profiles owned by the authenticated user.
 * Method: GET /api/v1/profiles/me
 * Access: Protected (Bearer <token>)
 */
export async function getMyProfiles(): Promise<GetMyProfilesResponse> {
  return apiClient<GetMyProfilesResponse>("/profiles/me", {
    method: "GET",
  });
}
