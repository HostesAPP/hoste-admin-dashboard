import assert from "node:assert/strict";
import { test } from "node:test";
import { createMockAccessAdapter } from "./settings.access.adapter";
import { MOCK_ACCESS_SNAPSHOT } from "./data/settings.access.data";
import {
  addAccessAdminSchema,
  createAccessAdminSchema,
} from "./schemas/settings.access.schema";

test("loading returns isolated snapshots and invitations reject duplicate emails", async () => {
  const adapter = createMockAccessAdapter();
  const initial = await adapter.load();
  initial.admins.length = 0;
  assert.equal((await adapter.load()).admins.length, 8);
  const result = await adapter.execute({
    type: "invite",
    name: "Preview Admin",
    email: "preview@example.com",
    roleId: "OPERATIONS",
  });
  assert.equal(result.admins.length, 9);
  assert.equal(result.admins.at(-1)?.status, "Invited");
  await assert.rejects(
    adapter.execute({
      type: "invite",
      name: "Preview Admin",
      email: "PREVIEW@example.com",
      roleId: "OPERATIONS",
    }),
    /already exists/,
  );
});

test("role and permission updates return a fresh snapshot", async () => {
  const adapter = createMockAccessAdapter();
  const admin = MOCK_ACCESS_SNAPSHOT.admins[2];
  const result = await adapter.execute({
    type: "admin-role",
    id: admin.id,
    roleId: "FINANCE",
  });
  assert.equal(
    result.admins.find((item) => item.id === admin.id)?.roleId,
    "FINANCE",
  );
  assert.equal(MOCK_ACCESS_SNAPSHOT.admins[2].roleId, "OPERATIONS");
});

test("suspending and reactivating an account keeps aggregate counts consistent", async () => {
  const adapter = createMockAccessAdapter();
  const account = MOCK_ACCESS_SNAPSHOT.accounts.find(
    (item) => item.status === "Active",
  )!;
  await assert.rejects(
    adapter.execute({ type: "account", id: account.id, status: "Suspended" }),
    /reason/,
  );
  const suspended = await adapter.execute({
    type: "account",
    id: account.id,
    status: "Suspended",
    reason: "Test review",
  });
  assert.equal(
    suspended.accountTotals.Suspended,
    MOCK_ACCESS_SNAPSHOT.accountTotals.Suspended + 1,
  );
  const active = await adapter.execute({
    type: "account",
    id: account.id,
    status: "Active",
  });
  assert.deepEqual(active.accountTotals, MOCK_ACCESS_SNAPSHOT.accountTotals);
});

test("read-only capabilities block mutations", async () => {
  const adapter = createMockAccessAdapter({
    ...MOCK_ACCESS_SNAPSHOT,
    canManage: false,
  });
  await assert.rejects(
    adapter.execute({
      type: "settings",
      values: MOCK_ACCESS_SNAPSHOT.settings,
    }),
    /permission/,
  );
});

test("saved settings do not retain references to submitted form values", async () => {
  const adapter = createMockAccessAdapter();
  const values = { ...MOCK_ACCESS_SNAPSHOT.settings, maxLoginAttempts: 9 };
  await adapter.execute({ type: "settings", values });
  values.maxLoginAttempts = 1;
  assert.equal((await adapter.load()).settings.maxLoginAttempts, 9);
});

test("creation validates email and matching passwords", () => {
  assert.equal(
    addAccessAdminSchema.safeParse({
      name: "Admin",
      email: "invalid",
      roleId: "FINANCE",
    }).success,
    false,
  );
  const values = {
    name: "Admin",
    email: "test@example.com",
    roleId: "FINANCE",
    temporaryPassword: "TestOnly1!",
    confirmPassword: "Wrong1!",
    permissions: MOCK_ACCESS_SNAPSHOT.roles[2].permissions,
  };
  assert.equal(createAccessAdminSchema.safeParse(values).success, false);
  assert.equal(
    createAccessAdminSchema.safeParse({
      ...values,
      confirmPassword: values.temporaryPassword,
    }).success,
    true,
  );
});
