import type { BannerItem } from "@/features/banners/types/banners.types";

/**
 * Parses a banner date into a Date object.
 * Returns null when the date is missing, invalid, or "Not set".
 */
export const parseBannerDate = (value: string): Date | null => {
  if (!value || value === "Not set") {
    return null;
  }

  // Support the date format used in your Banner Management page:
  // "01 Aug 2026" and "31 Aug 2026".
  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
};

/**
 * Returns the banner date exactly as stored.
 * This preserves your current UI formatting.
 */
export const formatBannerDate = (value: string): string => {
  return value || "Not set";
};

/**
 * Checks whether a banner's start date matches the selected date filter.
 *
 * Supported filters:
 * - All Time
 * - This Month
 * - Last Month
 */
export const matchesBannerDateFilter = (
  startDate: string,
  filter: string,
): boolean => {
  if (filter === "All Time") {
    return true;
  }

  const date = parseBannerDate(startDate);

  if (!date) {
    return false;
  }

  const now = new Date();

  let targetMonth: Date;

  if (filter === "Last Month") {
    targetMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
  } else if (filter === "This Month") {
    targetMonth = new Date(now.getFullYear(), now.getMonth(), 1);
  } else {
    // Unknown filters should not exclude banners.
    return true;
  }

  return (
    date.getFullYear() === targetMonth.getFullYear() &&
    date.getMonth() === targetMonth.getMonth()
  );
};

/**
 * Filters banners by their start date.
 * Useful when you want to reuse the date-filter logic elsewhere.
 */
export const filterBannersByDate = (
  banners: BannerItem[],
  filter: string,
): BannerItem[] => {
  if (filter === "All Time") {
    return banners;
  }

  return banners.filter((banner) =>
    matchesBannerDateFilter(banner.startDate, filter),
  );
};
