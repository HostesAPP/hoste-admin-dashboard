import assert from "node:assert/strict";
import { test } from "node:test";
import { createMockFinanceSettingsAdapter } from "./settings.finance.adapter";
import { MOCK_FINANCE_SETTINGS } from "./data/settings.finance.data";

test("finance loads and saves isolated snapshots without changing stats or activity", async () => {
  const adapter = createMockFinanceSettingsAdapter();
  const first = await adapter.load();
  first.settings.holdingDays = 7;
  assert.equal((await adapter.load()).settings.holdingDays, 3);
  const saved = await adapter.save(first.settings);
  first.settings.holdingDays = 12;
  saved.settings.holdingDays = 20;
  assert.equal((await adapter.load()).settings.holdingDays, 7);
  assert.deepEqual(saved.stats, MOCK_FINANCE_SETTINGS.stats);
  assert.deepEqual(saved.activity, MOCK_FINANCE_SETTINGS.activity);
});

test("finance rejects invalid transaction ranges and percentage commissions", async () => {
  const adapter = createMockFinanceSettingsAdapter();
  const { settings } = await adapter.load();
  await assert.rejects(adapter.save({ ...settings, maximumTransaction: 1 }));
  await assert.rejects(
    adapter.save({
      ...settings,
      commissions: [{ ...settings.commissions[0], value: 101 }],
    }),
  );
  assert.deepEqual(
    (await adapter.load()).settings,
    MOCK_FINANCE_SETTINGS.settings,
  );
});

test("gateway configuration never retains credentials or claims a live connection", async () => {
  const adapter = createMockFinanceSettingsAdapter();
  const input = {
    publicKey: "dummy-public-test-only",
    secretKey: "dummy-secret-test-only",
    mode: "TEST" as const,
  };
  const gateway = await adapter.configureGateway(input);
  assert.equal(gateway.mode, "TEST");
  assert.equal(gateway.connected, false);
  assert.equal(gateway.webhookActive, false);
  const stored = JSON.stringify(await adapter.load());
  assert.equal(stored.includes(input.publicKey), false);
  assert.equal(stored.includes(input.secretKey), false);
  assert.match(
    await adapter.testConnection(),
    /No gateway connection was attempted/,
  );
});

test("read-only finance rejects every management operation", async () => {
  const adapter = createMockFinanceSettingsAdapter({
    ...MOCK_FINANCE_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_FINANCE_SETTINGS.settings),
    /permission/,
  );
  await assert.rejects(
    adapter.configureGateway({
      publicKey: "dummy",
      secretKey: "",
      mode: "TEST",
    }),
    /permission/,
  );
  await assert.rejects(adapter.testConnection(), /permission/);
});
