"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Bell, Download, Search } from "lucide-react";
import { toast } from "sonner";
import { ReferralActivity } from "./referral.activity";
import { ReferralPayouts } from "./referral.payouts";
import { RewardsApprovals } from "./rewards.approvals";
import { ReferrersDirectory } from "./referrers.directory";
import { reviewMockReward } from "../data/rewards.data";
import type { PayoutsData } from "../payouts.types";
import type { RewardReferrer, RewardsSnapshot } from "../rewards.types";
import type {
  DirectoryReferrer,
  ReferrerHistoryRecord,
  ReferrersSummary,
} from "../referrers.types";
import { ReferralTabs } from "./referral.tabs";
import { downloadReferralCsv } from "../referrals.export";
import type {
  ActivityPromoter,
  ActivityReferral,
  ActivitySummary,
} from "../referrals.activity.types";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type {
  ReferralActivityOverview,
  ReferralOverviewSummary,
  ReferralPerformancePoint,
  ReferrerOverview,
  ReferralRange,
  ReferralTab,
} from "../referrals.overview.types";
import {
  ReferralAttention,
  ReferralJourney,
  ReferralMetrics,
  ReferralRules,
} from "./referral.overview.panels";
import { ReferralPerformanceChart } from "./referral.performance.chart";
import {
  RecentReferralsTable,
  ReferrersTable,
} from "./referral.overview.tables";

const RANGES = [
  { value: "30", label: "Last 30 Days" },
  { value: "7", label: "Last 7 Days" },
  { value: "1", label: "Today" },
];

interface ReferralsOverviewProps {
  summary: ReferralOverviewSummary;
  topReferrers: ReferrerOverview[];
  promoters: ReferrerOverview[];
  activity: ReferralActivityOverview[];
  chartData: ReferralPerformancePoint[];
  activityRecords: ActivityReferral[];
  activityPromoters: ActivityPromoter[];
  activitySummary: ActivitySummary;
  directoryRows: DirectoryReferrer[];
  directoryHistory: ReferrerHistoryRecord[];
  directorySummary: ReferrersSummary;
  rewardsSnapshot: RewardsSnapshot;
  rewardReferrers: RewardReferrer[];
  payoutData: PayoutsData;
}

export function ReferralsOverview({
  summary,
  topReferrers,
  promoters,
  activity,
  chartData,
  activityRecords,
  activityPromoters,
  activitySummary,
  directoryRows,
  directoryHistory,
  directorySummary,
  rewardsSnapshot,
  rewardReferrers,
  payoutData,
}: ReferralsOverviewProps) {
  const [search, setSearch] = useState("");
  const [range, setRange] = useState<ReferralRange>("30");
  const [tab, setTab] = useState<ReferralTab>("Overview");
  const [rewards, setRewards] = useState(rewardsSnapshot);
  const query = search.trim().toLowerCase();
  // Historical mock snapshot; API integration should supply the reporting period.
  const end = new Date(`${summary.periodEnd}T00:00:00Z`);
  const start = new Date(end);
  start.setUTCDate(start.getUTCDate() - Number(range) + 1);
  const inRange = (date: string) =>
    new Date(`${date}T00:00:00Z`) >= start &&
    new Date(`${date}T00:00:00Z`) <= end;
  const referrers = topReferrers.filter((row) =>
    `${row.name} ${row.code} ${row.type}`.toLowerCase().includes(query),
  );
  const referrals = activity.filter((row) => {
    const promoter = promoters.find((item) => item.id === row.referrerId);
    return (
      inRange(row.date) &&
      `${row.id} ${row.referredUser} ${promoter?.name} ${promoter?.code}`
        .toLowerCase()
        .includes(query)
    );
  });
  const performance = chartData.filter((row) => inRange(row.date));
  const tabRows =
    tab === "Rewards & Approvals"
      ? referrals.filter((row) => row.rewardStatus !== null)
      : tab === "Payouts"
        ? referrals.filter((row) => row.payout !== null)
        : referrals;

  const handleExport = () => {
    const rows: (string | number)[][] =
      tab === "Referrers"
        ? [
            [
              "Referrer",
              "Code",
              "Type",
              "Total Referrals",
              "Successful",
              "Earned",
              "Paid",
            ],
            ...referrers.map((row) => [
              row.name,
              row.code,
              row.type,
              row.total,
              row.successful,
              row.earned,
              row.paid,
            ]),
          ]
        : [
            [
              "Referral ID",
              "Referrer",
              "Code",
              "Referred User",
              "Status",
              "Reward Status",
              "Reward Amount",
              "Payout",
              "Date",
            ],
            ...tabRows.map((row) => {
              const promoter = promoters.find(
                (item) => item.id === row.referrerId,
              );
              return [
                row.id,
                promoter?.name ?? "",
                promoter?.code ?? "",
                row.referredUser,
                row.status,
                row.rewardStatus ?? "",
                row.rewardAmount,
                row.payout ?? "",
                row.date,
              ];
            }),
          ];
    if (rows.length === 1) {
      toast.error("No records to export.");
      return;
    }
    downloadReferralCsv(
      rows,
      `hoste-referrals-${tab.toLowerCase().replaceAll(" ", "-")}-${range}-days.csv`,
    );
    toast.success("Referral report exported.");
  };

  if (tab === "Referral Activity") {
    return (
      <ReferralActivity
        rows={activityRecords}
        promoters={activityPromoters}
        summary={activitySummary}
        onTabChange={setTab}
      />
    );
  }

  if (tab === "Referrers") {
    return (
      <ReferrersDirectory
        rows={directoryRows}
        history={directoryHistory}
        summary={directorySummary}
        onTabChange={setTab}
      />
    );
  }

  if (tab === "Rewards & Approvals") {
    return (
      <RewardsApprovals
        snapshot={rewards}
        referrers={rewardReferrers}
        onTabChange={setTab}
        onReview={async (id, decision, note) => {
          const response = await reviewMockReward(rewards, id, decision, note);
          setRewards(response);
          toast.success(
            decision === "Approved" ? "Reward approved." : "Reward rejected.",
          );
        }}
      />
    );
  }

  if (tab === "Payouts") {
    return (
      <ReferralPayouts
        {...payoutData}
        referrers={directoryRows}
        history={directoryHistory}
        onTabChange={setTab}
      />
    );
  }

  return (
    <div className="min-w-[1024px] tracking-normal">
      <header className="flex h-[72px] items-center justify-between gap-8 border-b border-border bg-card px-8">
        <div className="relative w-[440px]">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="search"
            aria-label="Search referrals"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by Referrer, Referred User, Referral Code, or REF-ID..."
            className="h-9 border-border/60 bg-muted/20 pl-9 text-[11px]"
          />
        </div>
        <div className="flex items-center gap-5">
          <span className="rounded-full bg-success/10 px-2 py-1 text-[9px] font-bold text-success">
            LIVE SYSTEM
          </span>
          <Link
            href="/notifications"
            aria-label="Notifications"
            className="relative rounded-full p-2 hover:bg-muted"
          >
            <Bell className="size-4 text-muted-foreground" />
            <span className="absolute right-2 top-1.5 size-1.5 rounded-full bg-primary" />
          </Link>
          <div className="ml-6 flex items-center gap-3">
            <Avatar className="size-8">
              <AvatarFallback className="bg-muted text-[10px]">
                JA
              </AvatarFallback>
            </Avatar>
            <div>
              <p className="text-xs font-semibold">John Admin</p>
              <p className="text-[10px] text-muted-foreground">Super Admin</p>
            </div>
          </div>
        </div>
      </header>
      <div className="mx-auto max-w-[1600px] space-y-5 px-8 pb-8 pt-6">
        <div className="flex items-center justify-between gap-6">
          <div>
            <h1 className="text-2xl font-bold">Referral Overview</h1>
            <p className="mt-1 text-xs text-muted-foreground">
              Track referral performance, promoter activity, rewards, and
              payouts across Hosté.
            </p>
          </div>
          <div className="flex items-center gap-3">
            <Select
              value={range}
              onValueChange={(value) => {
                if (value === "30" || value === "7" || value === "1")
                  setRange(value);
              }}
            >
              <SelectTrigger
                aria-label="Referral date range"
                className="w-36 bg-card text-xs"
              >
                <SelectValue>
                  {RANGES.find((item) => item.value === range)?.label}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                {RANGES.map((item) => (
                  <SelectItem key={item.value} value={item.value}>
                    {item.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button
              variant="outline"
              className="bg-card text-xs"
              onClick={handleExport}
            >
              <Download className="size-4" />
              Export Report
            </Button>
          </div>
        </div>
        <ReferralTabs activeTab={tab} onTabChange={setTab} />
        {tab === "Overview" ? (
          <>
            <div className="flex items-center justify-between gap-3 rounded-md border border-border border-l-[3px] border-l-success bg-card px-4 py-3 text-[10px]">
              <div className="flex items-center gap-3">
                <span className="font-semibold text-muted-foreground">
                  REFERRAL PROGRAM:{" "}
                  <span className="rounded-full bg-success/10 px-2 py-1 text-success">
                    ● Active
                  </span>
                </span>
                <span className="rounded bg-primary/10 px-3 py-1 font-semibold text-primary">
                  ₦{summary.reward.toLocaleString()} per successful referral
                </span>
                <span className="text-muted-foreground">
                  Promoters earn ₦{summary.reward.toLocaleString()} when a
                  referred user completes the required qualifying action.
                </span>
              </div>
              <Link
                href="/settings"
                className="flex shrink-0 items-center gap-1 font-semibold text-primary"
              >
                Manage Settings <ArrowRight className="size-3" />
              </Link>
            </div>
            <ReferralMetrics summary={summary} />
            <ReferralJourney summary={summary} />
            <div className="grid grid-cols-[minmax(0,1.7fr)_minmax(0,1fr)] gap-5">
              <ReferralPerformanceChart data={performance} />
              <ReferralRules summary={summary} />
            </div>
            <ReferralAttention summary={summary} onNavigate={setTab} />
            <ReferrersTable
              rows={referrers}
              onViewAll={() => setTab("Referrers")}
            />
            <RecentReferralsTable
              rows={referrals}
              referrers={promoters}
              onViewAll={() => setTab("Referral Activity")}
            />
          </>
        ) : tab === "Referrers" ? (
          <ReferrersTable rows={referrers} />
        ) : (
          <RecentReferralsTable
            rows={tabRows}
            referrers={promoters}
            title={tab}
          />
        )}
      </div>
    </div>
  );
}
