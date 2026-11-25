"use client";

import { useState, useTransition } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchProfiles,
  fetchProfileCounts,
  fetchPendingProfiles,
  fetchAdminProfileDetail,
  reviewProfileActivation,
  suspendProfileApi,
  restoreProfileApi,
  deactivateProfileApi,
  getPrivateDocumentLink,
  exportProfilesCsv,
} from "../api/profile.api";
import type {
  Profile,
  ProfileTab,
  ProfileCounts,
  ProfileFilterParams,
  ReviewActivationPayload,
} from "../types/profiles.types";

export const PROFILES_QUERY_KEYS = {
  all: ["profiles"] as const,
  list: (filters: ProfileFilterParams) => ["profiles", "list", filters] as const,
  counts: (filters?: Partial<ProfileFilterParams>) => ["profiles", "counts", filters] as const,
  pending: (skip: number, take: number) => ["profiles", "pending", skip, take] as const,
  adminDetail: (id: string) => ["profiles", "admin-detail", id] as const,
};

function mapTabToStatus(tab: ProfileTab): string {
  switch (tab) {
    case "pending":
      return "PENDING";
    case "approved":
      return "ACTIVE";
    case "rejected":
      return "REJECTED";
    case "suspended":
      return "SUSPENDED";
    case "deactivated":
      return "DELETED";
    default:
      return "PENDING";
  }
}

export function useProfiles() {
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<ProfileTab>("pending");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [isPending, startTransition] = useTransition();

  const skip = (currentPage - 1) * rowsPerPage;
  const take = rowsPerPage;

  // 1. Fetch real-time tab counts from GET /api/v1/profiles/counts
  const { data: countsData } = useQuery<ProfileCounts>({
    queryKey: PROFILES_QUERY_KEYS.counts({ search: searchQuery }),
    queryFn: () => fetchProfileCounts({ search: searchQuery }),
  });

  const tabCounts: ProfileCounts = countsData || {
    pending: 0,
    approved: 0,
    rejected: 0,
    suspended: 0,
    deactivated: 0,
  };

  // 2. Fetch profiles list from real backend API:
  // - Pending tab with no search uses GET /api/v1/profiles/pending-activation (FIFO review queue)
  // - Other tabs or active search uses GET /api/v1/profiles?status=...&skip=...&take=...
  const filterParams: ProfileFilterParams = {
    skip,
    take,
    status: mapTabToStatus(activeTab),
    search: searchQuery.trim() || undefined,
  };

  const isPendingQueue = activeTab === "pending" && !searchQuery.trim();

  const {
    data: listData,
    isLoading,
    isError,
    error,
    refetch,
    isFetching,
  } = useQuery({
    queryKey: isPendingQueue
      ? PROFILES_QUERY_KEYS.pending(skip, take)
      : PROFILES_QUERY_KEYS.list(filterParams),
    queryFn: () =>
      isPendingQueue
        ? fetchPendingProfiles(skip, take)
        : fetchProfiles(filterParams),
  });

  const profiles: Profile[] = listData?.items || [];
  const currentTabCount = tabCounts[activeTab] ?? 0;
  const totalResults =
    !searchQuery.trim() && currentTabCount > 0
      ? currentTabCount
      : typeof listData?.total === "number" && listData.total > 0
      ? listData.total
      : (currentTabCount || profiles.length);
  const totalPages = Math.max(1, Math.ceil(totalResults / rowsPerPage));

  // 3. Activation Review Mutation (Approve / Reject)
  const reviewMutation = useMutation({
    mutationFn: ({
      id,
      payload,
    }: {
      id: string;
      payload: ReviewActivationPayload;
    }) => reviewProfileActivation(id, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
    },
  });

  // 4. Suspend Mutation
  const suspendMutation = useSuspendProfile();

  // 5. Restore Mutation
  const restoreMutation = useRestoreProfile();

  // 6. Deactivate Mutation
  const deactivateMutation = useDeactivateProfile();

  const handleTabChange = (tab: ProfileTab) => {
    startTransition(() => {
      setActiveTab(tab);
      setCurrentPage(1);
    });
  };

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
    }
  };

  const handleRowsPerPageChange = (rows: number) => {
    setRowsPerPage(rows);
    setCurrentPage(1);
  };

  const handleSkipChange = (newSkip: number) => {
    const newPage = Math.floor(newSkip / rowsPerPage) + 1;
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const handleTakeChange = (newTake: number) => {
    setRowsPerPage(newTake);
    setCurrentPage(1);
  };

  const approveProfile = async (id: string) => {
    await reviewMutation.mutateAsync({
      id,
      payload: { action: "APPROVE" },
    });
  };

  const rejectProfile = async (id: string, reason?: string) => {
    await reviewMutation.mutateAsync({
      id,
      payload: {
        action: "REJECT",
        rejectionReason: reason || "Profile does not meet activation criteria.",
      },
    });
  };

  const suspendProfile = async (id: string, reason?: string, durationDays?: number) => {
    const suspendedUntil = durationDays
      ? new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000).toISOString()
      : undefined;
    await suspendMutation.mutateAsync({
      id,
      reason: reason || "Administrative suspension by staff",
      suspendedUntil,
    });
  };

  const restoreProfile = async (id: string, reason?: string) => {
    await restoreMutation.mutateAsync({
      id,
      reason: reason || "Restored to active status by staff administrator",
    });
  };

  const deactivateProfile = async (id: string, reason?: string) => {
    await deactivateMutation.mutateAsync({
      id,
      reason: reason || "Deactivated by staff administrator",
    });
  };

  const banProfile = deactivateProfile;

  return {
    profiles,
    totalResults,
    totalPages,
    currentPage,
    rowsPerPage,
    skip,
    take,
    activeTab,
    tabCounts,
    searchQuery,
    isPending,
    isLoading: isLoading || isFetching,
    isError,
    error,
    refetch,
    handleTabChange,
    handleSearch,
    handlePageChange,
    handleRowsPerPageChange,
    handleSkipChange,
    handleTakeChange,
    approveProfile,
    rejectProfile,
    suspendProfile,
    restoreProfile,
    deactivateProfile,
    banProfile,
    isReviewing: reviewMutation.isPending,
    isSuspending: suspendMutation.isPending,
    isRestoring: restoreMutation.isPending,
    isDeactivating: deactivateMutation.isPending,
  };
}

/**
 * Fetch a single profile's admin detail including KYC activationData
 * Method: GET /api/v1/profiles/:id/admin-detail
 */
export function useAdminProfileDetail(profileId: string) {
  return useQuery<Profile>({
    queryKey: PROFILES_QUERY_KEYS.adminDetail(profileId),
    queryFn: () => fetchAdminProfileDetail(profileId),
    enabled: Boolean(profileId),
  });
}

/**
 * Review profile activation mutation hook
 */
export function useReviewActivation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      action,
      rejectionReason,
    }: {
      id: string;
      action: "APPROVE" | "REJECT";
      rejectionReason?: string;
    }) =>
      reviewProfileActivation(id, {
        action,
        rejectionReason,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
    },
  });
}

/**
 * Suspend profile mutation hook
 * POST /api/v1/admin/profiles/:id/suspend
 */
export function useSuspendProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
      suspendedUntil,
    }: {
      id: string;
      reason: string;
      suspendedUntil?: string | null;
    }) =>
      suspendProfileApi(id, {
        reason,
        suspendedUntil,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PROFILES_QUERY_KEYS.adminDetail(variables.id),
      });
    },
  });
}

/**
 * Restore profile mutation hook
 * POST /api/v1/admin/profiles/:id/restore
 */
export function useRestoreProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) =>
      restoreProfileApi(id, {
        reason,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PROFILES_QUERY_KEYS.adminDetail(variables.id),
      });
    },
  });
}

/**
 * Deactivate profile mutation hook
 * POST /api/v1/admin/profiles/:id/deactivate
 */
export function useDeactivateProfile() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      id,
      reason,
    }: {
      id: string;
      reason: string;
    }) =>
      deactivateProfileApi(id, {
        reason,
      }),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: PROFILES_QUERY_KEYS.all });
      queryClient.invalidateQueries({
        queryKey: PROFILES_QUERY_KEYS.adminDetail(variables.id),
      });
    },
  });
}

/**
 * Query hook to fetch a short-lived signed link for a private ID document
 * Method: POST /api/v1/media/private/document-link
 * Access: Staff only (SUPER_ADMIN, VERIFICATION_OFFICER)
 */
export function usePrivateDocumentLink(url?: string | null) {
  return useQuery({
    queryKey: ["private-document-link", url],
    queryFn: () => getPrivateDocumentLink(url!),
    enabled: Boolean(url && url.trim().length > 0),
    staleTime: 3 * 60 * 1000, // 3 minutes cache (signed links valid 5-10m)
    retry: 1,
  });
}

export { exportProfilesCsv };
