import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGroups,
  fetchGroupById,
  fetchGroupStats,
  fetchGroupMembers,
  updateGroupStatus,
} from "../api/groups.api";
import type {
  GroupFilterParams,
  GroupMemberFilterParams,
} from "../types/groups.types";

export const GROUPS_QUERY_KEYS = {
  all: ["groups"] as const,
  list: (filters: GroupFilterParams) => ["groups", "list", filters] as const,
  detail: (groupId: string) => ["groups", "detail", groupId] as const,
  stats: () => ["groups", "stats"] as const,
  members: (groupId: string, filters?: GroupMemberFilterParams) =>
    ["groups", "members", groupId, filters] as const,
};

export function useGroups(filters: GroupFilterParams = {}) {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.list(filters),
    queryFn: () => fetchGroups(filters),
  });
}

export function useGroup(groupId: string) {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.detail(groupId),
    queryFn: () => fetchGroupById(groupId),
    enabled: Boolean(groupId),
  });
}

export function useGroupStats() {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.stats(),
    queryFn: fetchGroupStats,
  });
}

export function useGroupMembers(groupId: string, filters: GroupMemberFilterParams = {}) {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.members(groupId, filters),
    queryFn: () => fetchGroupMembers(groupId, filters),
    enabled: Boolean(groupId),
  });
}

export function useUpdateGroupStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: ({
      groupId,
      status,
    }: {
      groupId: string;
      status: "ACTIVE" | "PAUSED" | "INACTIVE";
    }) => updateGroupStatus(groupId, status),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: GROUPS_QUERY_KEYS.detail(variables.groupId),
      });
      queryClient.invalidateQueries({
        queryKey: GROUPS_QUERY_KEYS.all,
      });
    },
  });
}
