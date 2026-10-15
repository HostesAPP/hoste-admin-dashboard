import type { ReferralPayoutStatus } from "../payouts.types";

export function PayoutStatusBadge({
  status,
  dot = false,
}: {
  status: ReferralPayoutStatus;
  dot?: boolean;
}) {
  const tone =
    status === "Paid"
      ? "bg-success/10 text-success"
      : status === "Processing"
        ? "bg-primary/10 text-primary"
        : "bg-muted/60 text-muted-foreground";
  return (
    <span
      className={`inline-flex items-center gap-1 rounded-full px-3 py-0.5 text-[10px] font-semibold ${tone}`}
    >
      {dot && <span className="size-1 rounded-full bg-current" />}
      {status}
    </span>
  );
}
