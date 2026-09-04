import { cn } from "@/lib/utils";

export function StatusBadge({ status }: { status: string }) {
  const statusStyles = {
    Active: "bg-success/15 text-success",
    Completed: "bg-success/15 text-success",
    Confirmed: "bg-success/15 text-success",
    Approved: "bg-success/15 text-success",

    Paused: "bg-warning/15 text-warning",
    Pending: "bg-warning/15 text-warning",

    Inactive: "bg-destructive/15 text-destructive",
    Suspended: "bg-destructive/15 text-destructive",
    Rejected: "bg-destructive/15 text-destructive",
  };

  return (
    <span
      className={cn(
        "inline-flex w-fit items-center rounded-full px-3 py-1 text-xs font-medium",
        statusStyles[status as keyof typeof statusStyles] ??
        "bg-muted text-muted-foreground"
      )}
    >
      {status}
    </span>
  );
}