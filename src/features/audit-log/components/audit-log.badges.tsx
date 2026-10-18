import { AUDIT_ACTION_LABELS } from "../data/audit-log.data";

export function AuditActionBadge({ action }: { action: string }) {
  const config = AUDIT_ACTION_LABELS[action];
  const tone =
    config?.tone === "success"
      ? "bg-success/10 text-success"
      : config?.tone === "danger"
        ? "bg-destructive/10 text-destructive"
        : config?.tone === "primary"
          ? "bg-primary/10 text-primary"
          : "bg-muted text-muted-foreground";
  return (
    <span
      className={`inline-flex max-w-full items-center gap-1.5 rounded-full px-2 py-1 text-[10px] font-semibold ${tone}`}
    >
      <span className="size-1.5 shrink-0 rounded-full bg-current" />
      {config?.label ?? action}
    </span>
  );
}
