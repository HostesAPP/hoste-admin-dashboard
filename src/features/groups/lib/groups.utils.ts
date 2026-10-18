// features/groups/lib/groups.utils.ts

import type { GroupStatus } from "../types/groups.types";

/**
 * Normalizes backend group status string into UI status value
 */
export function normalizeGroupStatus(status?: string): GroupStatus {
  if (!status) return "Active";
  const s = status.toUpperCase();
  if (s === "ACTIVE") return "Active";
  if (s === "PAUSED") return "Paused";
  if (s === "INACTIVE") return "Inactive";
  return status;
}