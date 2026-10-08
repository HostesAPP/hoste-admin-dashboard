import { MOCK_FINANCE_SETTINGS } from "./data/settings.finance.data";
import {
  financeGatewaySchema,
  financeSettingsSchema,
} from "./schemas/settings.finance.schema";
import type {
  FinanceSettingsAdapter,
  FinanceSettingsSnapshot,
} from "./settings.finance.types";

export function createMockFinanceSettingsAdapter(
  initial: FinanceSettingsSnapshot = MOCK_FINANCE_SETTINGS,
): FinanceSettingsAdapter {
  let snapshot = structuredClone(initial);
  const authorize = () => {
    if (!snapshot.canManage)
      throw new Error("You do not have permission to change finance settings.");
  };
  return {
    cacheKey: "finance-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      authorize();
      snapshot = {
        ...snapshot,
        settings: structuredClone(financeSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
    async configureGateway(input) {
      authorize();
      const { mode } = financeGatewaySchema.parse(input);
      // Never retain raw credentials, including in the mock snapshot or query cache.
      snapshot.gateway = {
        ...snapshot.gateway,
        mode,
        publicKeySummary: "Updated in preview",
        secretKeySummary: input.secretKey
          ? "Updated in preview"
          : snapshot.gateway.secretKeySummary,
        connected: false,
        webhookActive: false,
      };
      return structuredClone(snapshot.gateway);
    },
    async testConnection() {
      authorize();
      return "Preview check complete. No gateway connection was attempted.";
    },
  };
}
export const mockFinanceSettingsAdapter = createMockFinanceSettingsAdapter();
