import { MOCK_EARNINGS_DATA } from "./data/earnings.data";
import { referralConfigurationSchema } from "./schemas/earnings.schema";
import type { EarningsAdapter, EarningsData } from "./types/earnings.types";

export function createMockEarningsAdapter(
  initial: EarningsData = MOCK_EARNINGS_DATA,
): EarningsAdapter {
  let snapshot = structuredClone(initial);
  return {
    cacheKey: "referral-earnings-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async saveConfiguration(settings) {
      if (!snapshot.canManage)
        throw new Error("You do not have permission to configure referrals.");
      snapshot = {
        ...snapshot,
        configuration: referralConfigurationSchema.parse(settings),
      };
      return structuredClone(snapshot.configuration);
    },
  };
}
export const mockEarningsAdapter = createMockEarningsAdapter();
