import type { Group, GroupMember } from "@/features/groups";

// group data
export const GROUPS: Group[] = [
  {
    id: "GRP-001",
    name: "Lagos Creatives",
    leaderProfileId: "10000000-0000-4000-8000-000000000001",
    category: "Creative",
    status: "Active",
    createdAt: "2026-08-10T09:30:00.000Z",
    updatedAt: "2026-08-20T14:15:00.000Z",
    color: "#F97316",
  },
  {
    id: "GRP-002",
    name: "Lekki Foodies Club",
    leaderProfileId: "10000000-0000-4000-8000-000000000004",
    category: "Creative",
    status: "Active",
    createdAt: "2026-08-01T10:00:00.000Z",
    updatedAt: "2026-08-24T16:00:00.000Z",
    color: "#EC4899",
  },
  {
    id: "GRP-003",
    name: "Tech Innovators",
    leaderProfileId: "10000000-0000-4000-8000-000000000002",
    category: "Technology",
    status: "Active",
    createdAt: "2026-07-22T11:00:00.000Z",
    updatedAt: "2026-08-18T16:45:00.000Z",
    color: "#0284C7",
  },
  {
    id: "GRP-004",
    name: "Lagos Fitness Collective",
    leaderProfileId: "10000000-0000-4000-8000-000000000005",
    category: "Events",
    status: "Active",
    createdAt: "2026-07-05T07:15:00.000Z",
    updatedAt: "2026-08-22T08:30:00.000Z",
    color: "#D97706",
  },
  {
    id: "GRP-005",
    name: "Abuja Entrepreneurs",
    leaderProfileId: "10000000-0000-4000-8000-000000000001",
    category: "Business",
    status: "Paused",
    createdAt: "2026-06-15T08:20:00.000Z",
    updatedAt: "2026-08-12T10:30:00.000Z",
    color: "#64748B",
  },
  {
    id: "GRP-006",
    name: "Acoustic Nights Experience",
    leaderProfileId: "10000000-0000-4000-8000-000000000006",
    category: "Events",
    status: "Active",
    createdAt: "2026-06-01T16:45:00.000Z",
    updatedAt: "2026-08-23T19:00:00.000Z",
    color: "#06B6D4",
  },
  {
    id: "GRP-007",
    name: "Event Planners Network",
    leaderProfileId: "10000000-0000-4000-8000-000000000003",
    category: "Events",
    status: "Inactive",
    createdAt: "2026-05-03T13:10:00.000Z",
    updatedAt: "2026-07-30T09:00:00.000Z",
    color: "#94A3B8",
  },
  {
    id: "GRP-008",
    name: "Founder Circle Yaba",
    leaderProfileId: "10000000-0000-4000-8000-000000000007",
    category: "Business",
    status: "Active",
    createdAt: "2026-04-18T12:00:00.000Z",
    updatedAt: "2026-08-25T11:20:00.000Z",
    color: "#F59E0B",
  },
  {
    id: "GRP-009",
    name: "Northern Shutterbugs",
    leaderProfileId: "10000000-0000-4000-8000-000000000008",
    category: "Creative",
    status: "Paused",
    createdAt: "2026-03-29T14:30:00.000Z",
    updatedAt: "2026-08-15T15:00:00.000Z",
    color: "#64748B",
  },
  {
    id: "GRP-010",
    name: "Product Design Hub",
    leaderProfileId: "10000000-0000-4000-8000-000000000002",
    category: "Technology",
    status: "Active",
    createdAt: "2026-03-12T09:00:00.000Z",
    updatedAt: "2026-08-21T18:10:00.000Z",
    color: "#94A3B8",
  },
];

// group members data
export const GROUP_MEMBERS: GroupMember[] = [
  // GRP-001 Members
  {
    id: "mem-001",
    groupId: "GRP-001",
    profileId: "20000000-0000-4000-8000-000000000001",
    status: "Active",
  },
  {
    id: "mem-002",
    groupId: "GRP-001",
    profileId: "20000000-0000-4000-8000-000000000002",
    status: "Active",
  },
  {
    id: "mem-003",
    groupId: "GRP-001",
    profileId: "20000000-0000-4000-8000-000000000004",
    status: "Active",
  },
  {
    id: "mem-004",
    groupId: "GRP-001",
    profileId: "20000000-0000-4000-8000-000000000005",
    status: "Active",
  },
  {
    id: "mem-005",
    groupId: "GRP-001",
    profileId: "20000000-0000-4000-8000-000000000006",
    status: "Removed",
  },

  // GRP-002 Members
  {
    id: "mem-006",
    groupId: "GRP-002",
    profileId: "20000000-0000-4000-8000-000000000004",
    status: "Active",
  },
  {
    id: "mem-007",
    groupId: "GRP-002",
    profileId: "20000000-0000-4000-8000-000000000001",
    status: "Active",
  },
  {
    id: "mem-008",
    groupId: "GRP-002",
    profileId: "20000000-0000-4000-8000-000000000007",
    status: "Active",
  },

  // GRP-003 Members
  {
    id: "mem-009",
    groupId: "GRP-003",
    profileId: "20000000-0000-4000-8000-000000000002",
    status: "Active",
  },
  {
    id: "mem-010",
    groupId: "GRP-003",
    profileId: "20000000-0000-4000-8000-000000000007",
    status: "Active",
  },
  {
    id: "mem-011",
    groupId: "GRP-003",
    profileId: "20000000-0000-4000-8000-000000000003",
    status: "Active",
  },
  {
    id: "mem-012",
    groupId: "GRP-003",
    profileId: "20000000-0000-4000-8000-000000000005",
    status: "Active",
  },

  // GRP-004 Members
  {
    id: "mem-013",
    groupId: "GRP-004",
    profileId: "20000000-0000-4000-8000-000000000005",
    status: "Active",
  },
  {
    id: "mem-014",
    groupId: "GRP-004",
    profileId: "20000000-0000-4000-8000-000000000001",
    status: "Active",
  },

  // GRP-005 Members
  {
    id: "mem-015",
    groupId: "GRP-005",
    profileId: "20000000-0000-4000-8000-000000000001",
    status: "Active",
  },
  {
    id: "mem-016",
    groupId: "GRP-005",
    profileId: "20000000-0000-4000-8000-000000000003",
    status: "Active",
  },
  {
    id: "mem-017",
    groupId: "GRP-005",
    profileId: "20000000-0000-4000-8000-000000000007",
    status: "Active",
  },

  // GRP-006 Members
  {
    id: "mem-018",
    groupId: "GRP-006",
    profileId: "20000000-0000-4000-8000-000000000006",
    status: "Active",
  },
  {
    id: "mem-019",
    groupId: "GRP-006",
    profileId: "20000000-0000-4000-8000-000000000002",
    status: "Active",
  },
  {
    id: "mem-020",
    groupId: "GRP-006",
    profileId: "20000000-0000-4000-8000-000000000008",
    status: "Active",
  },

  // GRP-007 Members
  {
    id: "mem-021",
    groupId: "GRP-007",
    profileId: "20000000-0000-4000-8000-000000000003",
    status: "Active",
  },
  {
    id: "mem-022",
    groupId: "GRP-007",
    profileId: "20000000-0000-4000-8000-000000000008",
    status: "Removed",
  },

  // GRP-008 Members
  {
    id: "mem-023",
    groupId: "GRP-008",
    profileId: "20000000-0000-4000-8000-000000000007",
    status: "Active",
  },
  {
    id: "mem-024",
    groupId: "GRP-008",
    profileId: "20000000-0000-4000-8000-000000000002",
    status: "Active",
  },
  {
    id: "mem-025",
    groupId: "GRP-008",
    profileId: "20000000-0000-4000-8000-000000000005",
    status: "Active",
  },

  // GRP-009 Members
  {
    id: "mem-026",
    groupId: "GRP-009",
    profileId: "20000000-0000-4000-8000-000000000008",
    status: "Active",
  },
  {
    id: "mem-027",
    groupId: "GRP-009",
    profileId: "20000000-0000-4000-8000-000000000006",
    status: "Active",
  },

  // GRP-010 Members
  {
    id: "mem-028",
    groupId: "GRP-010",
    profileId: "20000000-0000-4000-8000-000000000002",
    status: "Active",
  },
  {
    id: "mem-029",
    groupId: "GRP-010",
    profileId: "20000000-0000-4000-8000-000000000001",
    status: "Active",
  },
  {
    id: "mem-030",
    groupId: "GRP-010",
    profileId: "20000000-0000-4000-8000-000000000007",
    status: "Active",
  },
];