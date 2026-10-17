import assert from "node:assert/strict";
import { test } from "node:test";
import { MOCK_AUDIT_SNAPSHOT } from "./data/audit-log.data";
import {
  AUDIT_FILTER_DEFAULTS,
  auditCsv,
  filterAuditLogs,
  formatAuditTime,
  formatAuditInspectionTimestamp,
} from "./audit-log.utils";

test("audit filtering preserves immutable source records and sorts newest first", () => {
  const before = structuredClone(MOCK_AUDIT_SNAPSHOT.records);
  const rows = filterAuditLogs(
    MOCK_AUDIT_SNAPSHOT.records,
    AUDIT_FILTER_DEFAULTS,
    MOCK_AUDIT_SNAPSHOT.periodEnd,
  );
  assert.equal(rows.length, 4);
  assert.equal(rows[0].id, "LOG-1001");
  rows.pop();
  assert.deepEqual(MOCK_AUDIT_SNAPSHOT.records, before);
});

test("audit filters combine staff, action, entity and display-label search", () => {
  const filter = (changes: Partial<typeof AUDIT_FILTER_DEFAULTS>) =>
    filterAuditLogs(
      MOCK_AUDIT_SNAPSHOT.records,
      { ...AUDIT_FILTER_DEFAULTS, ...changes },
      MOCK_AUDIT_SNAPSHOT.periodEnd,
    );
  assert.equal(filter({ search: "staff #104" })[0].id, "LOG-1002");
  assert.equal(filter({ search: "Settings Updated" })[0].id, "LOG-1001");
  assert.equal(filter({ search: "REF-260917-009" })[0].id, "LOG-1003");
  assert.equal(filter({ staff: "sprof-superadmin-01" }).length, 2);
  assert.equal(
    filter({ action: "SUSPEND_PROFILE", entity: "Refund" }).length,
    0,
  );
  assert.equal(filter({ entity: "Refund" }).length, 1);
  assert.equal(filter({ search: "missing" }).length, 0);
  assert.equal(
    filter({ range: "ALL", action: "TRIGGER_MANUAL_REFUND" }).length,
    1,
  );
});

test("audit date boundaries and clock use West Africa Time", () => {
  const sample = MOCK_AUDIT_SNAPSHOT.records[0];
  const records = [
    { ...sample, id: "inside", timestamp: "2026-09-11T23:00:00Z" },
    { ...sample, id: "before", timestamp: "2026-09-11T22:59:59Z" },
    { ...sample, id: "after", timestamp: "2026-09-18T23:00:00Z" },
  ];
  assert.deepEqual(
    filterAuditLogs(records, AUDIT_FILTER_DEFAULTS, "2026-09-18").map(
      (row) => row.id,
    ),
    ["inside"],
  );
  assert.equal(formatAuditTime("2026-09-18T14:32:00Z"), "15:32:00 WAT");
});

test("inspection timestamps retain seconds and show the WAT calendar day", () => {
  const formatted = formatAuditInspectionTimestamp("2026-09-18T23:32:04Z");
  assert.match(formatted, /19 September 2026/);
  assert.match(formatted, /12:32:04\s+AM/);
  assert.ok(formatted.endsWith(" WAT"));
});

test("audit CSV retains raw identifiers and guards formulas, quotes and newlines", () => {
  const original = MOCK_AUDIT_SNAPSHOT.records[0];
  const csv = auditCsv([{ ...original, description: '=SUM(1,2)\n"quoted"' }]);
  assert.ok(csv.startsWith("\uFEFF"));
  assert.ok(csv.includes('"UPDATE_CONFIG"'));
  assert.ok(csv.includes('"sprof-superadmin-01"'));
  assert.ok(csv.includes('"\'=SUM(1,2)\n""quoted"""'));
  assert.ok(csv.includes('"102.89.23.44"'));
});
