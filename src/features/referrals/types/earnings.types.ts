// Presentation snapshots for the supplied earnings/configuration designs, not API contracts.
export interface ReferralEarning {
  id: string;
  referrerId: string;
  referredPerson: string;
  qualifiedAt: string;
  amount: number;
  status: "Paid" | "Pending";
  paidAt: string | null;
}

export interface ReferralConfiguration {
  rewardAmount: number;
  minimumPayout: number;
  requireAccount: boolean;
  requireQualifyingAction: boolean;
  requireApproval: boolean;
  allowRetry: boolean;
  notifyRewardApproved: boolean;
  notifyPayoutCompleted: boolean;
  notifyPayoutFailed: boolean;
}

export interface EarningsData {
  rows: ReferralEarning[];
  summary: {
    periodEnd: string;
    total: number;
    paid: number;
    pending: number;
    successfulRewards: number;
  };
  chart: { date: string; earned: number; paid: number }[];
  configuration: ReferralConfiguration;
  canManage: boolean;
}

export interface EarningsAdapter {
  cacheKey: string;
  load: () => Promise<EarningsData>;
  saveConfiguration: (
    settings: ReferralConfiguration,
  ) => Promise<ReferralConfiguration>;
}
