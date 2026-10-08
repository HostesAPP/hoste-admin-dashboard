import { MOCK_BOOKINGS_SETTINGS } from "./data/settings.bookings.data";
import { bookingsSettingsSchema } from "./schemas/settings.bookings.schema";
import type {
  BookingsSettingsAdapter,
  BookingsSettingsSnapshot,
} from "./settings.bookings.types";

export function createMockBookingsSettingsAdapter(
  initial: BookingsSettingsSnapshot = MOCK_BOOKINGS_SETTINGS,
): BookingsSettingsAdapter {
  let snapshot = structuredClone(initial);
  return {
    cacheKey: "bookings-groups-preview",
    async load() {
      return structuredClone(snapshot);
    },
    async save(settings) {
      if (!snapshot.canManage)
        throw new Error(
          "You do not have permission to change booking settings.",
        );
      snapshot = {
        ...snapshot,
        settings: structuredClone(bookingsSettingsSchema.parse(settings)),
      };
      return structuredClone(snapshot);
    },
  };
}
export const mockBookingsSettingsAdapter = createMockBookingsSettingsAdapter();
