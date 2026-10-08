import { MOCK_CONTENT_SETTINGS } from "./data/settings.content.data";
import { contentSettingsSchema } from "./schemas/settings.content.schema";
import type {
  ContentSettingsAdapter,
  ContentSettingsSnapshot,
} from "./settings.content.types";

export function createMockContentSettingsAdapter(
  initial: ContentSettingsSnapshot = MOCK_CONTENT_SETTINGS,
): ContentSettingsAdapter {
  let snapshot = structuredClone(initial);
  return {
    cacheKey: "platform-content-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      if (!snapshot.canManage)
        throw new Error(
          "You do not have permission to change platform content settings.",
        );
      snapshot = {
        ...snapshot,
        settings: structuredClone(contentSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
  };
}
export const mockContentSettingsAdapter = createMockContentSettingsAdapter();
