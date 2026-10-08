"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SecuritySettings,
  SecuritySettingsAdapter,
  SecuritySettingsSnapshot,
} from "../settings.security.types";

export function useSecuritySettings(adapter: SecuritySettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "security", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const update = (data: SecuritySettingsSnapshot) =>
    client.setQueryData(key, data);
  const save = useMutation({
    mutationFn: (settings: SecuritySettings) => adapter.save(settings),
    onSuccess: update,
  });
  const revoke = useMutation({
    mutationFn: (id: string) => adapter.revokeSession(id),
    onSuccess: update,
  });
  const signOut = useMutation({
    mutationFn: () => adapter.signOutOthers(),
    onSuccess: update,
  });
  return {
    ...query,
    save: save.mutateAsync,
    revokeSession: revoke.mutateAsync,
    signOutOthers: signOut.mutateAsync,
    isSaving: save.isPending || revoke.isPending || signOut.isPending,
  };
}
