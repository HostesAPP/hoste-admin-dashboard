import test from "node:test";
import assert from "node:assert/strict";
import { MOCK_BOOKINGS_SETTINGS } from "./data/settings.bookings.data";
import { createMockBookingsSettingsAdapter } from "./settings.bookings.adapter";
import {
  bookingsSettingsSchema,
  bookingTypeSettingsSchema,
} from "./schemas/settings.bookings.schema";

test("mock settings save without mutating inputs, fixtures, or statistics", async () => {
  const adapter = createMockBookingsSettingsAdapter();
  const snapshot = await adapter.load();
  snapshot.settings.groupsEnabled = false;
  await adapter.save(snapshot.settings);
  snapshot.settings.groupsEnabled = true;
  assert.equal((await adapter.load()).settings.groupsEnabled, false);
  assert.equal(MOCK_BOOKINGS_SETTINGS.settings.groupsEnabled, true);
  assert.deepEqual((await adapter.load()).stats, MOCK_BOOKINGS_SETTINGS.stats);
});

test("read-only adapters reject configuration mutations", async () => {
  const adapter = createMockBookingsSettingsAdapter({
    ...MOCK_BOOKINGS_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_BOOKINGS_SETTINGS.settings),
    /permission/,
  );
});

test("group capacity and percentages validate", () => {
  assert.equal(
    bookingsSettingsSchema.safeParse({
      ...MOCK_BOOKINGS_SETTINGS.settings,
      minGroupSize: 51,
      maxGroupSize: 50,
    }).success,
    false,
  );
  assert.equal(
    bookingsSettingsSchema.safeParse({
      ...MOCK_BOOKINGS_SETTINGS.settings,
      refundPercent: 101,
    }).success,
    false,
  );
  assert.equal(
    bookingTypeSettingsSchema.safeParse({
      ...MOCK_BOOKINGS_SETTINGS.settings.bookingTypes[0],
      commissionPercent: -1,
    }).success,
    false,
  );
});

test("booking type drafts preserve stable identifiers on save", async () => {
  const adapter = createMockBookingsSettingsAdapter();
  const { settings } = await adapter.load();
  settings.bookingTypes[0].name = "Updated Full-Time";
  const response = await adapter.save(settings);
  assert.equal(response.settings.bookingTypes[0].id, "full-time");
  assert.equal(response.settings.bookingTypes[0].name, "Updated Full-Time");
});
