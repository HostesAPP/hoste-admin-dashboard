import { z } from "zod";

export const referrersFilterSchema = z.object({
  search: z.string(),
  status: z.enum(["ALL", "Active", "Inactive", "Suspended"]),
  qualification: z.enum(["ALL", "QUALIFIED", "PENDING"]),
  range: z.enum(["ALL", "30", "7", "1"]),
});
export type ReferrersFilters = z.infer<typeof referrersFilterSchema>;
export const REFERRERS_FILTER_DEFAULTS: ReferrersFilters = {
  search: "",
  status: "ALL",
  qualification: "ALL",
  range: "30",
};

export const REFERRER_RANGES = [
  { value: "ALL", label: "All Time" },
  { value: "30", label: "Last 30 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "1", label: "Today" },
];
