// features/groups/hooks/groups.hooks.ts

import { useQuery } from "@tanstack/react-query";
import {
  fetchGroups,
  fetchGroupById,
  fetchGroupStats,
  fetchGroupMembers,
  fetchMyGroups,
} from "../api/groups.api";
import type {
  GroupFilterParams,
  GroupMemberFilterParams,
} from "../types/groups.types";

export const GROUPS_QUERY_KEYS = {
  all: ["groups"] as const,
  list: (filters: GroupFilterParams) => ["groups", "list", filters] as const,
  mine: () => ["groups", "mine"] as const,
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

export function useMyGroups() {
  return useQuery({
    queryKey: GROUPS_QUERY_KEYS.mine(),
    queryFn: fetchMyGroups,
  });
}
