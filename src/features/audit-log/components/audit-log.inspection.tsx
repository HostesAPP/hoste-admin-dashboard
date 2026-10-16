"use client";

import { ArrowRight, LockKeyhole } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import type { AuditLogItem } from "../types/auditLog.types";
import type { AuditLogInspection as Inspection } from "../types/audit-log.types";
import {
  AUDIT_ENTITY_LABELS,
  AUDIT_STAFF_LABELS,
} from "../data/audit-log.data";
import { AuditActionBadge } from "./audit-log.badges";
import { formatAuditInspectionTimestamp } from "../audit-log.utils";

const LABEL_CLASS =
  "mb-2 text-[10px] font-semibold uppercase text-muted-foreground";

export function AuditLogInspection({
  record,
  inspection,
  onClose,
}: {
  record: AuditLogItem | null;
  inspection?: Inspection;
  onClose: () => void;
}) {
  const staff = record
    ? (AUDIT_STAFF_LABELS[record.staffProfileId] ?? record.staffProfileId)
    : "";
  const subject = inspection?.subject;
  const initials =
    inspection?.staffName
      ?.split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0])
      .join("")
      .toUpperCase() || "S";
  return (
    <Dialog
      open={!!record}
      onOpenChange={(open) => {
        if (!open) onClose();
      }}
    >
      <DialogContent
        className="inset-y-0 right-0 left-auto top-0 flex h-dvh w-[480px] max-w-[480px] translate-x-0 translate-y-0 flex-col gap-0 rounded-none p-0 sm:max-w-[480px]"
        aria-describedby="audit-inspection-description"
      >
        <DialogHeader className="shrink-0 border-b border-border bg-muted/20 px-6 py-5 pr-14">
          <p className="text-[9px] font-semibold uppercase text-muted-foreground">
            Audit Record Inspection
          </p>
          <DialogTitle className="text-lg font-bold">
            Log Record #{record?.id}
          </DialogTitle>
          <DialogDescription
            id="audit-inspection-description"
            className="sr-only"
          >
            Read-only inspection of the selected administrative audit record.
          </DialogDescription>
        </DialogHeader>
        {record && (
          <>
            <div className="flex-1 space-y-5 overflow-y-auto px-6 py-4 text-xs tracking-normal">
              <div className="flex items-start gap-2 rounded-md border border-primary/50 bg-yellow/10 px-3 py-2.5">
                <LockKeyhole className="mt-0.5 size-3.5 shrink-0 text-warning" />
                <div>
                  <p className="text-[11px] font-semibold">
                    Immutable Administrative Record
                  </p>
                  <p className="mt-1 text-[10px] text-muted-foreground">
                    Audit records cannot be modified or deleted by any admin
                    role.
                  </p>
                </div>
              </div>
              <section className="border-b border-border pb-4">
                <h2 className={LABEL_CLASS}>Recorded Timestamp</h2>
                <p className="text-xs font-semibold">
                  {formatAuditInspectionTimestamp(record.timestamp)}
                </p>
                <p className="mt-1 text-[10px] text-muted-foreground">
                  Unix Timestamp:{" "}
                  {Math.floor(Date.parse(record.timestamp) / 1000)}
                </p>
              </section>
              <section>
                <h2 className={LABEL_CLASS}>Performed By (Staff User)</h2>
                <div className="inline-flex max-w-full items-center gap-3 rounded-lg border border-border bg-muted/20 p-3">
                  <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-foreground text-[10px] font-bold text-background">
                    {initials}
                  </span>
                  <div className="min-w-0">
                    <p className="break-words text-[11px] font-semibold">
                      {staff}
                      {inspection?.staffName
                        ? ` (${inspection.staffName})`
                        : ""}
                    </p>
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      {inspection?.staffRole || "Role not recorded"}
                    </p>
                  </div>
                </div>
              </section>
              <div className="grid grid-cols-2 gap-5 border-b border-border pb-5">
                <section>
                  <h2 className={LABEL_CLASS}>Action Performed</h2>
                  <AuditActionBadge action={record.action} />
                </section>
                <section>
                  <h2 className={LABEL_CLASS}>Target Entity</h2>
                  <p className="break-words text-xs font-semibold">
                    {AUDIT_ENTITY_LABELS[record.entityType] ??
                      record.entityType}{" "}
                    <span className="text-primary">{record.entityId}</span>
                  </p>
                </section>
              </div>
              <section>
                <h2 className={LABEL_CLASS}>Affected Subject Data</h2>
                <div className="space-y-2 rounded-lg border border-border bg-muted/20 p-3">
                  <p className="break-words text-[11px] font-semibold">
                    {subject?.name ||
                      `${AUDIT_ENTITY_LABELS[record.entityType] ?? record.entityType}: ${record.entityId}`}
                  </p>
                  <p className="text-[10px] text-muted-foreground">
                    Category: {subject?.category || "Not recorded"} · Location:{" "}
                    {subject?.location || "Not recorded"}
                  </p>
                  <p className="flex flex-wrap items-center gap-1 text-[10px] text-muted-foreground">
                    Previous Status: {subject?.previousStatus || "Not recorded"}
                    <ArrowRight className="size-3" />
                    <span className="font-semibold text-foreground">
                      {subject?.currentStatus || "Not recorded"}
                    </span>
                  </p>
                </div>
              </section>
              <section>
                <h2 className={LABEL_CLASS}>Administrative Reason Provided</h2>
                <blockquote className="whitespace-pre-wrap break-words rounded-lg border border-border bg-muted/20 p-3 text-[11px] leading-5 text-muted-foreground">
                  {record.description || "No administrative reason recorded."}
                </blockquote>
              </section>
              <section>
                <h2 className={LABEL_CLASS}>System Audit Metadata</h2>
                <dl className="space-y-1.5 text-[10px] leading-4">
                  {[
                    ["Client IP Hash", inspection?.clientIpHash],
                    ["Session ID", inspection?.sessionId],
                    ["Origin Route", inspection?.originRoute],
                    ["Client IP", record.ip],
                    ["Staff Profile ID", record.staffProfileId],
                    ["Staff User ID", record.staffUserId],
                  ].map(([label, value]) => (
                    <div key={label} className="flex gap-1">
                      <dt className="shrink-0 text-muted-foreground">
                        {label}:
                      </dt>
                      <dd className="min-w-0 break-all">
                        {value || "Not recorded"}
                      </dd>
                    </div>
                  ))}
                </dl>
              </section>
            </div>
            <footer className="shrink-0 bg-card px-6 pb-7 pt-5">
              <DialogClose render={<Button className="h-10 w-full text-xs" />}>
                Close Inspection Drawer
              </DialogClose>
            </footer>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
