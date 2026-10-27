import type { EarningsFilters } from "./schemas/earnings.schema";
import { referralInDateRange } from "./referrals.date.utils";
import type { ReferralEarning } from "./types/earnings.types";
import type { DirectoryReferrer } from "./types/referrers.types";

export function earningInRange(
  date: string,
  dateFrom: string,
  dateTo: string,
) {
  return referralInDateRange(date, dateFrom, dateTo);
}

export function filterEarnings(
  rows: ReferralEarning[],
  referrers: DirectoryReferrer[],
  filters: EarningsFilters,
) {
  const query = filters.search.trim().toLowerCase();
  return rows
    .filter((row) => {
      const person = referrers.find((item) => item.id === row.referrerId);
      return (
        earningInRange(row.qualifiedAt, filters.dateFrom, filters.dateTo) &&
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
