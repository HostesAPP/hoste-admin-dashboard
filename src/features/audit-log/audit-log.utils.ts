import type { AuditLogItem } from "./types/auditLog.types";
import type { AuditLogFilters } from "./types/audit-log.types";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  AUDIT_STAFF_LABELS,
} from "./data/audit-log.data";

export const AUDIT_FILTER_DEFAULTS: AuditLogFilters = {
  search: "",
  range: "7",
  staff: "ALL",
  action: "ALL",
  entity: "ALL",
};

export function filterAuditLogs(
  records: AuditLogItem[],
  filters: AuditLogFilters,
  periodEnd: string,
) {
  const end = Date.parse(`${periodEnd}T00:00:00+01:00`) + 86400000;
  const query = filters.search.trim().toLowerCase();
  return records
    .filter((log) => {
      const timestamp = Date.parse(log.timestamp);
      return (
        (filters.range === "ALL" ||
          (timestamp >= end - Number(filters.range) * 86400000 &&
            timestamp < end)) &&
        (filters.staff === "ALL" || log.staffProfileId === filters.staff) &&
        (filters.action === "ALL" || log.action === filters.action) &&
        (filters.entity === "ALL" || log.entityType === filters.entity) &&
        `${log.id} ${log.staffProfileId} ${log.staffUserId} ${AUDIT_STAFF_LABELS[log.staffProfileId] ?? ""} ${log.action} ${AUDIT_ACTION_LABELS[log.action]?.label ?? ""} ${log.entityType} ${AUDIT_ENTITY_LABELS[log.entityType] ?? ""} ${log.entityId} ${log.description} ${log.ip}`
          .toLowerCase()
          .includes(query)
      );
    })
    .sort((a, b) => Date.parse(b.timestamp) - Date.parse(a.timestamp));
}

export function formatAuditDate(value: string) {
  return new Date(value).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
    timeZone: "Africa/Lagos",
  });
}
export function formatAuditTime(value: string) {
  return `${new Date(value).toLocaleTimeString("en-GB", { hour12: false, timeZone: "Africa/Lagos" })} WAT`;
}
export function formatAuditInspectionTimestamp(value: string) {
  return `${new Intl.DateTimeFormat("en-GB", {
    dateStyle: "long",
    timeStyle: "medium",
    hour12: true,
    timeZone: "Africa/Lagos",
  })
    .formatToParts(new Date(value))
    .map((part) =>
      part.type === "dayPeriod" ? part.value.toUpperCase() : part.value,
    )
    .join("")} WAT`;
}
export function auditCsv(records: AuditLogItem[]) {
  const rows = [
    [
      "Log ID",
      "Timestamp (UTC)",
      "Staff User ID",
      "Staff Profile ID",
      "Action",
      "Entity Type",
      "Entity ID",
      "Reason / Notes",
      "IP Address",
    ],
    ...records.map((row) => [
      row.id,
      row.timestamp,
      row.staffUserId,
      row.staffProfileId,
      row.action,
      row.entityType,
      row.entityId,
      row.description,
      row.ip,
    ]),
  ];
  return (
    "\uFEFF" +
    rows
      .map((row) =>
        row
          .map((value) => {
            const cell = /^[=+@\-\t\r\n]/.test(value) ? `'${value}` : value;
            return `"${cell.replaceAll('"', '""')}"`;
          })
          .join(","),
      )
      .join("\r\n")
  );
}
