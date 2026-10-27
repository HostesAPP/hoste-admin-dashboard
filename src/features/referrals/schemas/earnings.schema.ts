import { z } from "zod";

export const earningsFilterSchema = z.object({
  search: z.string(),
  status: z.enum(["ALL", "Paid", "Pending"]),
  dateFrom: z.string(),
  dateTo: z.string(),
  referrer: z.string(),
  sort: z.enum(["NEWEST", "OLDEST"]),
});
export type EarningsFilters = z.infer<typeof earningsFilterSchema>;
export const EARNINGS_FILTER_DEFAULTS: EarningsFilters = {
  search: "",
  status: "ALL",
  dateFrom: "",
  dateTo: "",
  referrer: "ALL",
  sort: "NEWEST",
};

export const referralConfigurationSchema = z.object({
  rewardAmount: z
    .number()
    .finite()
    .int()
    .positive("Enter a reward greater than zero."),
  minimumPayout: z
    .number()
    .finite()
    .int()
    .nonnegative("Minimum payout cannot be negative."),
  requireAccount: z.boolean(),
  requireQualifyingAction: z.boolean(),
  requireApproval: z.boolean(),
  allowRetry: z.boolean(),
  notifyRewardApproved: z.boolean(),
  notifyPayoutCompleted: z.boolean(),
  notifyPayoutFailed: z.boolean(),
});
