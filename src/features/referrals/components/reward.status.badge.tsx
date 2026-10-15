import type { RewardStatus } from "../rewards.types";

export function RewardStatusBadge({ status }: { status: RewardStatus }) {
  const tone =
    status === "Pending Review"
      ? "bg-primary/10 text-primary"
      : status === "Rejected"
        ? "bg-destructive/10 text-destructive"
        : "bg-success/10 text-success";
  return (
    <span
      className={`inline-flex rounded px-2 py-0.5 text-[9px] font-semibold ${tone}`}
    >
      {status}
    </span>
  );
}
