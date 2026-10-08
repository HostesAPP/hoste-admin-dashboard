import assert from "node:assert/strict";
import { test } from "node:test";
import { MOCK_NOTIFICATION_SETTINGS } from "./data/settings.notifications.data";
import { createMockNotificationSettingsAdapter } from "./settings.notifications.adapter";

test("notification settings snapshot is isolated and saves the draft", async () => {
  const adapter = createMockNotificationSettingsAdapter();
  const first = await adapter.load();
  first.settings.userPreferences[0].email = false;
  assert.equal((await adapter.load()).settings.userPreferences[0].email, true);
  const saved = await adapter.save(first.settings);
  first.settings.userPreferences[0].email = true;
  saved.settings.userPreferences[0].email = true;
  assert.equal((await adapter.load()).settings.userPreferences[0].email, false);
  assert.deepEqual(saved.stats, MOCK_NOTIFICATION_SETTINGS.stats);
  assert.deepEqual(saved.activity, MOCK_NOTIFICATION_SETTINGS.activity);
});

test("notification settings reject invalid times and retry limits without saving", async () => {
  const adapter = createMockNotificationSettingsAdapter();
  const { settings } = await adapter.load();
  await assert.rejects(adapter.save({ ...settings, quietStart: "25:00" }));
  await assert.rejects(adapter.save({ ...settings, maxRetries: -1 }));
  await assert.rejects(adapter.save({ ...settings, maxRetries: 1.5 }));
  assert.deepEqual(
    (await adapter.load()).settings,
    MOCK_NOTIFICATION_SETTINGS.settings,
  );
});

test("provider configuration changes are not reported as connected", async () => {
  const adapter = createMockNotificationSettingsAdapter();
  const { settings } = await adapter.load();
  settings.channels[0].configuration.sender = "Preview Sender";
  const saved = await adapter.save(settings);
  assert.equal(saved.channels[0].status, "Not verified");
  assert.deepEqual(saved.activity, MOCK_NOTIFICATION_SETTINGS.activity);
});

test("notification settings enforce read-only writes", async () => {
  const adapter = createMockNotificationSettingsAdapter({
    ...MOCK_NOTIFICATION_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_NOTIFICATION_SETTINGS.settings),
    /permission/,
  );
  await assert.rejects(
    adapter.testEmail({
      provider: "SendGrid API",
      sender: "Preview",
      senderEmail: "preview@example.com",
      replyTo: "support@example.com",
    }),
    /permission/,
  );
});

test("email test validates configuration and never claims a delivery", async () => {
  const adapter = createMockNotificationSettingsAdapter();
  const configuration = {
    provider: "SendGrid API",
    sender: "Preview",
    senderEmail: "preview@example.com",
    replyTo: "support@example.com",
  };
  assert.match(await adapter.testEmail(configuration), /No email was sent/);
  await assert.rejects(
    adapter.testEmail({ ...configuration, senderEmail: "invalid" }),
  );
  assert.deepEqual(
    (await adapter.load()).activity,
    MOCK_NOTIFICATION_SETTINGS.activity,
  );
});

test("category preferences persist without mutating platform defaults", async () => {
  const adapter = createMockNotificationSettingsAdapter();
  const snapshot = await adapter.load();
  snapshot.settings.userPreferences[0].categories[0].email = false;
  await adapter.save(snapshot.settings);
  const saved = await adapter.load();
  assert.equal(saved.settings.userPreferences[0].categories[0].email, false);
  assert.equal(saved.defaults.userPreferences[0].categories[0].email, true);
  saved.defaults.userPreferences[0].categories[0].email = false;
  assert.equal(
    (await adapter.load()).defaults.userPreferences[0].categories[0].email,
    true,
  );
});
