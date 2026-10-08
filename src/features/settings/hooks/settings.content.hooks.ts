"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  ContentSettings,
  ContentSettingsAdapter,
} from "../settings.content.types";

export function useContentSettings(adapter: ContentSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "platform-content", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (settings: ContentSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  return { ...query, save: mutation.mutateAsync, isSaving: mutation.isPending };
}
