import { z } from "zod";

export const payoutsFilterSchema = z.object({
  search: z.string(),
  status: z.enum(["ALL", "Paid", "Pending", "Processing", "Failed"]),
  dateFrom: z.string(),
  dateTo: z.string(),
  referrer: z.string(),
  sort: z.enum(["NEWEST", "OLDEST"]),
});
export type PayoutsFilters = z.infer<typeof payoutsFilterSchema>;
export const PAYOUT_FILTER_DEFAULTS: PayoutsFilters = {
  search: "",
  status: "ALL",
  dateFrom: "",
  dateTo: "",
  referrer: "ALL",
  sort: "NEWEST",
};
