import assert from "node:assert/strict";
import { test } from "node:test";
import { MOCK_SECURITY_SETTINGS } from "./data/settings.security.data";
import { createMockSecuritySettingsAdapter } from "./settings.security.adapter";
import {
  parseSecurityAddresses,
  securityIpEditorSchema,
  securitySettingsSchema,
} from "./schemas/settings.security.schema";

test("security settings snapshots are isolated and do not create audit events", async () => {
  const adapter = createMockSecuritySettingsAdapter();
  const first = await adapter.load();
  first.settings.minimumPasswordLength = 14;
  assert.equal((await adapter.load()).settings.minimumPasswordLength, 12);
  const saved = await adapter.save(first.settings);
  saved.settings.minimumPasswordLength = 20;
  assert.equal((await adapter.load()).settings.minimumPasswordLength, 14);
  assert.deepEqual(saved.activity, MOCK_SECURITY_SETTINGS.activity);
  assert.deepEqual(saved.stats, MOCK_SECURITY_SETTINGS.stats);
});
test("administrator 2FA enforcement cannot be disabled", () => {
  for (const name of [
    "twoFactorEnabled",
    "requireAllAdmins",
    "requireSuperAdmins",
  ] as const)
    assert.equal(
      securitySettingsSchema.safeParse({
        ...MOCK_SECURITY_SETTINGS.settings,
        [name]: false,
      }).success,
      false,
    );
});
test("IP restriction editor validates standard IP addresses and CIDR blocks", () => {
  assert.equal(
    securityIpEditorSchema.safeParse({
      enabled: true,
      addresses: "192.168.1.0/24, 10.0.0.2\n2001:db8::/32",
    }).success,
    true,
  );
  for (const addresses of ["", "999.1.1.1", "192.168.1.0/33"])
    assert.equal(
      securityIpEditorSchema.safeParse({ enabled: true, addresses }).success,
      false,
    );
  assert.deepEqual(parseSecurityAddresses(" 192.168.1.0/24,\n10.0.0.2 "), [
    "192.168.1.0/24",
    "10.0.0.2",
  ]);
});
test("session revocation protects the current session", async () => {
  const adapter = createMockSecuritySettingsAdapter();
  await assert.rejects(
    adapter.revokeSession("session-current"),
    /current session/,
  );
  await assert.rejects(adapter.revokeSession("missing"), /no longer available/);
  const saved = await adapter.revokeSession("session-dell");
  assert.equal(
    saved.sessions.some((session) => session.id === "session-dell"),
    false,
  );
  assert.equal(
    saved.sessions.some((session) => session.status === "Current"),
    true,
  );
  assert.deepEqual(saved.activity, MOCK_SECURITY_SETTINGS.activity);
});
test("signing out other mock sessions preserves current session and settings", async () => {
  const adapter = createMockSecuritySettingsAdapter();
  const saved = await adapter.signOutOthers();
  assert.deepEqual(
    saved.sessions.map((session) => session.id),
    ["session-current"],
  );
  assert.deepEqual(saved.settings, MOCK_SECURITY_SETTINGS.settings);
});
test("read-only security settings reject writes and session actions", async () => {
  const adapter = createMockSecuritySettingsAdapter({
    ...MOCK_SECURITY_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_SECURITY_SETTINGS.settings),
    /permission/,
  );
  await assert.rejects(adapter.revokeSession("session-dell"), /permission/);
  await assert.rejects(adapter.signOutOthers(), /permission/);
});
