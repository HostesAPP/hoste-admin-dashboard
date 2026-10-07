"use client";

import { useState } from "react";
import { ArrowLeft } from "lucide-react";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type {
  DirectoryReferrer,
  ReferrerHistoryRecord,
} from "../referrers.types";
import { REFERRER_RANGES } from "../schemas/referrers.filter.schema";
import {
  ReferrerStatusBadge,
  ReferrersPagination,
  ReferrersSelect,
} from "./referrers.controls";

export function ReferrerDetails({
  referrer,
  history,
  periodEnd,
  onBack,
  backLabel = "Back to Referrers",
}: {
  referrer: DirectoryReferrer;
  history: ReferrerHistoryRecord[];
  periodEnd: string;
  onBack: () => void;
  backLabel?: string;
}) {
  const [status, setStatus] = useState("ALL");
  const [range, setRange] = useState("30");
  const [pageState, setPageState] = useState({ page: 1, key: "" });
  const [selected, setSelected] = useState<ReferrerHistoryRecord | null>(null);
  const key = `${status}:${range}`;
  const end = new Date(`${periodEnd}T00:00:00Z`);
  const start = new Date(end);
  if (range !== "ALL") start.setUTCDate(start.getUTCDate() - Number(range) + 1);
  const filtered = history.filter(
    (row) =>
      row.referrerId === referrer.id &&
      (status === "ALL" || row.status === status) &&
      (range === "ALL" ||
        (new Date(`${row.date}T00:00:00Z`) >= start &&
          new Date(`${row.date}T00:00:00Z`) <= end)),
  );
  const page =
    pageState.key === key
      ? Math.min(pageState.page, Math.max(1, Math.ceil(filtered.length / 5)))
      : 1;
  const threshold = referrer.threshold;
  const metrics = [
    {
      label: "TOTAL REFERRALS",
      value: String(referrer.peopleReferred),
      detail: "People referred",
      tone: "text-foreground",
    },
    {
      label: "QUALIFIED",
      value: String(referrer.qualified),
      detail: "Successful referrals",
      tone: "text-success",
    },
    {
      label: "QUALIFICATION RATE",
      value: referrer.qualificationRate,
      detail: `${referrer.qualified} of ${referrer.peopleReferred} referrals`,
      tone: "text-foreground",
    },
    {
      label: "REFERRAL EARNINGS",
      value: `₦${referrer.earnings.toLocaleString()}`,
      detail: "Total rewards generated",
      tone: "text-primary",
    },
  ];
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">
            Referrals / Referrer Details
          </p>
          <h1 className="text-2xl font-bold">{referrer.name}</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            View referral activity, qualification progress and earnings for this
            referrer.
          </p>
        </div>
        <Button variant="outline" className="text-xs" onClick={onBack}>
          <ArrowLeft className="size-3.5" />
          {backLabel}
        </Button>
      </header>
      <section className="flex items-center gap-5 rounded-lg border border-border bg-card p-5">
        <Avatar className="size-11">
          <AvatarFallback className="bg-primary/10 text-sm font-semibold text-primary">
            {referrer.name
              .split(" ")
              .map((part) => part[0])
              .slice(0, 2)
              .join("")}
          </AvatarFallback>
        </Avatar>
        <div>
          <h2 className="text-sm font-bold">{referrer.name}</h2>
          <p className="mt-1 text-[11px] text-muted-foreground">
            Referral Code: {referrer.code}
          </p>
        </div>
        <div className="ml-10 border-l border-border pl-6">
          <ReferrerStatusBadge status={referrer.status} />
          <p className="mt-1 text-[11px] text-muted-foreground">
            {referrer.email}
          </p>
        </div>
      </section>
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
              className={`mt-1 text-[11px] ${metric.tone === "text-foreground" ? "text-muted-foreground" : metric.tone}`}
            >
              {metric.detail}
            </p>
          </article>
        ))}
      </div>
      <div className="grid grid-cols-[1fr_1fr] gap-5">
        <section className="rounded-lg border border-border bg-card p-5">
          <div className="flex items-start justify-between">
            <div>
              <h2 className="text-sm font-bold">Referral Threshold</h2>
              <p className="mt-1 text-[11px] text-muted-foreground">
                Progress toward the current referral threshold.
              </p>
            </div>
            <strong className="text-lg">
              {threshold.current} / {threshold.required} people
            </strong>
          </div>
          <div
            role="progressbar"
            aria-label="Referral threshold progress"
            aria-valuemin={0}
            aria-valuemax={100}
            aria-valuenow={threshold.progress}
            aria-valuetext={`${threshold.current} of ${threshold.required} people`}
            className="mt-4 h-2 overflow-hidden rounded-full bg-muted"
          >
            <div
              className={
                threshold.reached ? "h-full bg-success" : "h-full bg-primary"
              }
              style={{ width: `${threshold.progress}%` }}
            />
          </div>
          <p
            className={`mt-2 text-[11px] font-semibold ${threshold.reached ? "text-success" : "text-primary"}`}
          >
            {threshold.reached ? "Threshold reached" : "In progress"}
          </p>
          <div className="mt-2 flex justify-end gap-5 text-[10px] text-muted-foreground">
            <span>{threshold.current} referred</span>
            <span>{threshold.required} required</span>
            <span>{threshold.remaining} remaining</span>
          </div>
        </section>
        <section className="rounded-lg border border-border bg-card p-5">
          <h2 className="text-sm font-bold">Earnings Summary</h2>
          <dl className="mt-6 grid grid-cols-3 gap-3">
            {[
              ["Total Earned", referrer.earnings],
              ["Paid Out", referrer.paidOut],
              ["Pending", referrer.pending],
            ].map(([label, value]) => (
              <div key={label}>
                <dt className="text-[11px] text-muted-foreground">{label}</dt>
                <dd className="mt-1 text-lg font-bold">
                  {typeof value === "number"
                    ? `₦${value.toLocaleString()}`
                    : "—"}
                </dd>
              </div>
            ))}
          </dl>
        </section>
      </div>
      <section className="rounded-lg border border-border bg-card p-5">
        <div className="flex justify-between">
          <div>
            <h2 className="text-sm font-bold">Referral History</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              All referrals generated by {referrer.name}.
            </p>
          </div>
          <div className="text-right">
            <span className="rounded border border-border bg-muted/20 px-3 py-1 text-[10px] font-semibold">
              Referral Performance
            </span>
            <p className="mt-2 text-[10px] text-success">
              {referrer.qualified} of {referrer.peopleReferred} referrals
              qualified
            </p>
          </div>
        </div>
        <div className="my-4 flex gap-3">
          <ReferrersSelect
            label="History status"
            value={status}
            options={[
              { value: "ALL", label: "All Statuses" },
              { value: "Completed", label: "Completed" },
              { value: "Pending", label: "Pending" },
            ]}
            onChange={setStatus}
          />
          <ReferrersSelect
            label="History date range"
            value={range}
            options={REFERRER_RANGES}
            onChange={setRange}
          />
        </div>
        <Table className="text-xs">
          <TableHeader className="bg-muted/20">
            <TableRow>
              {[
                "Referred Person",
                "Referral Date",
                "Referral Status",
                "Qualifying Status",
                "Earning",
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
            {filtered.slice((page - 1) * 5, page * 5).map((row) => (
              <TableRow key={row.id} className="h-11">
                <TableCell>{row.person}</TableCell>
                <TableCell className="text-muted-foreground">
                  {new Date(`${row.date}T00:00:00Z`).toLocaleDateString(
                    "en-US",
                    {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    },
                  )}
                </TableCell>
                <TableCell>
                  <ReferrerStatusBadge status={row.status} />
                </TableCell>
                <TableCell>
                  <ReferrerStatusBadge status={row.qualification} />
                </TableCell>
                <TableCell
                  className={
                    row.earning ? "font-semibold text-success" : "font-semibold"
                  }
                >
                  ₦{row.earning.toLocaleString()}
                </TableCell>
                <TableCell>
                  <Button
                    variant="link"
                    size="xs"
                    onClick={() => setSelected(row)}
                    aria-label={`View referral for ${row.person}`}
                  >
                    View
                  </Button>
                </TableCell>
              </TableRow>
            ))}
            {filtered.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="py-14 text-center text-muted-foreground"
                >
                  No referral history matches these filters.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
        <ReferrersPagination
          page={page}
          size={5}
          count={filtered.length}
          noun="referrals"
          onChange={(next) => setPageState({ page: next, key })}
        />
      </section>
      <Dialog
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      >
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{selected?.person}</DialogTitle>
            <DialogDescription>Referral from {referrer.name}</DialogDescription>
          </DialogHeader>
          {selected && (
            <dl className="space-y-3 text-xs">
              {[
                ["Referral date", selected.date],
                ["Referral status", selected.status],
                ["Qualifying status", selected.qualification],
                ["Earning", `₦${selected.earning.toLocaleString()}`],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="flex justify-between border-b border-border pb-2"
                >
                  <dt className="text-muted-foreground">{label}</dt>
                  <dd className="font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
