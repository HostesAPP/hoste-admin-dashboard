import type { EarningsFilters } from "./schemas/earnings.schema";
import type { ReferralEarning } from "./types/earnings.types";
import type { DirectoryReferrer } from "./types/referrers.types";

export function earningInRange(
  date: string,
  periodEnd: string,
  range: EarningsFilters["range"],
) {
  if (range === "ALL") return true;
  const end = Date.parse(`${periodEnd}T00:00:00Z`) + 86400000;
  const value = Date.parse(date);
  return value >= end - Number(range) * 86400000 && value < end;
}

export function filterEarnings(
  rows: ReferralEarning[],
  referrers: DirectoryReferrer[],
  filters: EarningsFilters,
  periodEnd: string,
) {
  const query = filters.search.trim().toLowerCase();
  return rows
    .filter((row) => {
      const person = referrers.find((item) => item.id === row.referrerId);
      return (
        earningInRange(row.qualifiedAt, periodEnd, filters.range) &&
        (filters.status === "ALL" || filters.status === row.status) &&
        (filters.referrer === "ALL" || filters.referrer === row.referrerId) &&
        `${person?.name ?? ""} ${row.referredPerson}`
          .toLowerCase()
          .includes(query)
      );
    })
    .sort((a, b) =>
      filters.sort === "NEWEST"
        ? Date.parse(b.qualifiedAt) - Date.parse(a.qualifiedAt)
        : Date.parse(a.qualifiedAt) - Date.parse(b.qualifiedAt),
    );
}
