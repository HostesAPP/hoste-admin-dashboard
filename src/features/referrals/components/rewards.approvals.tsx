"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { RewardReferrer, RewardsSnapshot } from "../rewards.types";
import type { ReferralTab } from "../referrals.overview.types";
import {
  rewardsFilterSchema,
  REWARDS_FILTER_DEFAULTS,
  type RewardsFilters,
} from "../schemas/rewards.filter.schema";
import { REFERRER_RANGES } from "../schemas/referrers.filter.schema";
import { ReferrersPagination, ReferrersSelect } from "./referrers.controls";
import { ReferralTabs } from "./referral.tabs";
import { RewardStatusBadge } from "./reward.status.badge";
import { RewardReviewDrawer } from "./reward.review.drawer";
import { downloadReferralCsv } from "../referrals.export";

const FILTERS = [
  {
    name: "status" as const,
    label: "Reward status",
    options: rewardsFilterSchema.shape.status.options.map((value) => ({
      value,
      label: value === "ALL" ? "Reward Status: All" : value,
    })),
  },
  {
    name: "type" as const,
    label: "Reward referrer type",
    options: rewardsFilterSchema.shape.type.options.map((value) => ({
      value,
      label: value === "ALL" ? "Referrer Type: All" : value,
    })),
  },
];

export function RewardsApprovals({
  snapshot,
  referrers,
  onTabChange,
  onReview,
}: {
  snapshot: RewardsSnapshot;
  referrers: RewardReferrer[];
  onTabChange: (tab: ReferralTab) => void;
  onReview: (
    id: string,
    decision: "Approved" | "Rejected",
    note: string,
  ) => Promise<void>;
}) {
  const { register, control, setValue, reset } = useForm<RewardsFilters>({
    resolver: zodResolver(rewardsFilterSchema),
    defaultValues: REWARDS_FILTER_DEFAULTS,
  });
  const filters = useWatch({ control }) as RewardsFilters;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, size: 25, key: "" });
  const resetPage = () =>
    setPagination((previous) => ({ ...previous, page: 1, key: "" }));
  const changeRange = (value: string) => {
    setValue("range", value as RewardsFilters["range"]);
    resetPage();
  };
  const key = JSON.stringify(filters);
  const summary = snapshot.summary;
  const end = new Date(`${summary.periodEnd}T00:00:00Z`);
  const start = new Date(end);
  if (filters.range !== "ALL")
    start.setUTCDate(start.getUTCDate() - Number(filters.range) + 1);
  const filtered = snapshot.records.filter((reward) => {
    const referrer = referrers.find(
      (person) => person.id === reward.referrerId,
    );
    const date = new Date(`${reward.date}T00:00:00Z`);
    return (
      `${reward.id} ${referrer?.name} ${referrer?.code} ${reward.referredUser} ${reward.referralId}`
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase()) &&
      (filters.status === "ALL" || reward.status === filters.status) &&
      (filters.type === "ALL" || referrer?.type === filters.type) &&
      (filters.range === "ALL" || (date >= start && date <= end))
    );
  });
  const page =
    pagination.key === key
      ? Math.min(
          pagination.page,
          Math.max(1, Math.ceil(filtered.length / pagination.size)),
        )
      : 1;
  const selected = snapshot.records.find((reward) => reward.id === selectedId);
  const exportRows = () => {
    if (!filtered.length) {
      toast.error("No rewards to export.");
      return;
    }
    downloadReferralCsv(
      [
        [
          "Reward ID",
          "Referrer",
          "Type",
          "Referred User",
          "Referral ID",
          "Qualification",
          "Reward",
          "Status",
          "Date",
        ],
        ...filtered.map((reward) => {
          const referrer = referrers.find(
            (person) => person.id === reward.referrerId,
          );
          return [
            reward.id,
            referrer?.name ?? "",
            referrer?.type ?? "",
            reward.referredUser,
            reward.referralId,
            reward.qualification,
            reward.amount,
            reward.status,
            reward.date,
          ];
        }),
      ],
      "hoste-referral-rewards.csv",
    );
    toast.success("Rewards exported.");
  };
  const rangeSelect = (
    <ReferrersSelect
      label="Rewards date range"
      value={filters.range}
      options={REFERRER_RANGES}
      onChange={changeRange}
    />
  );
  const metrics = [
    {
      label: "PENDING REVIEW",
      value: summary.pending,
      detail: `₦${summary.pendingAmount.toLocaleString()} awaiting approval`,
      tone: "border-l-primary",
      text: "text-primary",
    },
    {
      label: "APPROVED",
      value: summary.approved,
      detail: `₦${summary.approvedAmount.toLocaleString()} approved`,
      tone: "border-l-success",
      text: "text-success",
    },
    {
      label: "REJECTED",
      value: summary.rejected,
      detail: `₦${summary.rejectedAmount.toLocaleString()} rejected`,
      tone: "border-l-destructive",
      text: "text-destructive",
    },
    {
      label: "TOTAL REWARDS",
      value: summary.total,
      detail: `₦${summary.totalAmount.toLocaleString()} generated`,
      tone: "border-l-border",
      text: "text-muted-foreground",
    },
  ];
  return (
    <div className="mx-auto min-w-[1024px] max-w-[1600px] space-y-5 px-6 py-6 tracking-normal">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Rewards & Approvals</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Review successful referrals and approve rewards before payout.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="text-xs" onClick={exportRows}>
            <Download className="size-4" />
            Export
          </Button>
          {rangeSelect}
        </div>
      </header>
      <ReferralTabs activeTab="Rewards & Approvals" onTabChange={onTabChange} />
      <div className="grid grid-cols-4 gap-5 pt-3">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className={`rounded-lg border border-border border-l-[3px] bg-card p-4 ${metric.tone}`}
          >
            <h2 className="text-[10px] font-semibold text-muted-foreground">
              {metric.label}
            </h2>
            <p className="mt-1 text-2xl font-bold">
              {metric.value.toLocaleString()}
            </p>
            <p className={`mt-2 text-[11px] font-semibold ${metric.text}`}>
              {metric.detail}
            </p>
          </article>
        ))}
      </div>
      <p className="rounded-md border border-primary/40 bg-primary/5 px-4 py-3 text-xs">
        Referral reward:{" "}
        <strong>
          ₦{summary.rewardAmount.toLocaleString()} per successful referral.
        </strong>{" "}
        Registration alone does not generate a reward.
      </p>
      <div className="flex items-center gap-3">
        <div className="relative min-w-0 flex-1">
          <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
          <Input
            {...register("search", { onChange: resetPage })}
            aria-label="Search rewards"
            placeholder="Search reward ID, referrer, referred user, referral code..."
            className="h-9 bg-card pl-9 text-xs"
          />
        </div>
        {FILTERS.map((filter) => (
          <Controller
            key={filter.name}
            name={filter.name}
            control={control}
            render={({ field }) => (
              <ReferrersSelect
                label={filter.label}
                value={field.value}
                options={filter.options}
                onChange={(value) => {
                  field.onChange(value);
                  resetPage();
                }}
              />
            )}
          />
        ))}
        <ReferrersSelect
          label="Reward table date filter"
          value={filters.range}
          options={REFERRER_RANGES.map((range) => ({
            ...range,
            label: `Date: ${range.label}`,
          }))}
          onChange={changeRange}
        />
        <button
          type="button"
          className="shrink-0 text-xs font-semibold text-primary"
          onClick={() => {
            reset({ ...REWARDS_FILTER_DEFAULTS, range: "ALL" });
            resetPage();
          }}
        >
          Clear Filters
        </button>
      </div>
      <section>
        <h2 className="text-sm font-bold">Referral Rewards</h2>
        <p className="mt-1 text-xs text-muted-foreground">
          Review rewards generated by successful referrals.
        </p>
        <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
          <Table className="table-fixed text-[10px]">
            <TableHeader className="bg-muted/30">
              <TableRow>
                {[
                  ["Reward ID", "w-24"],
                  ["Referrer", "w-[13%]"],
                  ["Type", "w-[12%]"],
                  ["Referred User", "w-[12%]"],
                  ["Referral ID", "w-24"],
                  ["Qualification", "w-[14%]"],
                  ["Reward", "w-16"],
                  ["Status", "w-[12%]"],
                  ["Date", "w-24"],
                  ["Action", "w-16"],
                ].map(([label, width]) => (
                  <TableHead
                    key={label}
                    className={`${width} h-9 text-[9px] font-semibold text-muted-foreground`}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filtered
                .slice((page - 1) * pagination.size, page * pagination.size)
                .map((reward) => {
                  const referrer = referrers.find(
                    (person) => person.id === reward.referrerId,
                  );
                  return (
                    <TableRow key={reward.id} className="h-14">
                      <TableCell className="text-muted-foreground">
                        {reward.id}
                      </TableCell>
                      <TableCell className="font-semibold">
                        {referrer?.name ?? "—"}
                      </TableCell>
                      <TableCell>{referrer?.type ?? "—"}</TableCell>
                      <TableCell>{reward.referredUser}</TableCell>
                      <TableCell className="text-muted-foreground">
                        {reward.referralId}
                      </TableCell>
                      <TableCell>{reward.qualification}</TableCell>
                      <TableCell className="font-semibold">
                        ₦{reward.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <RewardStatusBadge status={reward.status} />
                      </TableCell>
                      <TableCell className="text-[9px] text-muted-foreground">
                        {new Date(
                          `${reward.date}T00:00:00Z`,
                        ).toLocaleDateString("en-GB", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                          timeZone: "UTC",
                        })}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant={reward.canReview ? "default" : "outline"}
                          size="xs"
                          className="text-[9px]"
                          onClick={() => setSelectedId(reward.id)}
                          aria-label={`${reward.canReview ? "Review" : "View"} ${reward.id}`}
                        >
                          {reward.canReview ? "Review" : "View"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  );
                })}
              {filtered.length === 0 && (
                <TableRow>
                  <TableCell
                    colSpan={10}
                    className="py-14 text-center text-xs text-muted-foreground"
                  >
                    No rewards match your filters.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="flex items-center justify-between gap-5">
          <div className="flex-1">
            <ReferrersPagination
              page={page}
              count={filtered.length}
              size={pagination.size}
              noun="rewards"
              onChange={(next) =>
                setPagination({ ...pagination, page: next, key })
              }
            />
          </div>
          <div className="mt-5 flex items-center gap-2 pt-4 text-[11px] text-muted-foreground">
            <span>Page size:</span>
            <ReferrersSelect
              label="Rewards page size"
              value={String(pagination.size)}
              options={[5, 25, 50, 100].map((size) => ({
                value: String(size),
                label: String(size),
              }))}
              onChange={(value) =>
                setPagination({ page: 1, size: Number(value), key })
              }
            />
          </div>
        </div>
      </section>
      {selected && (
        <RewardReviewDrawer
          key={selected.id}
          reward={selected}
          referrer={referrers.find(
            (person) => person.id === selected.referrerId,
          )}
          onClose={() => setSelectedId(null)}
          onReview={onReview}
        />
      )}
    </div>
  );
}
