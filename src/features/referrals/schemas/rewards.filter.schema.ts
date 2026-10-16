import { z } from "zod";

export const rewardsFilterSchema = z.object({
  search: z.string(),
  status: z.enum([
    "ALL",
    "Pending Review",
    "Approved",
    "Rejected",
    "Eligible for Payout",
  ]),
  type: z.enum([
    "ALL",
    "Student",
    "Club / Organization",
    "Brand",
    "Individual",
    "Brand / Partner",
  ]),
  range: z.enum(["ALL", "30", "7", "1"]),
});
export type RewardsFilters = z.infer<typeof rewardsFilterSchema>;
export const REWARDS_FILTER_DEFAULTS: RewardsFilters = {
  search: "",
  status: "ALL",
  type: "ALL",
  range: "30",
};
export const rewardReviewSchema = z.object({
  note: z.string(),
});
export type RewardReviewValues = z.infer<typeof rewardReviewSchema>;
