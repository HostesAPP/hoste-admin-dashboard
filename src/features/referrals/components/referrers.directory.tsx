"use client";

import { useState } from "react";
import { Controller, useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Download, Filter, Search } from "lucide-react";
import { toast } from "sonner";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTitle,
  PopoverTrigger,
} from "@/components/ui/popover";
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
  ReferrersSummary,
} from "../referrers.types";
import type { ReferralTab } from "../referrals.overview.types";
import {
  referrersFilterSchema,
  REFERRERS_FILTER_DEFAULTS,
  REFERRER_RANGES,
  type ReferrersFilters,
} from "../schemas/referrers.filter.schema";
import { downloadReferralCsv } from "../referrals.export";
import { ReferralTabs } from "./referral.tabs";
import { ReferrerDetails } from "./referrer.details";
import {
  ReferrerStatusBadge,
  ReferrersPagination,
  ReferrersSelect,
} from "./referrers.controls";

const FILTERS = [
  {
    name: "status" as const,
    label: "Referrer status",
    options: [
      { value: "ALL", label: "Status: All Statuses" },
      ...referrersFilterSchema.shape.status.options
        .filter((value) => value !== "ALL")
        .map((value) => ({ value, label: value })),
    ],
  },
  {
    name: "qualification" as const,
    label: "Referrer qualification",
    options: [
      { value: "ALL", label: "Qual: All Qualification" },
      { value: "QUALIFIED", label: "Threshold reached" },
      { value: "PENDING", label: "Below threshold" },
    ],
  },
  {
    name: "range" as const,
    label: "Referrer date range",
    options: REFERRER_RANGES.map((item) => ({
      ...item,
      label: `Date: ${item.label}`,
    })),
  },
];

export function ReferrersDirectory({
  rows,
  history,
  summary,
  onTabChange,
}: {
  rows: DirectoryReferrer[];
  history: ReferrerHistoryRecord[];
  summary: ReferrersSummary;
  onTabChange: (tab: ReferralTab) => void;
}) {
  const { control, setValue, reset } = useForm<ReferrersFilters>({
    resolver: zodResolver(referrersFilterSchema),
    defaultValues: REFERRERS_FILTER_DEFAULTS,
  });
  const filters = useWatch({ control }) as ReferrersFilters;
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [pagination, setPagination] = useState({ page: 1, key: "" });
  const key = JSON.stringify(filters);
  const end = new Date(`${summary.periodEnd}T00:00:00Z`);
  const yesterday = new Date(end);
  yesterday.setUTCDate(yesterday.getUTCDate() - 1);
  const start = new Date(end);
  if (filters.range !== "ALL")
    start.setUTCDate(start.getUTCDate() - Number(filters.range) + 1);
  const filtered = rows.filter((row) => {
    const date = new Date(`${row.lastActivity}T00:00:00Z`);
    return (
      `${row.name} ${row.email} ${row.code}`
        .toLowerCase()
        .includes(filters.search.trim().toLowerCase()) &&
      (filters.status === "ALL" || row.status === filters.status) &&
      (filters.qualification === "ALL" ||
        row.threshold.reached === (filters.qualification === "QUALIFIED")) &&
      (filters.range === "ALL" || (date >= start && date <= end))
    );
  });
  const page =
    pagination.key === key
      ? Math.min(pagination.page, Math.max(1, Math.ceil(filtered.length / 10)))
      : 1;
  const selected = rows.find((row) => row.id === selectedId);
  const filterControls = () =>
    FILTERS.map((filter) => (
      <Controller
        key={filter.name}
        control={control}
        name={filter.name}
        render={({ field }) => (
          <ReferrersSelect
            label={filter.label}
            value={field.value}
            options={filter.options}
            onChange={field.onChange}
          />
        )}
      />
    ));
  const exportRows = () => {
    if (filtered.length === 0) {
      toast.error("No referrers to export.");
      return;
    }
    downloadReferralCsv(
      [
        [
          "Referrer",
          "Email",
          "Code",
          "People Referred",
          "Qualified",
          "Earnings",
          "Status",
          "Last Activity",
        ],
        ...filtered.map((row) => [
          row.name,
          row.email,
          row.code,
          row.peopleReferred,
          row.qualified,
          row.earnings,
          row.status,
          row.lastActivity,
        ]),
      ],
      "hoste-referrers.csv",
    );
    toast.success("Referrers exported.");
  };
  const metrics = [
    {
      label: "TOTAL REFERRERS",
      value: summary.total.toLocaleString(),
      detail: summary.breakdown,
      tone: "text-foreground",
    },
    {
      label: "ACTIVE REFERRERS",
      value: String(summary.active),
      detail: `${summary.activeRate} of total active promoters`,
      tone: "text-foreground",
    },
    {
      label: "SUCCESSFUL REFERRALS",
      value: String(summary.successful),
      detail: `₦${summary.successfulEarnings.toLocaleString()} earned (₦1,000 / referral)`,
      tone: "text-foreground",
    },
    {
      label: "TOTAL REWARDS EARNED",
      value: `₦${summary.totalRewards.toLocaleString()}`,
      detail: `${summary.rewardReferrals.toLocaleString()} successful referrals total`,
      tone: "text-foreground",
    },
  ];
  return (
    <div className="mx-auto min-w-[1024px] max-w-[1600px] space-y-5 px-6 py-6 tracking-normal">
      {selected ? (
        <ReferrerDetails
          referrer={selected}
          history={history}
          periodEnd={summary.periodEnd}
          onBack={() => setSelectedId(null)}
        />
      ) : (
        <>
          <header className="flex items-center justify-between gap-5">
            <div>
              <p className="text-[10px] text-muted-foreground">
                Referrals / <span className="text-primary">Referrers</span>
              </p>
              <h1 className="text-2xl font-bold">Referrers</h1>
              <p className="mt-1 text-xs text-muted-foreground">
                View referral activity, qualification status and earnings by
                referrer.
              </p>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative w-52">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(event) =>
                    setValue("search", event.target.value, { shouldDirty: true })
                  }
                  aria-label="Search referrers"
                  placeholder="Search referrer..."
                  className="h-9 bg-card pl-9 text-xs"
                />
              </div>
              <Popover>
                <PopoverTrigger
                  render={<Button variant="outline" className="text-xs" />}
                >
                  <Filter className="size-4" />
                  Filters
                </PopoverTrigger>
                <PopoverContent align="end">
                  <PopoverTitle>Filter Referrers</PopoverTitle>
                  {filterControls()}
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      reset({ ...REFERRERS_FILTER_DEFAULTS, range: "ALL" })
                    }
                  >
                    Clear Filters
                  </Button>
                </PopoverContent>
              </Popover>
              <Button
                variant="outline"
                className="text-xs"
                onClick={exportRows}
              >
                <Download className="size-4" />
                Export
              </Button>
            </div>
          </header>
          <ReferralTabs activeTab="Referrers" onTabChange={onTabChange} />
          <div className="grid grid-cols-4 gap-4">
            {metrics.map((metric, index) => (
              <article
                key={metric.label}
                className="rounded-lg border border-border bg-card p-4"
              >
                <h2 className="text-[10px] font-semibold text-muted-foreground">
                  {metric.label}
                </h2>
                <p className="mt-1 text-2xl font-bold">{metric.value}</p>
                <p
                  className={`mt-2 text-[10px] ${index === 1 || index === 2 ? "font-semibold text-success" : "text-muted-foreground"}`}
                >
                  {metric.detail}
                </p>
              </article>
            ))}
          </div>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">All Referrers</h2>
            <p className="mt-1 text-[11px] text-muted-foreground">
              Manage and review individual referral performance.
            </p>
            <div className="my-4 flex items-center gap-2">
              <div className="relative w-80">
                <Search className="absolute left-3 top-1/2 size-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={filters.search}
                  onChange={(event) =>
                    setValue("search", event.target.value, { shouldDirty: true })
                  }
                  aria-label="Search all referrers"
                  placeholder="Search by name, email or referral code"
                  className="h-8 bg-muted/20 pl-9 text-[11px]"
                />
              </div>
              {filterControls()}
            </div>
            <Table className="text-xs">
              <TableHeader className="bg-muted/30">
                <TableRow>
                  {[
                    "Referrer",
                    "Referral Code",
                    "People Referred",
                    "Qualified",
                    "Earnings",
                    "Status",
                    "Last Activity",
                    "",
                  ].map((label, index) => (
                    <TableHead
                      key={index}
                      className="h-9 text-[10px] font-semibold uppercase text-muted-foreground"
                    >
                      {label}
                    </TableHead>
                  ))}
                </TableRow>
              </TableHeader>
              <TableBody>
                {filtered.slice((page - 1) * 10, page * 10).map((row) => (
                  <TableRow key={row.id} className="h-[60px]">
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <Avatar className="size-8">
                          <AvatarFallback
                            className={`text-[10px] font-semibold ${row.id === "promoter-chiamaka" ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground"}`}
                          >
                            {row.name
                              .split(" ")
                              .slice(0, 2)
                              .map((part) => part[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div>
                          <p className="font-semibold">{row.name}</p>
                          <p className="mt-0.5 text-[10px] text-muted-foreground">
                            {row.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="rounded bg-muted/60 px-2 py-1 text-[10px] font-semibold">
                        {row.code}
                      </span>
                    </TableCell>
                    <TableCell className="font-semibold">
                      {row.peopleReferred}
                    </TableCell>
                    <TableCell className="font-semibold text-success">
                      {row.qualified}
                    </TableCell>
                    <TableCell className="font-semibold">
                      ₦{row.earnings.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <ReferrerStatusBadge status={row.status} />
                    </TableCell>
                    <TableCell className="text-[11px] text-muted-foreground">
                      {row.lastActivity === summary.periodEnd
                        ? "Today"
                        : row.lastActivity === yesterday.toISOString().slice(0, 10)
                          ? "Yesterday"
                          : new Date(
                              `${row.lastActivity}T00:00:00Z`,
                            ).toLocaleDateString("en-US", {
                              month: "short",
                              day: "numeric",
                              year: "numeric",
                              timeZone: "UTC",
                            })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="xs"
                        variant="ghost"
                        className="bg-primary/5 text-primary hover:bg-primary/10"
                        onClick={() => setSelectedId(row.id)}
                        aria-label={`View ${row.name}`}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
                {filtered.length === 0 && (
                  <TableRow>
                    <TableCell
                      colSpan={8}
                      className="py-14 text-center text-muted-foreground"
                    >
                      No referrers match your filters.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
            <ReferrersPagination
              page={page}
              size={10}
              count={filtered.length}
              noun="referrers"
              onChange={(next) => setPagination({ page: next, key })}
            />
          </section>
        </>
      )}
    </div>
  );
}
