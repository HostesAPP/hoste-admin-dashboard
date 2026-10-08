import { MOCK_HOSTE_SETTINGS } from "./data/settings.hoste.data";
import { hosteSettingsSchema } from "./schemas/settings.hoste.schema";
import type {
  HosteSettingsAdapter,
  HosteSnapshot,
} from "./settings.hoste.types";

export function createMockHosteAdapter(
  initial: HosteSnapshot = MOCK_HOSTE_SETTINGS,
): HosteSettingsAdapter {
  let snapshot = structuredClone(initial);
  return {
    cacheKey: "hoste-mock-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      if (!snapshot.canManage)
        throw new Error("You do not have permission to manage these settings.");
      snapshot = {
        ...snapshot,
        settings: structuredClone(hosteSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
  };
}

export const mockHosteAdapter = createMockHosteAdapter();
