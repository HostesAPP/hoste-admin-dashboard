"use client";

import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, RefreshCw, Search } from "lucide-react";
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
import { mockEarningsAdapter } from "../earnings.adapter";
import { earningInRange, filterEarnings } from "../earnings.utils";
import {
  EARNINGS_FILTER_DEFAULTS,
  earningsFilterSchema,
  type EarningsFilters,
} from "../schemas/earnings.schema";
import { REFERRER_RANGES } from "../schemas/referrers.filter.schema";
import type { EarningsAdapter, EarningsData } from "../types/earnings.types";
import type { DirectoryReferrer } from "../types/referrers.types";
import type { ReferralTab } from "../types/referrals.overview.types";
import { formatPayoutDate } from "../payouts.format";
import { downloadReferralCsv } from "../referrals.export";
import { ReferrersPagination, ReferrersSelect } from "./ReferrersControls";
import { ReferralTabs } from "./ReferralTabs";
import { PayoutStatusBadge } from "./PayoutStatusBadge";
import { EarningsChart } from "./earnings.chart";
import { ReferralConfiguration } from "./referral.configuration";

export function ReferralEarnings({
  initialData,
  referrers,
  onTabChange,
  adapter = mockEarningsAdapter,
}: {
  initialData: EarningsData;
  referrers: DirectoryReferrer[];
  onTabChange: (tab: ReferralTab) => void;
  adapter?: EarningsAdapter;
}) {
  const client = useQueryClient();
  const queryKey = ["referrals", "earnings", adapter.cacheKey];
  const query = useQuery({
    queryKey,
    queryFn: () => adapter.load(),
    initialData,
  });
  const { register, control, setValue } = useForm<EarningsFilters>({
    resolver: zodResolver(earningsFilterSchema),
    defaultValues: EARNINGS_FILTER_DEFAULTS,
  });
  const filters = useWatch({ control }) as EarningsFilters;
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState<string | null>(null);
  const data = query.data;
  const rows = filterEarnings(
    data.rows,
    referrers,
    filters,
    data.summary.periodEnd,
  );
  const currentPage = Math.min(page, Math.max(1, Math.ceil(rows.length / 10)));
  const exportRows = () => {
    if (!rows.length) {
      toast.error("No earnings to export.");
      return;
    }
    downloadReferralCsv(
      [
        [
          "Earning ID",
          "Referrer",
          "Referred Person",
          "Qualification Date",
          "Amount",
          "Status",
          "Payout Date",
        ],
        ...rows.map((row) => [
          row.id,
          referrers.find((person) => person.id === row.referrerId)?.name ?? "",
          row.referredPerson,
          row.qualifiedAt,
          row.amount,
          row.status,
          row.paidAt ?? "",
        ]),
      ],
      "hoste-referral-earnings.csv",
    );
    toast.success("Earnings exported.");
  };
  const changeRange = (value: string) => {
    setValue("range", value as EarningsFilters["range"]);
    setPage(1);
  };
  const renderFilter = (
    name: "status" | "referrer" | "sort",
    label: string,
    options: { value: string; label: string }[],
  ) => (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <ReferrersSelect
          label={label}
          value={field.value}
          options={options}
          onChange={(value) => {
            field.onChange(value);
            setPage(1);
          }}
        />
      )}
    />
  );
  if (selected)
    return (
      <div className="mx-auto min-w-[1024px] max-w-[1600px] px-6 py-6">
        <ReferralConfiguration
          settings={data.configuration}
          canManage={data.canManage}
          onBack={() => setSelected(null)}
          onSave={async (settings) => {
            const configuration = await adapter.saveConfiguration(settings);
            client.setQueryData<EarningsData>(queryKey, (previous) =>
              previous ? { ...previous, configuration } : previous,
            );
            toast.success(
              "Referral configuration saved in preview. No payouts or notifications were sent.",
            );
          }}
        />
      </div>
    );
  const metrics = [
    {
      label: "Total Earnings",
      value: `₦${data.summary.total.toLocaleString()}`,
      detail: "Generated from qualifying referrals",
      tone: "border-primary",
      text: "text-foreground",
    },
    {
      label: "Paid",
      value: `₦${data.summary.paid.toLocaleString()}`,
      detail: "Successfully paid rewards",
      tone: "border-success",
      text: "text-success",
    },
    {
      label: "Pending",
      value: `₦${data.summary.pending.toLocaleString()}`,
      detail: "Awaiting payout",
      tone: "border-foreground",
      text: "text-foreground",
    },
    {
      label: "Successful Rewards",
      value: data.summary.successfulRewards.toLocaleString(),
      detail: "Qualifying referral rewards",
      tone: "border-success",
      text: "text-success",
    },
  ];
  return (
    <div className="mx-auto min-w-[1024px] max-w-[1600px] space-y-5 px-6 py-6 tracking-normal">
      <header className="flex items-center justify-between gap-5">
        <div>
          <h1 className="text-2xl font-bold">Referral Earnings</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Track referral rewards generated, pending and paid across the
            platform.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <ReferrersSelect
            label="Earnings date range"
            value={filters.range}
            options={REFERRER_RANGES}
            onChange={changeRange}
          />
          <Button variant="outline" className="text-xs" onClick={exportRows}>
            <Download className="size-4" />
            Export
          </Button>
          <Button
            variant="outline"
            size="icon"
            aria-label="Refresh earnings"
            title="Refresh earnings"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            <RefreshCw
              className={`size-4 ${query.isFetching ? "animate-spin" : ""}`}
            />
          </Button>
        </div>
      </header>
      <ReferralTabs activeTab="Referral Earnings" onTabChange={onTabChange} />
      {query.isError && (
        <div
          role="alert"
          className="flex items-center justify-between rounded-md border border-destructive/30 bg-destructive/5 p-3 text-xs"
        >
          <p className="text-destructive">
            Unable to refresh earnings. {query.error.message}
          </p>
          <Button
            variant="outline"
            size="sm"
            disabled={query.isFetching}
            onClick={() => void query.refetch()}
          >
            Try Again
          </Button>
        </div>
      )}
      <div className="grid grid-cols-4 gap-4">
        {metrics.map((metric) => (
          <article
            key={metric.label}
            className="flex items-center gap-3 rounded-lg border border-border bg-card p-4"
          >
            <span className={`h-10 border-l-[3px] ${metric.tone}`} />
            <div>
              <h2 className="text-[11px] text-muted-foreground">
                {metric.label}
              </h2>
              <p className={`text-2xl font-bold ${metric.text}`}>
                {metric.value}
              </p>
              <p className="mt-1 text-[10px] text-muted-foreground">
                {metric.detail}
              </p>
            </div>
          </article>
        ))}
      </div>
      <EarningsChart
        data={data.chart.filter((point) =>
          earningInRange(point.date, data.summary.periodEnd, filters.range),
        )}
      />
      <section className="border-y border-border bg-card py-5">
        <div className="flex justify-between px-5">
          <div>
            <h2 className="text-sm font-bold">Earning Records</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Referral rewards generated from qualifying referral activity.
            </p>
          </div>
          <Button
            variant="outline"
            size="sm"
            className="text-xs"
            onClick={exportRows}
          >
            <Download className="size-3.5" />
            Export
          </Button>
        </div>
        <div className="my-4 grid grid-cols-[minmax(220px,2fr)_repeat(4,minmax(128px,1fr))] items-center gap-3 px-5 [&_[data-slot=select-trigger]]:w-full">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              {...register("search", { onChange: () => setPage(1) })}
              aria-label="Search earning records"
              placeholder="Search referrer or referred person..."
              className="h-9 pl-9 text-[11px]"
            />
          </div>
          {renderFilter("status", "Earning status", [
            { value: "ALL", label: "All Statuses" },
            { value: "Paid", label: "Paid" },
            { value: "Pending", label: "Pending" },
          ])}
          <ReferrersSelect
            label="Earning records date range"
            value={filters.range}
            options={REFERRER_RANGES}
            onChange={changeRange}
          />
          {renderFilter("referrer", "Earning referrer", [
            { value: "ALL", label: "All Referrers" },
            ...referrers
              .filter((person) =>
                data.rows.some((row) => row.referrerId === person.id),
              )
              .map((person) => ({ value: person.id, label: person.name })),
          ])}
          {renderFilter("sort", "Earning sort order", [
            { value: "NEWEST", label: "Newest First" },
            { value: "OLDEST", label: "Oldest First" },
          ])}
        </div>
        <div className="min-h-[360px]">
          <Table className="text-xs">
            <TableHeader className="bg-muted/30">
              <TableRow>
                {[
                  "Referrer",
                  "Referred Person",
                  "Qualification Date",
                  "Earning Amount",
                  "Status",
                  "Payout Date",
                  "Action",
                ].map((label) => (
                  <TableHead
                    key={label}
                    className="h-10 px-5 text-[9px] font-semibold uppercase text-muted-foreground"
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {rows
                .slice((currentPage - 1) * 10, currentPage * 10)
                .map((row) => (
                  <TableRow key={row.id} className="h-14">
                    <TableCell className="px-5 font-semibold">
                      {referrers.find((person) => person.id === row.referrerId)
                        ?.name ?? "Unknown referrer"}
                    </TableCell>
                    <TableCell className="px-5 font-semibold">
                      {row.referredPerson}
                    </TableCell>
                    <TableCell className="px-5 text-[11px] text-muted-foreground">
                      {formatPayoutDate(row.qualifiedAt)}
                    </TableCell>
                    <TableCell className="px-5 font-semibold">
                      ₦{row.amount.toLocaleString()}
                    </TableCell>
                    <TableCell className="px-5">
                      <PayoutStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="px-5 text-[11px] text-muted-foreground">
                      {formatPayoutDate(row.paidAt)}
                    </TableCell>
                    <TableCell className="px-5">
                      <Button
                        variant="link"
                        size="xs"
                        aria-label={`View earning ${row.id}`}
                        onClick={() => setSelected(row.id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              {!rows.length && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-muted-foreground"
                  >
                    {data.rows.length
                      ? "No earnings match your filters."
                      : "No referral earnings yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
        <div className="px-5">
          <ReferrersPagination
            page={currentPage}
            size={10}
            count={rows.length}
            noun="earning records"
            onChange={setPage}
          />
        </div>
      </section>
    </div>
  );
}
