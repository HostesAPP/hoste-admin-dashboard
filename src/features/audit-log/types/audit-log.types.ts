import type { AuditLogItem } from "./auditLog.types";

export interface AuditLogSnapshot {
  records: AuditLogItem[];
  inspections?: Record<string, AuditLogInspection>;
  periodEnd: string;
  summary: {
    total: number;
    today: number;
    activeStaff: number;
    highImpact: number;
  };
}

// Optional presentation metadata from the inspection design, not a database contract.
export interface AuditLogInspection {
  staffName?: string | null;
  staffRole?: string | null;
  subject?: {
    name?: string | null;
    category?: string | null;
    location?: string | null;
    previousStatus?: string | null;
    currentStatus?: string | null;
  } | null;
  clientIpHash?: string | null;
  sessionId?: string | null;
  originRoute?: string | null;
}

export interface AuditLogFilters {
  search: string;
  range: "7" | "30" | "ALL";
  staff: string;
  action: string;
  entity: string;
}
