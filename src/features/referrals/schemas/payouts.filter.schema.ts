import { z } from "zod";

export const payoutsFilterSchema = z.object({
  search: z.string(),
  status: z.enum(["ALL", "Paid", "Pending", "Processing", "Failed"]),
  range: z.enum(["ALL", "30", "7", "1"]),
  referrer: z.string(),
  sort: z.enum(["NEWEST", "OLDEST"]),
});
export type PayoutsFilters = z.infer<typeof payoutsFilterSchema>;
export const PAYOUT_FILTER_DEFAULTS: PayoutsFilters = {
  search: "",
  status: "ALL",
  range: "30",
  referrer: "ALL",
  sort: "NEWEST",
};
