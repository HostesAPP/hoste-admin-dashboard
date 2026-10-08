"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  BookingsSettings,
  BookingsSettingsAdapter,
} from "../settings.bookings.types";

export function useBookingsSettings(adapter: BookingsSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "bookings-groups", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (settings: BookingsSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  return { ...query, save: mutation.mutateAsync, isSaving: mutation.isPending };
}
