import type {
  ReferralReward,
  RewardReferrer,
  RewardsSnapshot,
} from "../rewards.types";

export const MOCK_REWARD_REFERRERS: RewardReferrer[] = [
  {
    id: "promoter-chiamaka",
    name: "Chiamaka Obi",
    email: "chiamaka@gmail.com",
    code: "CHI1000",
    type: "Student",
    active: true,
  },
  {
    id: "promoter-unilag",
    name: "UNILAG Tech Club",
    email: "tech@unilag.edu.ng",
    code: "UNILAGTECH",
    type: "Club / Organization",
    active: true,
  },
  {
    id: "promoter-david",
    name: "David Eze",
    email: "david@gmail.com",
    code: "DAVIDEZE",
    type: "Student",
    active: true,
  },
  {
    id: "promoter-eventhub",
    name: "EventHub NG",
    email: "hello@eventhub.ng",
    code: "EVENTHUB",
    type: "Brand",
    active: true,
  },
  {
    id: "promoter-sarah",
    name: "Sarah Emmanuel",
    email: "sarah@gmail.com",
    code: "SARAHEM",
    type: "Individual",
    active: true,
  },
  {
    id: "promoter-tunde-balogun",
    name: "Tunde Balogun",
    email: "tunde@gmail.com",
    code: "TUNDE1000",
    type: "Student",
    active: true,
  },
  {
    id: "promoter-lagos-runners",
    name: "Lagos Runners Club",
    email: "hello@lagosrunners.ng",
    code: "LAGOSRUN",
    type: "Club / Organization",
    active: true,
  },
  {
    id: "promoter-campusplug",
    name: "CampusPlug NG",
    email: "hello@campusplug.ng",
    code: "CAMPUSPLUG",
    type: "Brand / Partner",
    active: true,
  },
  {
    id: "promoter-victor",
    name: "Victor Kalu",
    email: "victor@gmail.com",
    code: "VICTOR1000",
    type: "Individual",
    active: true,
  },
  {
    id: "promoter-student-union",
    name: "UNILAG Student Union",
    email: "union@unilag.edu.ng",
    code: "UNILAGSU",
    type: "Club / Organization",
    active: true,
  },
];

const REWARD_DEFAULTS = {
  referralStatus: "Completed" as const,
  qualification: "First Completed Booking",
  qualificationMet: true,
  amount: 1000,
  referredEmail: "",
  referredActive: true,
  generatedAt: "2026-09-02T14:18:00+01:00",
  referralDate: "2026-09-02T10:42:00+01:00",
  qualifiedAt: "2026-09-02T14:18:00+01:00",
};

const MOCK_REWARDS: ReferralReward[] = [
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004210",
    referrerId: "promoter-chiamaka",
    referredUser: "John Okafor",
    referredEmail: "john@gmail.com",
    referralId: "REF-001248",
    status: "Pending Review",
    date: "2026-08-25",
    canReview: true,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004209",
    referrerId: "promoter-unilag",
    referredUser: "Mary Eze",
    referralId: "REF-001247",
    status: "Approved",
    date: "2026-08-25",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004208",
    referrerId: "promoter-david",
    referredUser: "Daniel Obi",
    referralId: "REF-001246",
    status: "Eligible for Payout",
    date: "2026-08-24",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004207",
    referrerId: "promoter-eventhub",
    referredUser: "Grace Nwosu",
    referralId: "REF-001245",
    status: "Approved",
    date: "2026-08-24",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004206",
    referrerId: "promoter-sarah",
    referredUser: "Michael Umeh",
    referralId: "REF-001244",
    status: "Rejected",
    date: "2026-08-23",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004205",
    referrerId: "promoter-tunde-balogun",
    referredUser: "Femi Adebayo",
    referralId: "REF-001243",
    status: "Pending Review",
    date: "2026-08-23",
    canReview: true,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004204",
    referrerId: "promoter-lagos-runners",
    referredUser: "Abiola Kazeem",
    referralId: "REF-001242",
    status: "Approved",
    date: "2026-08-22",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004203",
    referrerId: "promoter-campusplug",
    referredUser: "Blessing Okon",
    referralId: "REF-001241",
    status: "Eligible for Payout",
    date: "2026-08-22",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004202",
    referrerId: "promoter-victor",
    referredUser: "Funke Akindele",
    referralId: "REF-001240",
    status: "Rejected",
    date: "2026-08-21",
    canReview: false,
  },
  {
    ...REWARD_DEFAULTS,
    id: "RWD-004201",
    referrerId: "promoter-student-union",
    referredUser: "Sola Alabi",
    referralId: "REF-001239",
    status: "Approved",
    date: "2026-08-21",
    canReview: false,
  },
];

export const MOCK_REWARDS_SNAPSHOT: RewardsSnapshot = {
  records: MOCK_REWARDS,
  summary: {
    periodEnd: "2026-09-02",
    rewardAmount: 1000,
    pending: 86,
    pendingAmount: 86000,
    approved: 798,
    approvedAmount: 798000,
    rejected: 18,
    rejectedAmount: 18000,
    total: 4210,
    totalAmount: 4210000,
  },
};

// Temporary mock data adapter. Production must return the backend's decision and aggregates.
export async function reviewMockReward(
  snapshot: RewardsSnapshot,
  id: string,
  decision: "Approved" | "Rejected",
  note: string,
): Promise<RewardsSnapshot> {
  const reward = snapshot.records.find((record) => record.id === id);
  if (!reward?.canReview || reward.status !== "Pending Review")
    throw new Error("This reward is no longer available for review.");
  const summary = {
    ...snapshot.summary,
    pending: snapshot.summary.pending - 1,
    pendingAmount: snapshot.summary.pendingAmount - reward.amount,
  };
  if (decision === "Approved") {
    summary.approved += 1;
    summary.approvedAmount += reward.amount;
  } else {
    summary.rejected += 1;
    summary.rejectedAmount += reward.amount;
  }
  return {
    summary,
    records: snapshot.records.map((record) =>
      record.id === id
        ? { ...record, status: decision, canReview: false, reviewNote: note }
        : record,
    ),
  };
}
