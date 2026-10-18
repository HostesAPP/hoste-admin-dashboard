"use client";

import { useState } from "react";
import Link from "next/link";
import {
  ArrowRight,
  CalendarDays,
  ChevronLeft,
  ChevronRight,
  Download,
  Layers,
  Search,
  UserRound,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
} from "@/components/ui/pagination";
import { SettingsHeader } from "@/features/settings/components/SettingsHeader";
import { SettingsNativeSelect } from "@/features/settings/components/SettingsNativeSelect";
import type { AuditLogItem } from "../types/auditLog.types";
import type {
  AuditLogFilters,
  AuditLogSnapshot,
} from "../types/audit-log.types";
import {
  AUDIT_ACTION_LABELS,
  AUDIT_ENTITY_LABELS,
  AUDIT_STAFF_LABELS,
} from "../data/audit-log.data";
import {
  AUDIT_FILTER_DEFAULTS,
  auditCsv,
  filterAuditLogs,
  formatAuditDate,
  formatAuditTime,
} from "../audit-log.utils";

import { AuditActionBadge } from "./audit-log.badges";
import { AuditLogInspection } from "./audit-log.inspection";

export function AuditLogPage({ snapshot }: { snapshot: AuditLogSnapshot }) {
  const [filters, setFilters] = useState<AuditLogFilters>(
    AUDIT_FILTER_DEFAULTS,
  );
  const [page, setPage] = useState(1);
  const [size, setSize] = useState(10);
  const [selected, setSelected] = useState<AuditLogItem | null>(null);
  const [exported, setExported] = useState(false);
  const changeFilters = (changes: Partial<AuditLogFilters>) => {
    setFilters((previous) => ({ ...previous, ...changes }));
    setPage(1);
    setExported(false);
  };
  const records = filterAuditLogs(
    snapshot.records,
    filters,
    snapshot.periodEnd,
  );
  const pages = Math.max(1, Math.ceil(records.length / size));
  const currentPage = Math.min(page, pages);
  const offset = (currentPage - 1) * size;
  const pageNumbers = [
    ...new Set([1, currentPage - 1, currentPage, currentPage + 1, pages]),
  ]
    .filter((value) => value >= 1 && value <= pages)
    .sort((a, b) => a - b);
  const exportLogs = () => {
    const url = URL.createObjectURL(
      new Blob([auditCsv(records)], { type: "text/csv;charset=utf-8;" }),
    );
    const anchor = document.createElement("a");
    anchor.href = url;
    anchor.download = "hoste-audit-log.csv";
    document.body.appendChild(anchor);
    anchor.click();
    anchor.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    setExported(true);
  };
  const metrics = [
    {
      label: "Total Recorded Actions",
      value: snapshot.summary.total.toLocaleString(),
      badge: "All time",
      tone: "bg-muted text-muted-foreground",
    },
    {
      label: "Today's Actions",
      value: snapshot.summary.today.toLocaleString(),
      badge: "Normal",
      tone: "bg-success/10 text-success",
    },
    {
      label: "Active Staff Today",
      value: `${snapshot.summary.activeStaff} Admins`,
      badge: "Active",
      tone: "border border-primary/40 bg-yellow/10 text-foreground",
    },
    {
      label: "High-Impact Mutations",
      value: `${snapshot.summary.highImpact} Flagged`,
      badge: "Review",
      tone: "bg-destructive/5 text-destructive",
    },
  ];
  return (
    <div className="min-w-[1024px] tracking-normal">
      <SettingsHeader
        search={filters.search}
        onSearch={(search) => changeFilters({ search })}
      />
      <header className="flex items-center justify-between gap-5 border-b border-border bg-card px-7 py-5">
        <div>
          <nav
            aria-label="Breadcrumb"
            className="mb-1 flex items-center gap-1.5 text-[10px] text-muted-foreground"
          >
            <Link href="/" className="hover:text-primary">
              Dashboard
            </Link>
            <span>/</span>
            <Link href="/settings/security" className="hover:text-primary">
              System &amp; Security
            </Link>
            <span>/</span>
            <span className="font-semibold text-primary">Audit Log</span>
          </nav>
          <h1 className="text-2xl font-bold">Audit Log</h1>
          <p className="mt-1 text-xs text-muted-foreground">
            Track administrative actions and changes across the Hosté platform.
          </p>
        </div>
        <div className="flex shrink-0 items-center gap-3 rounded-lg border border-border bg-muted/20 px-4 py-3 text-[10px]">
          <span className="size-2 rounded-full bg-success" />
          <span>
            System Audit Status:{" "}
            <strong className="text-success">IMMUTABLE</strong>
          </span>
          <span className="border-l border-border pl-3 text-muted-foreground">
            {new Date(`${snapshot.periodEnd}T00:00:00Z`).toLocaleDateString(
              "en-GB",
              {
                day: "numeric",
                month: "short",
                year: "numeric",
                timeZone: "UTC",
              },
            )}{" "}
            WAT
          </span>
        </div>
      </header>
      <main className="mx-auto max-w-[1600px] space-y-5 px-6 py-6">
        <div className="grid grid-cols-4 gap-4">
          {metrics.map((metric) => (
            <article
              key={metric.label}
              className="relative rounded-lg border border-border bg-card px-5 py-5"
            >
              <h2 className="pr-14 text-[10px] font-semibold uppercase text-muted-foreground">
                {metric.label}
              </h2>
              <p className="mt-2 text-2xl font-bold">{metric.value}</p>
              <span
                className={`absolute right-4 top-5 rounded-full px-2 py-1 text-[9px] font-semibold ${metric.tone}`}
              >
                {metric.badge}
              </span>
            </article>
          ))}
        </div>
        <section
          aria-label="Audit log filters"
          className="grid grid-cols-[minmax(170px,2fr)_repeat(4,minmax(140px,1fr))_auto_auto] items-center gap-2 rounded-lg border border-border bg-card p-4"
        >
          <div className="relative">
            <Search
              aria-hidden="true"
              className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
            />
            <Input
              aria-label="Search audit logs"
              placeholder="Search by staff ID, action, entity ID..."
              value={filters.search}
              onChange={(event) =>
                changeFilters({ search: event.target.value })
              }
              className="h-9 bg-muted/20 pl-9 text-[11px]"
            />
          </div>
          <SettingsNativeSelect
            aria-label="Audit date range"
            leadingIcon={<CalendarDays className="text-muted-foreground" />}
            value={filters.range}
            onChange={(event) =>
              changeFilters({
                range: event.target.value as AuditLogFilters["range"],
              })
            }
            className="h-9 text-[11px]"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="ALL">All time</option>
          </SettingsNativeSelect>
          <SettingsNativeSelect
            aria-label="Staff member"
            leadingIcon={<UserRound className="text-muted-foreground" />}
            value={filters.staff}
            onChange={(event) => changeFilters({ staff: event.target.value })}
            className="h-9 text-[11px]"
          >
            <option value="ALL">Staff Member</option>
            {[
              ...new Set(
                snapshot.records.map((record) => record.staffProfileId),
              ),
            ].map((staff) => (
              <option key={staff} value={staff}>
                {AUDIT_STAFF_LABELS[staff] ?? staff}
              </option>
            ))}
          </SettingsNativeSelect>
          <SettingsNativeSelect
            aria-label="Audit action"
            leadingIcon={<Zap className="text-yellow" />}
            value={filters.action}
            onChange={(event) => changeFilters({ action: event.target.value })}
            className="h-9 text-[11px]"
          >
            <option value="ALL">All Actions</option>
            {[...new Set(snapshot.records.map((record) => record.action))].map(
              (action) => (
                <option key={action} value={action}>
                  {AUDIT_ACTION_LABELS[action]?.label ?? action}
                </option>
              ),
            )}
          </SettingsNativeSelect>
          <SettingsNativeSelect
            aria-label="Entity type"
            leadingIcon={<Layers className="text-muted-foreground" />}
            value={filters.entity}
            onChange={(event) => changeFilters({ entity: event.target.value })}
            className="h-9 text-[11px]"
          >
            <option value="ALL">Entity Type</option>
            {[
              ...new Set(snapshot.records.map((record) => record.entityType)),
            ].map((entity) => (
              <option key={entity} value={entity}>
                {AUDIT_ENTITY_LABELS[entity] ?? entity}
              </option>
            ))}
          </SettingsNativeSelect>
          <Button
            variant="link"
            size="sm"
            className="px-1 text-[10px]"
            onClick={() => changeFilters(AUDIT_FILTER_DEFAULTS)}
          >
            Clear Filters
          </Button>
          <Button
            className="h-9 text-[10px]"
            disabled={!records.length}
            onClick={exportLogs}
          >
            <Download className="size-3.5" />
            Export
          </Button>
        </section>
        {exported && (
          <p role="status" className="text-xs text-success">
            Filtered audit log exported.
          </p>
        )}
        <section
          aria-label="Administrative audit records"
          className="overflow-hidden rounded-lg border border-border bg-card"
        >
          <Table className="table-fixed text-[11px] [&_td]:whitespace-normal [&_th]:whitespace-normal">
            <TableHeader className="bg-muted/30">
              <TableRow>
                {[
                  ["Timestamp", "w-[16%]"],
                  ["Staff User", "w-[12%]"],
                  ["Action", "w-[16%]"],
                  ["Entity Type", "w-[11%]"],
                  ["Entity ID", "w-[11%]"],
                  ["Reason / Notes", "w-[25%]"],
                  ["View", "w-[9%]"],
                ].map(([label, width]) => (
                  <TableHead
                    key={label}
                    className={`${width} h-11 px-4 text-[9px] font-semibold uppercase text-muted-foreground`}
                  >
                    {label}
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {records.slice(offset, offset + size).map((record, index) => (
                <TableRow
                  key={record.id}
                  className={`h-[72px] ${selected?.id === record.id || (!selected && index === 0) ? "bg-yellow/5 hover:bg-yellow/10" : "hover:bg-muted/20"}`}
                >
                  <TableCell className="px-4">
                    <p>{formatAuditDate(record.timestamp)}</p>
                    <p className="mt-1 text-[9px] text-muted-foreground">
                      {formatAuditTime(record.timestamp)}
                    </p>
                  </TableCell>
                  <TableCell className="px-4">
                    <span
                      title={record.staffProfileId}
                      className="inline-block rounded bg-muted px-2 py-1 font-semibold"
                    >
                      {AUDIT_STAFF_LABELS[record.staffProfileId] ??
                        record.staffProfileId}
                    </span>
                  </TableCell>
                  <TableCell className="px-3">
                    <AuditActionBadge action={record.action} />
                  </TableCell>
                  <TableCell className="px-4">
                    {AUDIT_ENTITY_LABELS[record.entityType] ??
                      record.entityType}
                  </TableCell>
                  <TableCell className="break-all px-4 font-semibold text-primary">
                    {record.entityId}
                  </TableCell>
                  <TableCell className="px-4 text-muted-foreground">
                    <p className="line-clamp-2" title={record.description}>
                      {record.description || "—"}
                    </p>
                  </TableCell>
                  <TableCell className="px-2">
                    <Button
                      size="xs"
                      variant="link"
                      className="gap-1 text-[10px]"
                      aria-label={`View audit details ${record.id}`}
                      onClick={() => setSelected(record)}
                    >
                      Details
                      <ArrowRight className="size-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
              {!records.length && (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-16 text-center text-muted-foreground"
                  >
                    {snapshot.records.length
                      ? "No audit records match your filters."
                      : "No administrative actions recorded yet."}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
          <footer className="flex items-center justify-between gap-5 border-t border-border px-5 py-3 text-[10px] text-muted-foreground">
            <p>
              Showing{" "}
              <strong className="text-foreground">
                {records.length ? offset + 1 : 0} to{" "}
                {Math.min(offset + size, records.length)}
              </strong>{" "}
              of{" "}
              <strong className="text-foreground">
                {records.length.toLocaleString()}
              </strong>{" "}
              administrative log records
            </p>
            <div className="flex items-center gap-5">
              <label className="flex items-center gap-2">
                Rows per page:
                <SettingsNativeSelect
                  aria-label="Audit rows per page"
                  value={size}
                  onChange={(event) => {
                    setSize(Number(event.target.value));
                    setPage(1);
                  }}
                  wrapperClassName="w-17"
                  className="h-7 text-[10px]"
                >
                  <option value="5">5</option>
                  <option value="10">10</option>
                  <option value="25">25</option>
                  <option value="50">50</option>
                </SettingsNativeSelect>
              </label>
              <Pagination className="w-auto" aria-label="Audit log pages">
                <PaginationContent>
                  <PaginationItem>
                    <Button
                      size="icon-xs"
                      variant="outline"
                      aria-label="Previous audit page"
                      disabled={currentPage <= 1}
                      onClick={() => setPage(currentPage - 1)}
                    >
                      <ChevronLeft className="size-3" />
                    </Button>
                  </PaginationItem>
                  {pageNumbers.map((number, index) => (
                    <PaginationItem
                      key={number}
                      className="flex items-center gap-1"
                    >
                      {index > 0 && number - pageNumbers[index - 1] > 1 && (
                        <PaginationEllipsis className="size-6" />
                      )}
                      <Button
                        size="icon-xs"
                        variant={number === currentPage ? "default" : "outline"}
                        className={
                          number === currentPage
                            ? "bg-foreground text-background hover:bg-foreground/90"
                            : ""
                        }
                        aria-label={`Audit page ${number}`}
                        aria-current={
                          number === currentPage ? "page" : undefined
                        }
                        onClick={() => setPage(number)}
                      >
                        {number}
                      </Button>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <Button
                      size="icon-xs"
                      variant="outline"
                      aria-label="Next audit page"
                      disabled={currentPage >= pages}
                      onClick={() => setPage(currentPage + 1)}
                    >
                      <ChevronRight className="size-3" />
                    </Button>
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          </footer>
        </section>
      </main>
      <AuditLogInspection
        record={selected}
        inspection={selected ? snapshot.inspections?.[selected.id] : undefined}
        onClose={() => setSelected(null)}
      />
    </div>
  );
}
