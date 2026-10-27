import assert from "node:assert/strict";
import { test } from "node:test";
import { MOCK_EARNINGS_DATA } from "./data/earnings.data";
import { MOCK_DIRECTORY_REFERRERS } from "./data/referrers.data";
import { createMockEarningsAdapter } from "./earnings.adapter";
import { earningInRange, filterEarnings } from "./earnings.utils";
import {
  EARNINGS_FILTER_DEFAULTS,
  referralConfigurationSchema,
} from "./schemas/earnings.schema";

test("earning fixtures reuse directory referrers and preserve supplied payout dates", () => {
  for (const row of MOCK_EARNINGS_DATA.rows) {
    assert.ok(
      MOCK_DIRECTORY_REFERRERS.some((person) => person.id === row.referrerId),
    );
    assert.equal(row.paidAt !== null, row.status === "Paid");
    if (row.paidAt) assert.ok(row.paidAt >= row.qualifiedAt);
  }
});

test("earnings filter by person, status, referrer, range and sorting without mutating input", () => {
  const { rows, summary } = MOCK_EARNINGS_DATA;
  const before = structuredClone(rows);
  const filter = (changes: Partial<typeof EARNINGS_FILTER_DEFAULTS>) =>
    filterEarnings(
      rows,
      MOCK_DIRECTORY_REFERRERS,
      { ...EARNINGS_FILTER_DEFAULTS, ...changes },
    );
  assert.equal(
    filter({ search: "Chiamaka" })[0].referrerId,
    "promoter-chiamaka",
  );
  assert.equal(filter({ search: "daniel" })[0].referredPerson, "Daniel Eze");
  assert.equal(filter({ status: "Pending" }).length, 2);
  assert.equal(filter({ referrer: "promoter-tobi" }).length, 1);
  assert.equal(filter({ dateFrom: summary.periodEnd, dateTo: summary.periodEnd }).length, 1);
  assert.equal(filter({ search: "missing" }).length, 0);
  assert.equal(filter({ sort: "OLDEST" })[0].qualifiedAt, "2026-08-28");
  assert.deepEqual(rows, before);
  assert.equal(earningInRange("2026-08-04", "2026-08-04", summary.periodEnd), true);
  assert.equal(earningInRange("2026-08-03", "2026-08-04", summary.periodEnd), false);
  assert.equal(earningInRange("2026-09-03", "2026-08-04", summary.periodEnd), false);
  assert.equal(earningInRange("2026-09-02T23:59:59+01:00", "", summary.periodEnd), true);
  assert.equal(earningInRange("2026-09-03", "", ""), true);
});

test("configuration validation rejects invalid amounts", () => {
  const settings = MOCK_EARNINGS_DATA.configuration;
  for (const rewardAmount of [0, -1, 1.5, NaN, Infinity]) {
    assert.equal(
      referralConfigurationSchema.safeParse({ ...settings, rewardAmount })
        .success,
      false,
    );
  }
  assert.equal(
    referralConfigurationSchema.safeParse({ ...settings, minimumPayout: -1 })
      .success,
    false,
  );
  assert.equal(referralConfigurationSchema.safeParse(settings).success, true);
});

test("preview configuration saves leave earnings, summaries and charts unchanged", async () => {
  const adapter = createMockEarningsAdapter();
  const before = await adapter.load();
  const settings = {
    ...before.configuration,
    rewardAmount: 2000,
    minimumPayout: 6000,
    notifyPayoutFailed: false,
  };
  await adapter.saveConfiguration(settings);
  const after = await adapter.load();
  assert.deepEqual(after.configuration, settings);
  assert.deepEqual(after.rows, before.rows);
  assert.deepEqual(after.summary, before.summary);
  assert.deepEqual(after.chart, before.chart);
  after.rows[0].amount = 1;
  assert.equal((await adapter.load()).rows[0].amount, 1000);
  assert.equal(MOCK_EARNINGS_DATA.configuration.rewardAmount, 1000);
});

test("read-only preview configuration cannot be modified", async () => {
  const adapter = createMockEarningsAdapter({
    ...MOCK_EARNINGS_DATA,
    canManage: false,
  });
  await assert.rejects(
    adapter.saveConfiguration(MOCK_EARNINGS_DATA.configuration),
    /permission/,
  );
});
