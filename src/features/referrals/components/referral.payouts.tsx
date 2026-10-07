"use client";

import { useState } from "react";
import Link from "next/link";
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
import type {
  DirectoryReferrer,
  ReferrerHistoryRecord,
} from "../referrers.types";
import type { ReferralTab } from "../referrals.overview.types";
import type { PayoutsData } from "../payouts.types";
import {
  payoutsFilterSchema,
  PAYOUT_FILTER_DEFAULTS,
  type PayoutsFilters,
} from "../schemas/payouts.filter.schema";
import { REFERRER_RANGES } from "../schemas/referrers.filter.schema";
import { downloadReferralCsv } from "../referrals.export";
import { formatPayoutDate } from "../payouts.format";
import { ReferralTabs } from "./referral.tabs";
import { ReferrersPagination, ReferrersSelect } from "./referrers.controls";
import { ReferrerDetails } from "./referrer.details";
import { PayoutStatusBadge } from "./payout.status.badge";
import { PayoutOverviewChart } from "./payout.overview.chart";
import { PayoutDetails } from "./payout.details";

export interface ReferralPayoutsProps extends PayoutsData {
  referrers: DirectoryReferrer[];
  history: ReferrerHistoryRecord[];
  onTabChange: (tab: ReferralTab) => void;
}

export function ReferralPayouts({
  rows,
  summary,
  chart,
  rewards,
  timeline,
  audit,
  referrers,
  history,
  onTabChange,
}: ReferralPayoutsProps) {
  const { register, control, setValue } = useForm<PayoutsFilters>({
    resolver: zodResolver(payoutsFilterSchema),
    defaultValues: PAYOUT_FILTER_DEFAULTS,
  });
  const filters = useWatch({ control }) as PayoutsFilters;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [viewingReferrer, setViewingReferrer] = useState(false);
  const [pagination, setPagination] = useState({ page: 1, size: 10 });
  const resetPage = () =>
    setPagination((previous) => ({ ...previous, page: 1 }));
  const changeRange = (value: string) => {
    setValue("range", value as PayoutsFilters["range"]);
    resetPage();
  };
  const end = new Date(`${summary.periodEnd}T00:00:00+01:00`);
  end.setTime(end.getTime() + 86400000);
  const start = new Date(
    end.getTime() -
      Number(filters.range === "ALL" ? "30" : filters.range) * 86400000,
  );
  const inRange = (date: string) =>
    filters.range === "ALL" ||
    (new Date(date) >= start && new Date(date) < end);
  const filtered = rows
    .filter((row) => {
      const referrer = referrers.find((person) => person.id === row.referrerId);
      return (
        inRange(row.createdAt) &&
        (filters.status === "ALL" || row.status === filters.status) &&
        (filters.referrer === "ALL" || row.referrerId === filters.referrer) &&
        `${referrer?.name} ${row.id} ${row.reference ?? ""}`
          .toLowerCase()
          .includes(filters.search.trim().toLowerCase())
      );
    })
    .sort((a, b) =>
      filters.sort === "NEWEST"
        ? Date.parse(b.createdAt) - Date.parse(a.createdAt)
        : Date.parse(a.createdAt) - Date.parse(b.createdAt),
    );
  const page = Math.min(
    pagination.page,
    Math.max(1, Math.ceil(filtered.length / pagination.size)),
  );
  const selected = rows.find((row) => row.id === selectedId);
  const selectedReferrer = referrers.find(
    (person) => person.id === selected?.referrerId,
  );
  const options = [
    {
      name: "status" as const,
      label: "Payout status",
      options: payoutsFilterSchema.shape.status.options.map((value) => ({
        value,
        label: value === "ALL" ? "All Statuses" : value,
      })),
    },
    {
      name: "referrer" as const,
      label: "Payout referrer",
      options: [
        { value: "ALL", label: "All Referrers" },
        ...referrers
          .filter((person) => rows.some((row) => row.referrerId === person.id))
          .map((person) => ({ value: person.id, label: person.name })),
      ],
    },
    {
      name: "sort" as const,
      label: "Payout sort order",
      options: [
        { value: "NEWEST", label: "Newest First" },
        { value: "OLDEST", label: "Oldest First" },
      ],
    },
  ];
  const exportRows = () => {
    if (filtered.length === 0) {
      toast.error("No payouts to export.");
      return;
    }
    downloadReferralCsv(
      [
        [
          "Payout ID",
          "Referrer",
          "Rewards Included",
          "Amount",
          "Currency",
          "Status",
          "Payout Date",
          "Reference",
        ],
        ...filtered.map((row) => [
          row.id,
          referrers.find((person) => person.id === row.referrerId)?.name ?? "",
          row.rewardsIncluded,
          row.amount,
          row.currency,
          row.status,
          row.paidAt ?? "",
          row.reference ?? "",
        ]),
      ],
      "hoste-referral-payouts.csv",
    );
    toast.success("Payouts exported.");
  };
  const metrics = [
    {
      label: "TOTAL REFERRAL EARNINGS",
      value: `₦${summary.totalEarnings.toLocaleString()}`,
      detail: "Total qualifying rewards generated",
      tone: "text-foreground",
    },
    {
      label: "PAID OUT",
      value: `₦${summary.paidOut.toLocaleString()}`,
      detail: "Successfully paid rewards",
      tone: "text-success",
    },
    {
      label: "PENDING PAYOUTS",
      value: `₦${summary.pending.toLocaleString()}`,
      detail: "Rewards awaiting payout",
      tone: "text-muted-foreground",
    },
    {
      label: "PAYOUT SUCCESS RATE",
      value: summary.successRate,
      detail: "Successful payout transactions",
      tone: "text-success",
    },
  ];
  const renderFilter = (name: "status" | "referrer" | "sort") => {
    const config = options.find((option) => option.name === name)!;
    return (
      <Controller
        control={control}
        name={name}
        render={({ field }) => (
          <ReferrersSelect
            label={config.label}
            value={field.value}
            options={config.options}
            onChange={(value) => {
              field.onChange(value);
              resetPage();
            }}
          />
        )}
      />
    );
  };
  return (
    <div className="mx-auto min-w-[1024px] max-w-[1600px] space-y-5 px-6 py-6 tracking-normal">
      {selected ? (
        viewingReferrer && selectedReferrer ? (
          <ReferrerDetails
            referrer={selectedReferrer}
            history={history}
            periodEnd={summary.periodEnd}
            onBack={() => setViewingReferrer(false)}
            backLabel="Back to Payout Details"
          />
        ) : (
          <PayoutDetails
            payout={selected}
            referrer={selectedReferrer}
            rewards={rewards}
            timeline={timeline}
            audit={audit}
            onBack={() => {
              setSelectedId(null);
              setViewingReferrer(false);
            }}
            onViewReferrer={() => setViewingReferrer(true)}
          />
        )
      ) : (
        <>
          <header className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold">Referral Payouts</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                Monitor referral reward payouts and payment status across the
                platform.
              </p>
            </div>
            <div className="flex items-center gap-3">
              <ReferrersSelect
                label="Payout date range"
                value={filters.range}
                options={REFERRER_RANGES}
                onChange={changeRange}
              />
              <Button
                variant="outline"
                className="text-xs"
                onClick={exportRows}
              >
                <Download className="size-4" />
                Export
              </Button>
              <Link
                href="/settings"
                className="inline-flex h-9 items-center rounded-md bg-primary px-3 text-xs font-semibold text-primary-foreground hover:bg-primary/80"
              >
                Payout Settings
              </Link>
            </div>
          </header>
          <ReferralTabs activeTab="Payouts" onTabChange={onTabChange} />
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric) => (
              <article
                key={metric.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h2
                  className={`text-[10px] font-semibold ${metric.tone === "text-foreground" ? "text-muted-foreground" : metric.tone}`}
                >
                  {metric.label}
                </h2>
                <p className={`mt-1 text-2xl font-bold ${metric.tone}`}>
                  {metric.value}
                </p>
                <p
                  className={`mt-1 text-[11px] ${metric.tone === "text-success" ? "text-success" : "text-muted-foreground"}`}
                >
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>
          <PayoutOverviewChart
            data={chart.filter((point) =>
              inRange(`${point.date}T00:00:00+01:00`),
            )}
          />
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Payout Records</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Track referral rewards from payable status through successful
              payout.
            </p>
            <div className="my-4 flex items-center gap-2">
              <div className="relative w-72">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  {...register("search", { onChange: resetPage })}
                  aria-label="Search payouts"
                  placeholder="Search referrer, payout ID or transaction ref..."
                  className="h-8 bg-muted/20 pl-9 text-[11px]"
                />
              </div>
              {renderFilter("status")}
              <ReferrersSelect
                label="Payout table date range"
                value={filters.range}
                options={REFERRER_RANGES}
                onChange={changeRange}
              />
              {renderFilter("referrer")}
              <div className="ml-auto">{renderFilter("sort")}</div>
            </div>
            <div className="min-h-[370px]">
              <Table className="text-xs">
                <TableHeader>
                  <TableRow>
                    {[
                      "Referrer",
                      "Rewards Included",
                      "Payout Amount",
                      "Status",
                      "Payout Date",
                      "Reference",
                      "Action",
                    ].map((label) => (
                      <TableHead
                        key={label}
                        className="h-9 text-[10px] font-semibold uppercase text-muted-foreground"
                      >
                        {label}
                      </TableHead>
                    ))}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filtered
                    .slice((page - 1) * pagination.size, page * pagination.size)
                    .map((row) => (
                      <TableRow key={row.id} className="h-12">
                        <TableCell className="font-semibold">
                          {referrers.find(
                            (person) => person.id === row.referrerId,
                          )?.name ?? "—"}
                        </TableCell>
                        <TableCell className="text-muted-foreground">
                          {row.rewardsIncluded} rewards
                        </TableCell>
                        <TableCell className="font-semibold">
                          ₦{row.amount.toLocaleString()}
                        </TableCell>
                        <TableCell>
                          <PayoutStatusBadge status={row.status} />
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {formatPayoutDate(row.paidAt)}
                        </TableCell>
                        <TableCell className="text-[11px] text-muted-foreground">
                          {row.reference ?? "—"}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="link"
                            size="xs"
                            aria-label={`View payout ${row.id}`}
                            onClick={() => setSelectedId(row.id)}
                          >
                            View
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  {filtered.length === 0 && (
                    <TableRow>
                      <TableCell
                        colSpan={7}
                        className="py-14 text-center text-muted-foreground"
                      >
                        No payouts match your filters.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
            <ReferrersPagination
              page={page}
              count={filtered.length}
              size={pagination.size}
              noun="payout records"
              onChange={(next) => setPagination({ ...pagination, page: next })}
            />
          </section>
        </>
      )}
    </div>
  );
}
