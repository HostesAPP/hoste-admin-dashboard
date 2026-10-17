import { MOCK_AUDIT_LOGS } from "./auditLog.data";
import type { AuditLogSnapshot } from "../types/audit-log.types";

// Aggregate preview metrics from the design; the table counts only available records.
export const MOCK_AUDIT_SNAPSHOT: AuditLogSnapshot = {
  records: MOCK_AUDIT_LOGS,
  periodEnd: "2026-09-18",
  summary: { total: 14892, today: 142, activeStaff: 8, highImpact: 3 },
};

export const AUDIT_ACTION_LABELS: Record<
  string,
  { label: string; tone: "success" | "danger" | "primary" | "neutral" }
> = {
  UPDATE_CONFIG: { label: "Settings Updated", tone: "neutral" },
  APPROVE_VERIFICATION: { label: "Approved Verification", tone: "success" },
  TRIGGER_MANUAL_REFUND: { label: "Manual Refund", tone: "primary" },
  SUSPEND_PROFILE: { label: "Suspended Profile", tone: "danger" },
};

export const AUDIT_STAFF_LABELS: Record<string, string> = {
  "sprof-superadmin-01": "Staff #001",
  "sprof-vo-01": "Staff #104",
  "sprof-finance-01": "Staff #208",
};
export const AUDIT_ENTITY_LABELS: Record<string, string> = {
  PlatformConfig: "Platform Config",
};
