export interface AuditLogItem {
  id: string;
  timestamp: string;
  staffUserId: string;
  staffProfileId: string;
  action: string;
  entityType: string;
  entityId: string;
  description: string;
  ip: string;
}
