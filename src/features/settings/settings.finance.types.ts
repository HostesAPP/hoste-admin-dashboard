import type { z } from "zod";
import type {
  financeCommissionSchema,
  financeGatewaySchema,
  financeSettingsSchema,
} from "./schemas/settings.finance.schema";

// Presentation models; map backend contracts into these at the adapter boundary.
export type FinanceSettings = z.infer<typeof financeSettingsSchema>;
export type FinanceCommission = z.infer<typeof financeCommissionSchema>;
export type FinanceGatewayInput = z.infer<typeof financeGatewaySchema>;
export type FinanceGateway = {
  provider: string;
  connected: boolean;
  publicKeySummary: string;
  secretKeySummary: string;
  webhookUrl: string | null;
  webhookActive: boolean;
  mode: "LIVE" | "TEST";
};
export type FinanceSettingsSnapshot = {
  canManage: boolean;
  settings: FinanceSettings;
  gateway: FinanceGateway;
  stats: {
    label: string;
    value: string;
    detail?: string;
    highlight?: boolean;
  }[];
  activity: {
    id: string;
    event: string;
    user: string;
    amount: string;
    date: string;
    status: string;
  }[];
};
export type FinanceSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<FinanceSettingsSnapshot>;
  save: (settings: FinanceSettings) => Promise<FinanceSettingsSnapshot>;
  configureGateway: (input: FinanceGatewayInput) => Promise<FinanceGateway>;
  testConnection: () => Promise<string>;
};
