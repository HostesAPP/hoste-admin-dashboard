import type { z } from "zod";
import type {
  bookingTypeSettingsSchema,
  bookingsSettingsSchema,
} from "./schemas/settings.bookings.schema";

// Screen configuration models, not assumed backend response contracts.
export type BookingTypeSettings = z.infer<typeof bookingTypeSettingsSchema>;
export type BookingsSettings = z.infer<typeof bookingsSettingsSchema>;
export type BookingToggleName = {
  [Key in keyof BookingsSettings]: BookingsSettings[Key] extends boolean
    ? Key
    : never;
}[keyof BookingsSettings];
export type BookingControlGroup = {
  id: string;
  title: string;
  columns: 1 | 2;
  fields: readonly {
    name: BookingToggleName;
    label: string;
    description?: string;
  }[];
};
export type BookingsSettingsSnapshot = {
  canManage: boolean;
  stats: {
    label: string;
    value: string;
    detail: string;
    tone: "primary" | "secondary" | "destructive" | "neutral";
  }[];
  settings: BookingsSettings;
};
export type BookingsSettingsAdapter = {
  cacheKey: string;
  load: () => Promise<BookingsSettingsSnapshot>;
  save: (settings: BookingsSettings) => Promise<BookingsSettingsSnapshot>;
};
