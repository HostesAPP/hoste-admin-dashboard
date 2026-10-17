import type { Metadata } from "next";
import { AuditLogPage } from "@/features/audit-log/components/audit-log.page";
import { MOCK_AUDIT_SNAPSHOT } from "@/features/audit-log/data/audit-log.data";

export const metadata: Metadata = { title: "Audit Log | Hosté Admin" };

export default function AuditLogsPage() {
  return <AuditLogPage snapshot={MOCK_AUDIT_SNAPSHOT} />;
}
