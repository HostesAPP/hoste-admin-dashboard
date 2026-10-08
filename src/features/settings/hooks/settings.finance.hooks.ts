"use client";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import type {
  FinanceSettings,
  FinanceSettingsAdapter,
  FinanceSettingsSnapshot,
} from "../settings.finance.types";

export function useFinanceSettings(adapter: FinanceSettingsAdapter) {
  const client = useQueryClient();
  const key = ["settings", "finance", adapter.cacheKey];
  const query = useQuery({ queryKey: key, queryFn: () => adapter.load() });
  const mutation = useMutation({
    mutationFn: (settings: FinanceSettings) => adapter.save(settings),
    onSuccess: (data) => client.setQueryData(key, data),
  });
  // Credentials deliberately bypass mutation state: only redacted results reach the cache.
  const configureGateway: FinanceSettingsAdapter["configureGateway"] = async (
    input,
  ) => {
    const gateway = await adapter.configureGateway(input);
    client.setQueryData<FinanceSettingsSnapshot>(key, (current) =>
      current ? { ...current, gateway } : current,
    );
    return gateway;
  };
  return {
    ...query,
    save: mutation.mutateAsync,
    isSaving: mutation.isPending,
    configureGateway,
    testConnection: adapter.testConnection,
  };
}
