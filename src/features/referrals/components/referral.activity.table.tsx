import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
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
  ActivityPromoter,
  ActivityReferral,
} from "../referrals.activity.types";

export function ActivityStatus({
  status,
  dot = false,
}: {
  status: string;
  dot?: boolean;
}) {
  const tone = ["Paid", "Qualified"].includes(status)
    ? "bg-success/10 text-success"
    : ["Flagged", "Rejected"].includes(status)
      ? "bg-destructive/10 text-destructive"
      : "bg-primary/10 text-primary";
  return (
    <span
      className={`inline-flex min-w-16 items-center justify-center gap-1 rounded-full px-2 py-1 text-[9px] font-semibold ${tone}`}
    >
      {dot && <span className="size-1.5 rounded-full bg-current" />}
      {status}
    </span>
  );
}

export function ReferralActivityTable({
  rows,
  promoters,
  selected,
  onToggle,
  onSelectPage,
  onView,
}: {
  rows: ActivityReferral[];
  promoters: ActivityPromoter[];
  selected: string[];
  onToggle: (id: string) => void;
  onSelectPage: (checked: boolean) => void;
  onView: (row: ActivityReferral) => void;
}) {
  const selectedOnPage = rows.filter((row) => selected.includes(row.id)).length;
  return (
    <Table className="table-fixed text-[10px]">
      <TableHeader className="bg-muted/30">
        <TableRow>
          <TableHead className="w-9">
            <Checkbox
              aria-label="Select all referrals on this page"
              checked={rows.length > 0 && selectedOnPage === rows.length}
              disabled={rows.length === 0}
              ref={(node) => {
                if (node)
                  node.indeterminate =
                    selectedOnPage > 0 && selectedOnPage < rows.length;
              }}
              onCheckedChange={onSelectPage}
            />
          </TableHead>
          {[
            ["Referral ID", "w-24"],
            ["Referrer", "w-[17%]"],
            ["Type", "w-20"],
            ["Code", "w-[12%]"],
            ["Referred User", "w-[16%]"],
            ["Qualification", "w-24"],
            ["Reward", "w-16"],
            ["Payout", "w-20"],
            ["Action", "w-16"],
          ].map(([label, width]) => (
            <TableHead
              key={label}
              className={`${width} h-9 text-[9px] font-semibold uppercase text-muted-foreground`}
            >
              {label}
            </TableHead>
          ))}
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map((row) => {
          const promoter = promoters.find((item) => item.id === row.referrerId);
          const isSelected = selected.includes(row.id);
          const flagged = row.qualification === "Flagged";
          return (
            <TableRow
              key={row.id}
              className={`h-[62px] ${flagged ? "bg-destructive/5 hover:bg-destructive/10" : isSelected ? "bg-primary/5 hover:bg-primary/10" : "hover:bg-muted/20"}`}
            >
              <TableCell
                className={
                  isSelected
                    ? "border-l-[3px] border-l-primary"
                    : "border-l-[3px] border-l-transparent"
                }
              >
                <Checkbox
                  aria-label={`Select ${row.id}`}
                  checked={isSelected}
                  onCheckedChange={() => onToggle(row.id)}
                />
              </TableCell>
              <TableCell
                className={`font-semibold ${flagged ? "text-destructive" : isSelected ? "text-primary" : ""}`}
              >
                {row.id}
              </TableCell>
              <TableCell>
                <div className="flex min-w-0 items-center gap-2">
                  <Avatar className="size-7 shrink-0">
                    <AvatarFallback
                      className={`text-[9px] font-semibold ${flagged ? "bg-destructive/15 text-destructive" : "bg-muted text-muted-foreground"}`}
                    >
                      {promoter?.name
                        .split(" ")
                        .slice(0, 2)
                        .map((part) => part[0])
                        .join("")}
                    </AvatarFallback>
                  </Avatar>
                  <div className="min-w-0">
                    <p
                      className="truncate font-semibold"
                      title={promoter?.name}
                    >
                      {promoter?.name ?? "—"}
                    </p>
                    <p
                      title={promoter?.flagReason ?? promoter?.email}
                      className={`truncate text-[9px] ${flagged ? "text-destructive" : "text-muted-foreground"}`}
                    >
                      {promoter?.flagReason ?? promoter?.email}
                    </p>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <span
                  className={`rounded-full border border-border px-2 py-0.5 text-[9px] ${promoter?.type === "Brand" ? "border-primary/10 bg-primary/5 text-primary" : "bg-muted/20 text-muted-foreground"}`}
                >
                  {promoter?.type ?? "—"}
                </span>
              </TableCell>
              <TableCell
                className="truncate font-medium"
                title={promoter?.code}
              >
                {promoter?.code ?? "—"}
              </TableCell>
              <TableCell>
                <p className="truncate font-semibold" title={row.referredUser}>
                  {row.referredUser}
                </p>
                <p className="mt-0.5 text-[9px] text-muted-foreground">
                  {row.referredRole} ·{" "}
                  {new Date(`${row.date}T00:00:00Z`).toLocaleDateString(
                    "en-GB",
                    {
                      day: "numeric",
                      month: "short",
                      year: "numeric",
                      timeZone: "UTC",
                    },
                  )}
                </p>
              </TableCell>
              <TableCell>
                <ActivityStatus
                  status={row.qualification}
                  dot={row.qualification !== "Flagged"}
                />
              </TableCell>
              <TableCell className="font-semibold text-success">
                {row.rewardAmount === null ? (
                  <span className="font-normal text-muted-foreground">—</span>
                ) : (
                  `₦${row.rewardAmount.toLocaleString()}`
                )}
              </TableCell>
              <TableCell>
                {row.payout ? (
                  <ActivityStatus status={row.payout} />
                ) : (
                  <span className="text-muted-foreground">—</span>
                )}
              </TableCell>
              <TableCell>
                <Button
                  size="xs"
                  variant={isSelected ? "default" : "outline"}
                  onClick={() => onView(row)}
                  aria-label={`View ${row.id}`}
                  className="text-[10px]"
                >
                  View
                </Button>
              </TableCell>
            </TableRow>
          );
        })}
        {rows.length === 0 && (
          <TableRow>
            <TableCell
              colSpan={10}
              className="py-16 text-center text-xs text-muted-foreground"
            >
              No referrals match your filters.
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
}

export function ReferralActivityDetails({
  referral,
  promoter,
  onClose,
}: {
  referral: ActivityReferral | null;
  promoter?: ActivityPromoter;
  onClose: () => void;
}) {
  return (
    <Dialog
      open={referral !== null}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Referral Details</DialogTitle>
          <DialogDescription>{referral?.id}</DialogDescription>
        </DialogHeader>
        {referral && (
          <dl className="space-y-3 text-xs">
            {[
              ["Referrer", promoter?.name],
              ["Email", promoter?.email || "—"],
              ["Type", promoter?.type],
              ["Referral code", promoter?.code],
              ["Referred user", referral.referredUser],
              ["User type", referral.referredRole],
              ["Registered", referral.date],
              ["Qualification", referral.qualification],
              [
                "Reward",
                referral.rewardAmount === null
                  ? "—"
                  : `₦${referral.rewardAmount.toLocaleString()}`,
              ],
              ["Payout", referral.payout ?? "—"],
              ...(promoter?.flagReason
                ? [["Flag reason", promoter.flagReason]]
                : []),
            ].map(([label, value]) => (
              <div
                key={label}
                className="flex justify-between gap-4 border-b border-border pb-2"
              >
                <dt className="text-muted-foreground">{label}</dt>
                <dd className="text-right font-medium">{value ?? "—"}</dd>
              </div>
            ))}
          </dl>
        )}
      </DialogContent>
    </Dialog>
  );
}
