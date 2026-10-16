import { z } from "zod";

export const referralActivitySchema = z.object({
  search: z.string(),
  status: z.enum(["ALL", "Qualified", "Pending", "Flagged"]),
  type: z.enum(["ALL", "Student", "Brand", "Individual", "Club", "Partner"]),
  reward: z.enum(["ALL", "EARNED", "NONE"]),
  range: z.enum(["30", "7", "1", "ALL"]),
});

export type ReferralActivityFilters = z.infer<typeof referralActivitySchema>;

export const ACTIVITY_FILTER_DEFAULTS: ReferralActivityFilters = {
  search: "",
  status: "ALL",
  type: "ALL",
  reward: "ALL",
  range: "30",
};

export const ACTIVITY_RANGES = [
  { value: "30", label: "Last 30 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "1", label: "Today" },
  { value: "ALL", label: "All Time" },
];
