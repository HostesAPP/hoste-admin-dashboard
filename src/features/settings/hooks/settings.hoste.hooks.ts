"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  HosteSettings,
  HosteSettingsAdapter,
} from "../settings.hoste.types";

export function useHosteSettings(adapter: HosteSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "hoste-management", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (settings: HosteSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  return { ...query, save: mutation.mutateAsync, isSaving: mutation.isPending };
}
