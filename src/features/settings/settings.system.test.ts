import assert from "node:assert/strict";
import { test } from "node:test";
import { MOCK_SYSTEM_SETTINGS } from "./data/settings.system.data";
import { createMockSystemSettingsAdapter } from "./settings.system.adapter";
import { systemSettingsSchema } from "./schemas/settings.system.schema";

test("system settings validate the screenshot fixture and isolate saved snapshots", async () => {
  assert.equal(
    systemSettingsSchema.safeParse(MOCK_SYSTEM_SETTINGS.settings).success,
    true,
  );
  const adapter = createMockSystemSettingsAdapter();
  const draft = await adapter.load();
  draft.settings.platformName = "Hoste Preview";
  assert.equal(
    (await adapter.load()).settings.platformName,
    MOCK_SYSTEM_SETTINGS.settings.platformName,
  );
  const saved = await adapter.save(draft.settings);
  saved.settings.platformName = "Changed response";
  assert.equal((await adapter.load()).settings.platformName, "Hoste Preview");
  assert.deepEqual(saved.stats, MOCK_SYSTEM_SETTINGS.stats);
});
test("preview infrastructure operations do not change platform data or create backups", async () => {
  const adapter = createMockSystemSettingsAdapter();
  const before = await adapter.load();
  for (const operation of [
    { type: "CLEAR_CACHE" },
    { type: "CREATE_BACKUP" },
    { type: "RESTORE_BACKUP", backupId: before.backups[0].id },
  ] as const) {
    assert.match(
      (await adapter.operate(operation)).message,
      /No (real|platform)/,
    );
  }
  assert.deepEqual(await adapter.load(), before);
});
test("restore rejects missing backup snapshots", async () => {
  await assert.rejects(
    createMockSystemSettingsAdapter().operate({
      type: "RESTORE_BACKUP",
      backupId: "missing",
    }),
    /no longer available/,
  );
});
test("maintenance scheduling validates enabled state and UTC time range", async () => {
  const adapter = createMockSystemSettingsAdapter();
  const plan = MOCK_SYSTEM_SETTINGS.settings.maintenancePlan;
  await assert.rejects(
    adapter.operate({ type: "SCHEDULE_MAINTENANCE", plan }),
    /Enable scheduled/,
  );
  await assert.rejects(
    adapter.operate({
      type: "SCHEDULE_MAINTENANCE",
      plan: { ...plan, enabled: true, endUtc: plan.startUtc },
    }),
    /End time/,
  );
  assert.match(
    (
      await adapter.operate({
        type: "SCHEDULE_MAINTENANCE",
        plan: { ...plan, enabled: true },
      })
    ).message,
    /No maintenance/,
  );
  assert.match(
    (
      await adapter.operate({
        type: "SCHEDULE_MAINTENANCE",
        plan: {
          ...plan,
          enabled: true,
          startUtc: "2026-08-28T02:00:00Z",
          endUtc: "2026-08-28T04:00:00Z",
        },
      })
    ).message,
    /No maintenance/,
  );
});
test("test email validates addresses and never sends mail", async () => {
  const adapter = createMockSystemSettingsAdapter();
  await assert.rejects(
    adapter.operate({
      type: "TEST_EMAIL",
      senderEmail: "invalid",
      replyTo: "support@hoste.ng",
    }),
  );
  assert.match(
    (
      await adapter.operate({
        type: "TEST_EMAIL",
        senderEmail: "no-reply@hoste.ng",
        replyTo: "support@hoste.ng",
      })
    ).message,
    /No email was sent/,
  );
});
test("read-only system settings reject saves and operational actions", async () => {
  const adapter = createMockSystemSettingsAdapter({
    ...MOCK_SYSTEM_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_SYSTEM_SETTINGS.settings),
    /permission/,
  );
  await assert.rejects(adapter.operate({ type: "CLEAR_CACHE" }), /permission/);
  await assert.rejects(
    adapter.operate({
      type: "RESTORE_BACKUP",
      backupId: MOCK_SYSTEM_SETTINGS.backups[0].id,
    }),
    /permission/,
  );
});
