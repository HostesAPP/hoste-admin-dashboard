"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  NotificationSettings,
  NotificationSettingsAdapter,
} from "../settings.notifications.types";

export function useNotificationSettings(adapter: NotificationSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "notifications", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (settings: NotificationSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  return { ...query, save: mutation.mutateAsync, isSaving: mutation.isPending };
}
