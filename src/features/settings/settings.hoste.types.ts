import type { z } from "zod";
import type {
  hosteSettingsSchema,
  hosteRequirementSchema,
  hostePlanSchema,
  hosteCommissionSchema,
} from "./schemas/settings.hoste.schema";

// Screen view models. Confirm backend contracts before mapping API responses.
export type HosteSettings = z.infer<typeof hosteSettingsSchema>;
export type HosteRequirement = z.infer<typeof hosteRequirementSchema>;
export type HostePlan = z.infer<typeof hostePlanSchema>;
export type HosteCommission = z.infer<typeof hosteCommissionSchema>;
export type HosteSnapshot = {
  canManage: boolean;
  stats: {
    label: string;
    value: string;
    detail: string;
    tone: "primary" | "secondary" | "neutral";
  }[];
  settings: HosteSettings;
};
export type HosteSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<HosteSnapshot>;
  save: (settings: HosteSettings) => Promise<HosteSnapshot>;
};
