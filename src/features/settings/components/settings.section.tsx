import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function SettingsSection({
  title,
  action,
  children,
  id,
  banded = false,
}: {
  title: string;
  action?: ReactNode;
  children: ReactNode;
  id?: string;
  banded?: boolean;
}) {
  return (
    <section
      id={id}
      className={cn(
        "border border-border bg-card",
        banded ? "overflow-hidden rounded-lg" : "p-5",
      )}
    >
      <div
        className={cn(
          "flex items-center justify-between gap-3",
          banded ? "border-b border-border bg-muted/30 px-5 py-4" : "mb-4",
        )}
      >
        <h2 className="text-sm font-semibold">{title}</h2>
        {action}
      </div>
      {banded ? <div className="p-5">{children}</div> : children}
    </section>
  );
}
