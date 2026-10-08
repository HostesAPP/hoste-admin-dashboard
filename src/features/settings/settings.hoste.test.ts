import test from "node:test";
import assert from "node:assert/strict";
import { createMockHosteAdapter } from "./settings.hoste.adapter";
import { MOCK_HOSTE_SETTINGS } from "./data/settings.hoste.data";
import {
  hosteCommissionSchema,
  hostePlanSchema,
} from "./schemas/settings.hoste.schema";

test("mock saves are isolated from fixtures and submitted references", async () => {
  const adapter = createMockHosteAdapter();
  const snapshot = await adapter.load();
  snapshot.settings.badgeFee = 8000;
  await adapter.save(snapshot.settings);
  snapshot.settings.badgeFee = 1;
  assert.equal((await adapter.load()).settings.badgeFee, 8000);
  assert.equal(MOCK_HOSTE_SETTINGS.settings.badgeFee, 5000);
  assert.deepEqual((await adapter.load()).stats, MOCK_HOSTE_SETTINGS.stats);
});

test("read-only adapters reject saves", async () => {
  const adapter = createMockHosteAdapter({
    ...MOCK_HOSTE_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_HOSTE_SETTINGS.settings),
    /permission/,
  );
});

test("plans and commission drafts validate amounts", () => {
  assert.equal(
    hostePlanSchema.safeParse({
      ...MOCK_HOSTE_SETTINGS.settings.plans[0],
      price: -1,
    }).success,
    false,
  );
  assert.equal(
    hosteCommissionSchema.safeParse({
      ...MOCK_HOSTE_SETTINGS.settings.commissions[0],
      value: 101,
    }).success,
    false,
  );
  assert.equal(
    hosteCommissionSchema.safeParse({
      ...MOCK_HOSTE_SETTINGS.settings.commissions[0],
      type: "Fixed Amount (NGN)",
      value: 1000,
    }).success,
    true,
  );
});
