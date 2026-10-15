"use client";

import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CalendarDays, ChevronDown, Download } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type {
  ActivityPromoter,
  ActivityReferral,
  ActivitySummary,
} from "../referrals.activity.types";
import type { ReferralTab } from "../referrals.overview.types";
import {
  ACTIVITY_FILTER_DEFAULTS,
  ACTIVITY_RANGES,
  referralActivitySchema,
  type ReferralActivityFilters,
} from "../schemas/referral.activity.schema";
import { downloadReferralCsv } from "../referrals.export";
import { ReferralTabs } from "./referral.tabs";
import { ReferralActivityFiltersBar } from "./referral.activity.filters";
import {
  ReferralActivityDetails,
  ReferralActivityTable,
} from "./referral.activity.table";

export function ReferralActivity({
  rows,
  promoters,
  summary,
  onTabChange,
}: {
  rows: ActivityReferral[];
  promoters: ActivityPromoter[];
  summary: ActivitySummary;
  onTabChange: (tab: ReferralTab) => void;
}) {
  const { control, register, setValue, reset } =
    useForm<ReferralActivityFilters>({
      resolver: zodResolver(referralActivitySchema),
      defaultValues: ACTIVITY_FILTER_DEFAULTS,
    });
  const filters = useWatch({ control }) as ReferralActivityFilters;
  const [selected, setSelected] = useState<string[]>([]);
  const [pageState, setPageState] = useState({
    page: 1,
    size: 25,
    filterKey: "",
  });
  const [details, setDetails] = useState<ActivityReferral | null>(null);
  const filterKey = JSON.stringify(filters);
  const pageSize = pageState.size;
  const query = filters.search.trim().toLowerCase();
  const end = new Date(`${summary.periodEnd}T00:00:00Z`);
  const start = new Date(end);
  if (filters.range !== "ALL")
    start.setUTCDate(start.getUTCDate() - Number(filters.range) + 1);
  const filtered = rows.filter((row) => {
    const promoter = promoters.find((item) => item.id === row.referrerId);
    const date = new Date(`${row.date}T00:00:00Z`);
    return (
      (filters.range === "ALL" || (date >= start && date <= end)) &&
      (filters.status === "ALL" || row.qualification === filters.status) &&
      (filters.type === "ALL" || promoter?.type === filters.type) &&
      (filters.reward === "ALL" ||
        (filters.reward === "EARNED"
          ? row.rewardAmount !== null
          : row.rewardAmount === null)) &&
      `${row.id} ${promoter?.name} ${promoter?.email} ${promoter?.code} ${row.referredUser}`
        .toLowerCase()
        .includes(query)
    );
  });
  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const page =
    pageState.filterKey === filterKey
      ? Math.min(pageState.page, totalPages)
      : 1;
  const offset = (page - 1) * pageSize;
  const pageRows = filtered.slice(offset, offset + pageSize);
  const selectedRows = filtered.filter((row) => selected.includes(row.id));
  const toggle = (id: string) =>
    setSelected((previous) =>
      previous.includes(id)
        ? previous.filter((item) => item !== id)
        : [...previous, id],
    );
  const exportRows = (selectionOnly: boolean) => {
    const records = selectionOnly ? selectedRows : filtered;
    if (records.length === 0) {
      toast.error("No referrals to export.");
      return;
    }
    downloadReferralCsv(
      [
        [
          "Referral ID",
          "Referrer",
          "Email",
          "Type",
          "Code",
          "Referred User",
          "Qualification",
          "Reward",
          "Payout",
          "Date",
        ],
        ...records.map((row) => {
          const promoter = promoters.find((item) => item.id === row.referrerId);
          return [
            row.id,
            promoter?.name ?? "",
            promoter?.email ?? "",
            promoter?.type ?? "",
            promoter?.code ?? "",
            row.referredUser,
            row.qualification,
            row.rewardAmount ?? "",
            row.payout ?? "",
            row.date,
          ];
        }),
      ],
      `hoste-referral-activity${selectionOnly ? "-selected" : ""}.csv`,
    );
    toast.success("Referral activity exported.");
  };

  return (
    <div className="mx-auto min-w-[1024px] max-w-[1600px] space-y-5 px-6 py-6 tracking-normal">
      <header className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Referral Activity</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Track every referral from registration to successful conversion and
            reward.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Select
            value={filters.range}
            onValueChange={(value) => {
              if (
                value &&
                referralActivitySchema.shape.range.safeParse(value).success
              )
                setValue("range", value as ReferralActivityFilters["range"]);
            }}
          >
            <SelectTrigger
              aria-label="Activity date range"
              className="w-40 bg-card text-xs"
            >
              <CalendarDays className="size-4" />
              <SelectValue>
                {
                  ACTIVITY_RANGES.find((item) => item.value === filters.range)
                    ?.label
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {ACTIVITY_RANGES.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DropdownMenu>
            <DropdownMenuTrigger className="inline-flex h-9 items-center gap-2 rounded-md border border-border bg-card px-3 text-xs font-semibold">
              <Download className="size-4" />
              Export
              <ChevronDown className="size-3" />
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="min-w-56">
              <DropdownMenuItem
                disabled={filtered.length === 0}
                onClick={() => exportRows(false)}
              >
                Export filtered referrals
              </DropdownMenuItem>
              <DropdownMenuItem
                disabled={selectedRows.length === 0}
                onClick={() => exportRows(true)}
              >
                Export selected ({selectedRows.length})
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </header>
      <ReferralTabs activeTab="Referral Activity" onTabChange={onTabChange} />
      <div className="grid w-[86%] grid-cols-4 gap-4">
        <article className="rounded-lg border border-border bg-card p-4">
          <div className="flex items-center justify-between">
            <h2 className="text-xs font-semibold text-muted-foreground">
              Total Referrals
            </h2>
            <span className="rounded-full border border-border bg-muted/20 px-3 py-0.5 text-[10px] text-muted-foreground">
              All
            </span>
          </div>
          <p className="mt-1 text-2xl font-bold">
            {summary.total.toLocaleString()}
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-xs font-semibold text-muted-foreground">
            Registered
          </h2>
          <p className="mt-1 text-2xl font-bold">
            {summary.registered.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-success">
            {summary.conversionRate} conversion rate
          </p>
        </article>
        <article className="rounded-lg border border-border border-t-[3px] border-t-success bg-card p-4">
          <h2 className="text-xs font-semibold text-muted-foreground">
            Successful
          </h2>
          <p className="mt-1 text-2xl font-bold text-success">
            {summary.successful.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] font-semibold text-success">
            ₦{summary.earned.toLocaleString()} earned
          </p>
        </article>
        <article className="rounded-lg border border-border bg-card p-4">
          <h2 className="text-xs font-semibold text-muted-foreground">
            Pending Qualification
          </h2>
          <p className="mt-1 text-2xl font-bold text-primary">
            {summary.pending.toLocaleString()}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Awaiting required action
          </p>
        </article>
      </div>
      <section className="overflow-hidden rounded-lg border border-border bg-card">
        <div className="p-5 pb-3">
          <h2 className="text-base font-bold">All Referrals</h2>
          <p className="text-xs text-muted-foreground">
            View and trace referral activity across Hosté ecosystem.
          </p>
        </div>
        <ReferralActivityFiltersBar
          control={control}
          register={register}
          setValue={setValue}
          filters={filters}
          selectedCount={selectedRows.length}
          onClear={() => {
            reset({ ...ACTIVITY_FILTER_DEFAULTS, range: "ALL" });
            setSelected([]);
          }}
        />
        <ReferralActivityTable
          rows={pageRows}
          promoters={promoters}
          selected={selected}
          onToggle={toggle}
          onView={setDetails}
          onSelectPage={(checked) =>
            setSelected((previous) =>
              checked
                ? [...new Set([...previous, ...pageRows.map((row) => row.id)])]
                : previous.filter(
                    (id) => !pageRows.some((row) => row.id === id),
                  ),
            )
          }
        />
        <footer className="flex items-center justify-between gap-4 border-t border-border px-4 py-3 text-[11px] text-muted-foreground">
          <span>
            Showing{" "}
            <strong className="text-foreground">
              {filtered.length ? offset + 1 : 0}–
              {Math.min(offset + pageSize, filtered.length)}
            </strong>{" "}
            of{" "}
            <strong className="text-foreground">
              {filtered.length.toLocaleString()}
            </strong>{" "}
            referrals
          </span>
          <div className="flex items-center gap-3">
            <span>Rows per page:</span>
            <Select
              value={String(pageSize)}
              onValueChange={(value) => {
                if (value && [5, 10, 25, 50].includes(Number(value)))
                  setPageState({ page: 1, size: Number(value), filterKey });
              }}
            >
              <SelectTrigger
                aria-label="Activity rows per page"
                className="h-7 w-16 text-[11px]"
              >
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[5, 10, 25, 50].map((size) => (
                  <SelectItem key={size} value={String(size)}>
                    {size}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-1.5">
            <Button
              variant="outline"
              size="sm"
              className="text-[11px]"
              disabled={page === 1}
              onClick={() =>
                setPageState({ page: page - 1, size: pageSize, filterKey })
              }
            >
              Previous
            </Button>
            {Array.from({ length: totalPages }, (_, index) => index + 1).map(
              (number) => (
                <Button
                  key={number}
                  variant={page === number ? "default" : "outline"}
                  size="icon-sm"
                  aria-label={`Activity page ${number}`}
                  aria-current={page === number ? "page" : undefined}
                  onClick={() =>
                    setPageState({ page: number, size: pageSize, filterKey })
                  }
                >
                  {number}
                </Button>
              ),
            )}
            <Button
              variant="outline"
              size="sm"
              className="text-[11px]"
              disabled={page === totalPages}
              onClick={() =>
                setPageState({ page: page + 1, size: pageSize, filterKey })
              }
            >
              Next
            </Button>
          </div>
        </footer>
      </section>
      <ReferralActivityDetails
        referral={details}
        promoter={promoters.find((item) => item.id === details?.referrerId)}
        onClose={() => setDetails(null)}
      />
    </div>
  );
}
