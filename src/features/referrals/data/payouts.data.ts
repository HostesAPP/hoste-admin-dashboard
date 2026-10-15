import type {
  ReferralPayout,
  ReferralPayoutSummary,
  PayoutChartPoint,
  PayoutEvent,
  PayoutRewardRecord,
  PayoutsData,
} from "../payouts.types";

export const MOCK_PAYOUT_SUMMARY: ReferralPayoutSummary = {
  periodEnd: "2026-09-02",
  totalEarnings: 842000,
  paidOut: 620000,
  pending: 222000,
  successRate: "97.8%",
};

export const MOCK_REFERRAL_PAYOUTS: ReferralPayout[] = [
  {
    id: "PYO-24090201",
    referrerId: "promoter-chiamaka",
    rewardsIncluded: 25,
    amount: 25000,
    currency: "NGN",
    status: "Paid",
    createdAt: "2026-09-02T15:05:00+01:00",
    paidAt: "2026-09-02T15:07:00+01:00",
    reference: "PYO-24090201",
  },
  {
    id: "PYO-24090102",
    referrerId: "promoter-tobi",
    rewardsIncluded: 18,
    amount: 18000,
    currency: "NGN",
    status: "Paid",
    createdAt: "2026-09-01T15:05:00+01:00",
    paidAt: "2026-09-01T15:07:00+01:00",
    reference: "PYO-24090102",
  },
  {
    id: "PYO-ada-pending",
    referrerId: "promoter-ada",
    rewardsIncluded: 15,
    amount: 15000,
    currency: "NGN",
    status: "Pending",
    createdAt: "2026-08-31T16:00:00+01:00",
    paidAt: null,
    reference: null,
  },
  {
    id: "PYO-24083104",
    referrerId: "promoter-david-okafor",
    rewardsIncluded: 11,
    amount: 11000,
    currency: "NGN",
    status: "Paid",
    createdAt: "2026-08-31T15:05:00+01:00",
    paidAt: "2026-08-31T15:07:00+01:00",
    reference: "PYO-24083104",
  },
  {
    id: "PYO-24082905",
    referrerId: "promoter-grace-eze",
    rewardsIncluded: 10,
    amount: 10000,
    currency: "NGN",
    status: "Processing",
    createdAt: "2026-08-29T15:05:00+01:00",
    paidAt: null,
    reference: "PYO-24082905",
  },
  {
    id: "PYO-24082806",
    referrerId: "promoter-michael",
    rewardsIncluded: 6,
    amount: 6000,
    currency: "NGN",
    status: "Failed",
    createdAt: "2026-08-28T15:05:00+01:00",
    paidAt: null,
    reference: "PYO-24082806",
  },
];

export const MOCK_PAYOUT_CHART: PayoutChartPoint[] = [
  { date: "2026-08-03", paid: 62000, pending: 15000 },
  { date: "2026-08-10", paid: 71000, pending: 17000 },
  { date: "2026-08-17", paid: 54000, pending: 16000 },
  { date: "2026-08-24", paid: 79000, pending: 17000 },
  { date: "2026-08-31", paid: 63000, pending: 16000 },
];

export const MOCK_PAYOUT_REWARDS: PayoutRewardRecord[] = [
  {
    id: "payout-reward-1024",
    payoutId: "PYO-24090201",
    referralId: "REF-1024",
    referredUser: "Emeka Okoro",
    qualification: "Qualified",
    reward: 1000,
    status: "Approved",
  },
  {
    id: "payout-reward-1018",
    payoutId: "PYO-24090201",
    referralId: "REF-1018",
    referredUser: "John Doe",
    qualification: "Qualified",
    reward: 1000,
    status: "Approved",
  },
  {
    id: "payout-reward-1011",
    payoutId: "PYO-24090201",
    referralId: "REF-1011",
    referredUser: "Ada Nwosu",
    qualification: "Qualified",
    reward: 1000,
    status: "Approved",
  },
  {
    id: "payout-reward-1006",
    payoutId: "PYO-24090201",
    referralId: "REF-1006",
    referredUser: "Michael Eze",
    qualification: "Qualified",
    reward: 1000,
    status: "Approved",
  },
];

export const MOCK_PAYOUT_TIMELINE: PayoutEvent[] = [
  {
    id: "payout-created-01",
    payoutId: "PYO-24090201",
    label: "Payout Created",
    actor: "System",
    date: "2026-09-02T15:05:00+01:00",
    completed: false,
  },
  {
    id: "payout-processing-01",
    payoutId: "PYO-24090201",
    label: "Payout Processing",
    actor: "System",
    date: "2026-09-02T15:06:00+01:00",
    completed: false,
  },
  {
    id: "payout-completed-01",
    payoutId: "PYO-24090201",
    label: "Payment Completed",
    actor: "System",
    date: "2026-09-02T15:07:00+01:00",
    completed: true,
  },
];

export const MOCK_PAYOUT_AUDIT: PayoutEvent[] = [
  {
    id: "payout-reviewed-audit-01",
    payoutId: "PYO-24090201",
    label: "Payout Reviewed",
    actor: "David Admin",
    date: "2026-09-02T15:10:00+01:00",
    completed: true,
  },
  {
    id: "payout-completed-audit-01",
    payoutId: "PYO-24090201",
    label: "Payout Completed",
    actor: "System",
    date: "2026-09-02T15:07:00+01:00",
    completed: false,
  },
  {
    id: "payout-processing-audit-01",
    payoutId: "PYO-24090201",
    label: "Payout Processing Started",
    actor: "System",
    date: "2026-09-02T15:06:00+01:00",
    completed: false,
  },
];

export const MOCK_PAYOUTS_DATA: PayoutsData = {
  rows: MOCK_REFERRAL_PAYOUTS,
  summary: MOCK_PAYOUT_SUMMARY,
  chart: MOCK_PAYOUT_CHART,
  rewards: MOCK_PAYOUT_REWARDS,
  timeline: MOCK_PAYOUT_TIMELINE,
  audit: MOCK_PAYOUT_AUDIT,
};
