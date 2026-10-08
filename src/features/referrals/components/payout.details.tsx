"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ArrowRight,
  CheckCircle2,
  CircleDot,
  Download,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { DirectoryReferrer } from "../referrers.types";
import type {
  ReferralPayout,
  PayoutEvent,
  PayoutRewardRecord,
} from "../payouts.types";
import { formatPayoutDate } from "../payouts.format";
import { PayoutStatusBadge } from "./payout.status.badge";
import { ReferrerStatusBadge } from "./referrers.controls";

function PayoutRewardsTable({ rows }: { rows: PayoutRewardRecord[] }) {
  return (
    <Table className="text-[11px]">
      <TableHeader className="bg-muted/30">
        <TableRow>
          {[
            "Referral ID",
            "Referred User",
            "Qualification",
            "Reward",
            "Status",
          ].map((label) => (
            <TableHead
              key={label}
              className="h-9 text-[9px] font-semibold uppercase text-muted-foreground"
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => (
          <TableRow key={row.id} className="h-10">
            <TableCell>{row.referralId}</TableCell>
            <TableCell>{row.referredUser}</TableCell>
            <TableCell>{row.qualification}</TableCell>
            <TableCell className="font-semibold">
              ₦{row.reward.toLocaleString()}
            </TableCell>
            <TableCell>
              <span className="rounded-full bg-success/10 px-2 py-0.5 text-[9px] font-semibold text-success">
                {row.status}
              </span>
            </TableCell>
          </TableRow>
        ))}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={5}
              className="py-10 text-center text-muted-foreground"
            >
              No reward breakdown available.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function PayoutDetails({
  payout,
  referrer,
  rewards,
  timeline,
  audit,
  onBack,
  onViewReferrer,
}: {
  payout: ReferralPayout;
  referrer?: DirectoryReferrer;
  rewards: PayoutRewardRecord[];
  timeline: PayoutEvent[];
  audit: PayoutEvent[];
  onBack: () => void;
  onViewReferrer: () => void;
}) {
  const [modal, setModal] = useState<"receipt" | "rewards" | null>(null);
  const includedRewards = rewards.filter(
    (reward) => reward.payoutId === payout.id,
  );
  const events = timeline.filter((event) => event.payoutId === payout.id);
  const auditEvents = audit.filter((event) => event.payoutId === payout.id);
  const amount = `₦${payout.amount.toLocaleString()}`;
  const canViewReceipt = payout.status === "Paid" && payout.paidAt !== null;
  const summaryFields = [
    ["PAYOUT ID", payout.id],
    ["REFERRER", referrer?.name ?? "—"],
    ["REFERRAL CODE", referrer?.code ?? "—"],
    ["PAYOUT AMOUNT", amount],
    ["REWARDS INCLUDED", `${payout.rewardsIncluded} rewards`],
    ["CURRENCY", payout.currency],
  ];
  const downloadReceipt = () => {
    const text = [
      "HOSTE REFERRAL PAYOUT RECEIPT",
      `Payout ID: ${payout.id}`,
      `Referrer: ${referrer?.name ?? "—"}`,
      `Referral code: ${referrer?.code ?? "—"}`,
      `Amount: ${payout.currency} ${payout.amount.toLocaleString()}`,
      `Rewards included: ${payout.rewardsIncluded}`,
      `Status: ${payout.status}`,
      `Transaction reference: ${payout.reference ?? "—"}`,
      `Payment date: ${formatPayoutDate(payout.paidAt, true)}`,
    ].join("\n");
    const url = URL.createObjectURL(
      new Blob([text], { type: "text/plain;charset=utf-8" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = `${payout.id}-receipt.txt`;
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
  };
  return (
    <div className="space-y-5">
      <header className="flex items-center justify-between">
        <div>
          <p className="text-[10px] text-muted-foreground">
            Referrals / Referral Payouts / Payout Details
          </p>
          <h1 className="mt-1 text-2xl font-bold">Payout Details</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            View the complete information and settlement status for this
            referral payout.
          </p>
        </div>
        <Button variant="outline" className="text-xs" onClick={onBack}>
          <ArrowLeft className="size-3.5" />
          Back to Payouts
        </Button>
      </header>
      <section className="flex items-center justify-between rounded-lg border border-border bg-card p-5">
        <div>
          <h2 className="text-lg font-bold">Payout #{payout.id}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Created {formatPayoutDate(payout.createdAt, true)}
          </p>
        </div>
        <div className="flex items-center gap-5">
          <div className="text-right">
            <p className="text-2xl font-bold">{amount}</p>
            <p className="text-[11px] text-muted-foreground">
              {payout.rewardsIncluded} rewards included
            </p>
          </div>
          <PayoutStatusBadge status={payout.status} dot />
        </div>
      </section>
      <div className="grid grid-cols-[minmax(0,1.65fr)_minmax(0,1fr)] gap-5">
        <div className="min-w-0 space-y-5">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="border-b border-border pb-3 text-sm font-bold">
              Payout Summary
            </h2>
            <dl className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4">
              {summaryFields.map(([label, value]) => (
                <div key={label}>
                  <dt className="text-[10px] text-muted-foreground">{label}</dt>
                  <dd className="mt-0.5 text-xs font-semibold">{value}</dd>
                </div>
              ))}
            </dl>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Reward Breakdown</h2>
            <p className="mb-4 mt-1 text-xs text-muted-foreground">
              Referral rewards included in this payout.
            </p>
            <PayoutRewardsTable rows={includedRewards.slice(0, 4)} />
            <div className="mt-3 flex items-center justify-between gap-2 text-[10px]">
              <span className="text-muted-foreground">
                {payout.rewardsIncluded} rewards included · Total {amount}
              </span>
              <button
                type="button"
                className="flex items-center gap-1 font-semibold text-primary"
                onClick={() => setModal("rewards")}
              >
                View all rewards <ArrowRight className="size-3" />
              </button>
            </div>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Activity & Audit Trail</h2>
            <p className="mt-1 text-xs text-muted-foreground">
              Track important events and administrative activity related to this
              payout.
            </p>
            <ol className="mt-4 space-y-3">
              {auditEvents.map((event) => (
                <li
                  key={event.id}
                  className="flex items-start justify-between gap-4 text-[11px]"
                >
                  <span className="flex items-center gap-2">
                    <span
                      className={`size-1.5 shrink-0 rounded-full ${event.completed ? "bg-success" : "bg-muted-foreground/50"}`}
                    />
                    <span
                      className={
                        event.completed
                          ? "font-semibold"
                          : "text-muted-foreground"
                      }
                    >
                      {event.label}
                    </span>
                    <span className="rounded bg-muted/60 px-1.5 py-0.5 text-[9px] text-muted-foreground">
                      {event.actor}
                    </span>
                  </span>
                  <time
                    className="shrink-0 text-[10px] text-muted-foreground"
                    dateTime={event.date}
                  >
                    {formatPayoutDate(event.date, true)}
                  </time>
                </li>
              ))}
            </ol>
            {auditEvents.length === 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                No audit events available.
              </p>
            )}
            <Link
              href="/audit-logs"
              className="mt-5 flex items-center gap-1 border-t border-border pt-3 text-xs font-semibold text-primary"
            >
              View Full Audit Log <ArrowRight className="size-3" />
            </Link>
          </section>
        </div>
        <div className="min-w-0 space-y-5">
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Referrer</h2>
            <div className="mt-4 flex items-center gap-3">
              <Avatar className="size-10">
                <AvatarFallback className="bg-primary text-xs font-semibold text-primary-foreground">
                  {referrer?.name
                    .split(" ")
                    .slice(0, 2)
                    .map((part) => part[0])
                    .join("") ?? "—"}
                </AvatarFallback>
              </Avatar>
              <div>
                <h3 className="text-xs font-bold">{referrer?.name ?? "—"}</h3>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Referral Code: {referrer?.code ?? "—"}
                </p>
              </div>
            </div>
            <p className="mt-2 flex items-center gap-1 text-[11px] text-muted-foreground">
              Account Status:{" "}
              {referrer && <ReferrerStatusBadge status={referrer.status} />}
            </p>
            <button
              type="button"
              disabled={!referrer}
              className="mt-3 flex items-center gap-1 text-xs font-semibold text-primary disabled:opacity-50"
              onClick={onViewReferrer}
            >
              View Referrer Details <ArrowRight className="size-3" />
            </button>
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Payout Timeline</h2>
            <ol className="mt-4 space-y-5">
              {events.map((event) => (
                <li key={event.id} className="flex gap-3">
                  {event.completed ? (
                    <CheckCircle2 className="size-4 shrink-0 text-success" />
                  ) : (
                    <CircleDot className="size-4 shrink-0 text-primary" />
                  )}
                  <div>
                    <p className="text-xs font-semibold">{event.label}</p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {event.actor} · {formatPayoutDate(event.date, true)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
            {events.length === 0 && (
              <p className="mt-4 text-xs text-muted-foreground">
                No timeline events available.
              </p>
            )}
          </section>
          <section className="rounded-lg border border-border bg-card p-5">
            <h2 className="text-sm font-bold">Transaction Information</h2>
            <dl className="mt-4 space-y-3">
              {[
                ["TRANSACTION REFERENCE", payout.reference ?? "—"],
                ["PAYMENT STATUS", payout.status],
                ["PAYMENT DATE", formatPayoutDate(payout.paidAt, true)],
              ].map(([label, value]) => (
                <div
                  key={label}
                  className="border-b border-border pb-2 last:border-0"
                >
                  <dt className="text-[10px] text-muted-foreground">{label}</dt>
                  <dd
                    className={`mt-1 text-xs font-semibold ${label === "PAYMENT STATUS" && payout.status === "Paid" ? "text-success" : ""}`}
                  >
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
          </section>
        </div>
      </div>
      <footer className="flex justify-end gap-3 border-t border-border pt-4">
        <Button
          variant="outline"
          className="text-xs"
          aria-label="Return to Payout Records"
          onClick={onBack}
        >
          Back to Payouts
        </Button>
        <Button
          className="text-xs"
          disabled={!canViewReceipt}
          title={
            canViewReceipt
              ? "View payout receipt"
              : "Receipt available after payment"
          }
          onClick={() => setModal("receipt")}
        >
          <Download className="size-3.5" />
          View Receipt
        </Button>
      </footer>
      <Dialog
        open={modal !== null}
        onOpenChange={(open) => {
          if (!open) setModal(null);
        }}
      >
        <DialogContent
          className={modal === "rewards" ? "sm:max-w-3xl" : "sm:max-w-lg"}
        >
          <DialogHeader>
            <DialogTitle>
              {modal === "rewards" ? "Rewards Included" : "Payout Receipt"}
            </DialogTitle>
            <DialogDescription>
              {payout.id} · {referrer?.name ?? "—"}
            </DialogDescription>
          </DialogHeader>
          {modal === "rewards" ? (
            <>
              <PayoutRewardsTable rows={includedRewards} />
              <p className="text-xs text-muted-foreground">
                Showing {includedRewards.length} of {payout.rewardsIncluded}{" "}
                rewards.
              </p>
            </>
          ) : (
            <>
              <dl className="space-y-3 text-xs">
                {[
                  ...summaryFields,
                  ["TRANSACTION REFERENCE", payout.reference ?? "—"],
                  ["PAYMENT STATUS", payout.status],
                  ["PAYMENT DATE", formatPayoutDate(payout.paidAt, true)],
                ].map(([label, value]) => (
                  <div
                    key={label}
                    className="flex justify-between gap-4 border-b border-border pb-2"
                  >
                    <dt className="text-muted-foreground">{label}</dt>
                    <dd className="text-right font-semibold">{value}</dd>
                  </div>
                ))}
              </dl>
              <Button
                onClick={downloadReceipt}
                className="justify-self-end text-xs"
              >
                <Download className="size-4" />
                Download Receipt
              </Button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
