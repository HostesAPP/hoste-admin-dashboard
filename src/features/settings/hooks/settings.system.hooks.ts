"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  SystemOperation,
  SystemSettings,
  SystemSettingsAdapter,
} from "../settings.system.types";

export function useSystemSettings(adapter: SystemSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "system", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const save = useMutation({
    mutationFn: (settings: SystemSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  const operation = useMutation({
    mutationFn: (input: SystemOperation) => adapter.operate(input),
  });
  return {
    ...query,
    save: save.mutateAsync,
    operate: operation.mutateAsync,
    isSaving: save.isPending || operation.isPending,
  };
}
