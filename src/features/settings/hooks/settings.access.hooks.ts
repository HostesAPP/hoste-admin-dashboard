"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type { AccessAdapter } from "../settings.access.types";

const ACCESS_QUERY_KEY = ["settings", "users-access"] as const;

export function useAccessSettings(adapter: AccessAdapter) {
  const client = useQueryClient();
  const key = [...ACCESS_QUERY_KEY, adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (command: Parameters<AccessAdapter["execute"]>[0]) =>
      adapter.execute(command),
    onSuccess: (snapshot) => client.setQueryData(key, snapshot),
  });
  return {
    ...query,
    execute: mutation.mutateAsync,
    isSaving: mutation.isPending,
  };
}
