export type ModerationAction = "WARNING" | "SUSPENSION" | "REMOVAL";

export type InfractionTrigger = "LOW_RATING" | "CANCELLATION_STRIKE" | "REPORTED_LISTING" | "POLICY_VIOLATION";

export interface ProfileModerationEvent {
  id: string;
  profileId: string;
  profileName: string;
  email: string;
  action: ModerationAction;
  trigger: InfractionTrigger;
  rating?: number;
  cancellationStrikeCount?: number;
  reason: string;
  issuedByStaffId: string;
  issuedAt: string;
  suspendedUntil?: string;
  active: boolean;
}
