import { useState } from "react";
import { ArrowRight, ChevronLeft, ChevronRight } from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import type {
  ReferralActivityOverview,
  ReferrerOverview,
} from "../referrals.overview.types";

export function ReferralTag({ label }: { label: string }) {
  const tone =
    label === "Student"
      ? "bg-primary/10 text-primary"
      : ["Qualified", "Approved", "Paid", "Partner"].includes(label)
        ? "bg-success/10 text-success"
        : label === "Rejected"
          ? "bg-destructive/10 text-destructive"
          : ["Pending", "Pending Review"].includes(label)
            ? "bg-yellow/15 text-warning"
            : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[9px] font-semibold whitespace-nowrap ${tone}`}
    >
      {label}
    </span>
  );
}

export function ReferrersTable({
  rows,
  onViewAll,
}: {
  rows: ReferrerOverview[];
  onViewAll?: () => void;
}) {
  const [page, setPage] = useState(1);
  const totalPages = Math.max(1, Math.ceil(rows.length / 10));
  const currentPage = Math.min(page, totalPages);
  const offset = (currentPage - 1) * 10;
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">Top Referrers</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Promoters generating the highest number of successful referrals
            (₦1,000 each).
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View All Referrers <ArrowRight className="size-3" />
          </button>
        )}
      </div>
      <Table className="text-[11px]">
        <TableHeader className="bg-muted/40">
          <TableRow>
            {[
              "Rank",
              "Referrer Promoter",
              "Type",
              "Total Ref",
              "Successful (Qualified)",
              "Earned (₦1k ea)",
              "Paid",
            ].map((label) => (
              <TableHead
                key={label}
                className="h-8 text-[9px] font-semibold uppercase text-muted-foreground last:text-right"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.slice(offset, offset + 10).map((row, index) => (
            <TableRow key={row.id} className="h-10">
              <TableCell>
                <span
                  className={`inline-flex size-5 items-center justify-center rounded-full text-[10px] font-semibold ${offset + index === 0 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"}`}
                >
                  {offset + index + 1}
                </span>
              </TableCell>
              <TableCell>
                <span className="font-semibold">{row.name}</span>{" "}
                <span className="text-[9px] text-muted-foreground">
                  ({row.code})
                </span>
              </TableCell>
              <TableCell>
                <ReferralTag label={row.type} />
              </TableCell>
              <TableCell>{row.total}</TableCell>
              <TableCell className="font-semibold text-primary">
                {row.successful}
              </TableCell>
              <TableCell className="font-semibold">
                ₦{row.earned.toLocaleString()}
              </TableCell>
              <TableCell className="text-right font-semibold text-success">
                ₦{row.paid.toLocaleString()}
              </TableCell>
            </TableRow>
          ))}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={7}
                className="py-10 text-center text-muted-foreground"
              >
                No referrers match your search.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
      <div className="mt-3 flex items-center justify-between text-[11px] text-muted-foreground">
        <span>
          Showing {rows.length ? offset + 1 : 0}–
          {Math.min(offset + 10, rows.length)} of {rows.length} referrers
        </span>
        <div className="flex gap-1">
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Previous referrer page"
            disabled={currentPage === 1}
            onClick={() => setPage(currentPage - 1)}
          >
            <ChevronLeft />
          </Button>
          <span className="flex size-6 items-center justify-center rounded border border-border text-foreground">
            {currentPage}
          </span>
          <Button
            variant="outline"
            size="icon-xs"
            aria-label="Next referrer page"
            disabled={currentPage === totalPages}
            onClick={() => setPage(currentPage + 1)}
          >
            <ChevronRight />
          </Button>
        </div>
      </div>
    </section>
  );
}

export function RecentReferralsTable({
  rows,
  referrers,
  title = "Recent Referrals",
  onViewAll,
}: {
  rows: ReferralActivityOverview[];
  referrers: ReferrerOverview[];
  title?: string;
  onViewAll?: () => void;
}) {
  return (
    <section className="rounded-lg border border-border bg-card p-5">
      <div className="mb-3 flex items-center justify-between">
        <div>
          <h2 className="text-sm font-bold">{title}</h2>
          <p className="mt-1 text-xs text-muted-foreground">
            Individual referral journeys, qualification, rewards, and payouts.
          </p>
        </div>
        {onViewAll && (
          <button
            onClick={onViewAll}
            className="flex items-center gap-1 text-xs font-semibold text-primary"
          >
            View All Referral Activity <ArrowRight className="size-3" />
          </button>
        )}
      </div>
      <Table className="text-[10px]">
        <TableHeader className="bg-muted/40">
          <TableRow>
            {[
              "Ref-ID",
              "Referrer",
              "Type",
              "Referred User",
              "Referral Status",
              "Reward Status",
              "Payout",
              "Date",
            ].map((label) => (
              <TableHead
                key={label}
                className="h-8 text-[9px] font-semibold uppercase text-muted-foreground last:text-right"
              >
                {label}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const referrer = referrers.find(
              (item) => item.id === row.referrerId,
            );
            return (
              <TableRow key={row.id} className="h-10">
                <TableCell className="font-medium text-muted-foreground">
                  {row.id}
                </TableCell>
                <TableCell className="font-semibold">
                  {referrer?.name ?? "—"}
                </TableCell>
                <TableCell>
                  {referrer && <ReferralTag label={referrer.type} />}
                </TableCell>
                <TableCell>{row.referredUser}</TableCell>
                <TableCell>
                  <ReferralTag label={row.status} />
                </TableCell>
                <TableCell>
                  {row.rewardStatus ? (
                    <span className="flex items-center gap-1">
                      <ReferralTag label={row.rewardStatus} />
                      {row.rewardStatus === "Approved" && (
                        <span className="text-success">
                          (₦{row.rewardAmount.toLocaleString()})
                        </span>
                      )}
                    </span>
                  ) : (
                    <span className="text-muted-foreground">
                      {row.status === "Registered" ? "— (Not Qualified)" : "—"}
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {row.payout ? <ReferralTag label={row.payout} /> : "—"}
                </TableCell>
                <TableCell className="text-right text-muted-foreground">
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
              </TableRow>
            );
          })}
          {rows.length === 0 && (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-10 text-center text-muted-foreground"
              >
                No referrals match your filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </section>
  );
}
