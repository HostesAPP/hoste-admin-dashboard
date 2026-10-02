// features/groups/hooks/groups.hooks.ts

import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  fetchGroups,
  fetchGroupById,
  fetchGroupStats,
  fetchGroupMembers,
  suspendGroup,
  restoreGroup,
  addGroupMember,
  changeGroupMemberRole,
  removeGroupMember,
  transferGroupLeader,
} from "../api/groups.api";
import type {
  GroupFilterParams,
  GroupMemberFilterParams,
  GroupMemberRole,
  GroupMemberStatus,
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

export function useSuspendGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, reason }: { groupId: string; reason?: string }) =>
      suspendGroup(groupId, reason),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.detail(variables.groupId) });
    },
  });
}

export function useRestoreGroup() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (groupId: string) => restoreGroup(groupId),
    onSuccess: (_, groupId) => {
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.detail(groupId) });
    },
  });
}

export function useAddGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      data,
    }: {
      groupId: string;
      data: {
        name: string;
        email: string;
        role: GroupMemberRole;
        status: GroupMemberStatus;
      };
    }) => addGroupMember(groupId, data),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", "members", variables.groupId],
      });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
    },
  });
}

export function useChangeGroupMemberRole() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      memberId,
      newRole,
    }: {
      groupId: string;
      memberId: string;
      newRole: GroupMemberRole;
    }) => changeGroupMemberRole(groupId, memberId, newRole),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", "members", variables.groupId],
      });
    },
  });
}

export function useRemoveGroupMember() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ groupId, memberId }: { groupId: string; memberId: string }) =>
      removeGroupMember(groupId, memberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", "members", variables.groupId],
      });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
    },
  });
}

export function useTransferGroupLeader() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      groupId,
      newLeaderMemberId,
    }: {
      groupId: string;
      newLeaderMemberId: string;
    }) => transferGroupLeader(groupId, newLeaderMemberId),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["groups", "members", variables.groupId],
      });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.detail(variables.groupId) });
      queryClient.invalidateQueries({ queryKey: GROUPS_QUERY_KEYS.all });
    },
  });
}
