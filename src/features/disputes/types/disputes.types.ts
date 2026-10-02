export type DisputePriority = "LOW" | "MEDIUM" | "HIGH" | "URGENT";
export type DisputeTeam = "FINANCE_DISPUTES" | "TRUST_SAFETY" | "OPERATIONS_DISPUTES" | "LEGAL";

export interface ReportDispute {
  id: string;
  engagementId?: string;
  supportTicketId?: string;
  reportedEntityType?: string;
  reportedEntityId?: string;
  description: string; // Customer-facing
  internalNote: string; // Staff-only (DTO restricted)
  issueCategory: string;
  assignedDisputeTeam: DisputeTeam;
  priorityLevel: DisputePriority;
  whatHasBeenTried: string;
  notifyCustomer: boolean;
  evidenceUrls: string[];
  status: "OPEN" | "UNDER_REVIEW" | "RESOLVED_REFUNDED" | "RESOLVED_DISMISSED";
  createdAt: string;
  updatedAt: string;
}
