import assert from "node:assert/strict";
import { test } from "node:test";
import { createMockContentSettingsAdapter } from "./settings.content.adapter";
import { MOCK_CONTENT_SETTINGS } from "./data/settings.content.data";
import { contentCategoriesSchema } from "./schemas/settings.content.schema";

test("content snapshots are isolated and save categories without changing aggregates", async () => {
  const adapter = createMockContentSettingsAdapter();
  const first = await adapter.load();
  first.settings.categoryGroups[0].categories[0].name = "Preview Category";
  assert.notEqual(
    (await adapter.load()).settings.categoryGroups[0].categories[0].name,
    "Preview Category",
  );
  const saved = await adapter.save(first.settings);
  saved.settings.categoryGroups[0].categories[0].name = "Changed again";
  assert.equal(
    (await adapter.load()).settings.categoryGroups[0].categories[0].name,
    "Preview Category",
  );
  assert.deepEqual(saved.stats, MOCK_CONTENT_SETTINGS.stats);
  assert.deepEqual(saved.activity, MOCK_CONTENT_SETTINGS.activity);
});
test("content validation rejects invalid numbers and duplicate categories", async () => {
  const adapter = createMockContentSettingsAdapter();
  const { settings } = await adapter.load();
  await assert.rejects(adapter.save({ ...settings, postsPerPage: 0 }));
  await assert.rejects(adapter.save({ ...settings, maxActiveBanners: 1.5 }));
  const categories = [
    { id: "one", name: "Campus" },
    { id: "two", name: " campus " },
  ];
  assert.equal(
    contentCategoriesSchema.safeParse({ categories }).success,
    false,
  );
  const groups = structuredClone(settings.categoryGroups);
  groups[0].categories = categories;
  await assert.rejects(adapter.save({ ...settings, categoryGroups: groups }));
  assert.deepEqual(
    (await adapter.load()).settings,
    MOCK_CONTENT_SETTINGS.settings,
  );
});
test("editing page copy does not publish content or create audit records", async () => {
  const adapter = createMockContentSettingsAdapter();
  const { settings } = await adapter.load();
  settings.publicPages[0].body = "Updated preview copy";
  const saved = await adapter.save(settings);
  assert.equal(saved.settings.publicPages[0].body, "Updated preview copy");
  assert.equal(
    saved.settings.publicPages[0].updatedAt,
    MOCK_CONTENT_SETTINGS.settings.publicPages[0].updatedAt,
  );
  assert.deepEqual(saved.activity, MOCK_CONTENT_SETTINGS.activity);
});
test("read-only content settings cannot be saved", async () => {
  const adapter = createMockContentSettingsAdapter({
    ...MOCK_CONTENT_SETTINGS,
    canManage: false,
  });
  await assert.rejects(
    adapter.save(MOCK_CONTENT_SETTINGS.settings),
    /permission/,
  );
});
