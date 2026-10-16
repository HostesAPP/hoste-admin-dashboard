"use client";
import Link from "next/link";
import { useState } from "react";
import {
  Banknote,
  ChevronLeft,
  ChevronRight,
  CreditCard,
  Eye,
  EyeOff,
  Loader2,
  RefreshCw,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { PaymentTransaction } from "../types/transactions.types";

export const PAYMENT_METHOD_LABELS = {
  CREDIT_CARD: "Credit Card",
  BANK_TRANSFER: "Bank Transfer",
  PAYPAL: "PayPal",
};
export const formatPaymentAmount = (amount: number) =>
  new Intl.NumberFormat("en-NG", {
    style: "currency",
    currency: "NGN",
    minimumFractionDigits: 2,
  }).format(amount);
export function PaymentTable({
  transactions,
  total,
  page,
  pageSize = 7,
  onPageChange,
  onRetry,
  retryingId,
  loading = false,
  error,
  onReload,
}: {
  transactions: PaymentTransaction[];
  total: number;
  page: number;
  pageSize?: number;
  onPageChange: (page: number) => void;
  onRetry: (id: string) => Promise<void>;
  retryingId?: string | null;
  loading?: boolean;
  error?: string;
  onReload?: () => void;
}) {
  const [hiddenRows, setHiddenRows] = useState<Set<string>>(() => new Set());
  const toggleRow = (id: string) => {
    setHiddenRows((previous) => {
      const next = new Set(previous);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };
  const pages = Math.max(1, Math.ceil(total / pageSize));
  return (
    <div className="mt-5 overflow-hidden rounded-lg border border-border bg-card">
      <Table className="table-fixed text-xs [&_td]:whitespace-normal [&_th]:whitespace-normal">
        <TableHeader className="bg-muted/40">
          <TableRow>
            {[
              ["Transaction ID", "w-[14%]"],
              ["Customer", "w-[17%]"],
              ["Booking ID", "w-[11%]"],
              ["Amount", "w-[12%]"],
              ["Payment Method", "w-[13%]"],
              ["Status", "w-[9%]"],
              ["Date", "w-[11%]"],
              ["Actions", "w-[13%]"],
            ].map(([title, width]) => (
              <TableHead
                key={title}
                className={`${width} px-3 text-[10px] font-semibold uppercase text-muted-foreground ${title === "Actions" ? "text-right" : ""}`}
              >
                {title}
              </TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {loading ? (
            Array.from({ length: 7 }, (_, index) => (
              <TableRow key={index}>
                <TableCell colSpan={8}>
                  <div
                    role="status"
                    aria-label="Loading transactions"
                    className="h-8 animate-pulse rounded bg-muted"
                  />
                </TableCell>
              </TableRow>
            ))
          ) : error ? (
            <TableRow>
              <TableCell colSpan={8} className="py-10 text-center">
                <p role="alert" className="mb-3 text-destructive">
                  {error}
                </p>
                {onReload && (
                  <Button variant="outline" size="sm" onClick={onReload}>
                    Try Again
                  </Button>
                )}
              </TableCell>
            </TableRow>
          ) : !transactions.length ? (
            <TableRow>
              <TableCell
                colSpan={8}
                className="py-12 text-center text-muted-foreground"
              >
                No transactions match your filters.
              </TableCell>
            </TableRow>
          ) : (
            transactions.map(
              ({
                payment,
                customerEmail,
                bookingReference,
                method,
                canRefund,
                canRetry,
              }) => {
                const hidden = hiddenRows.has(payment.id);
                return (
                <TableRow
                  key={payment.id}
                  className="h-[68px] hover:bg-muted/30"
                >
                  <TableCell className="px-3 font-semibold text-primary">
                    {hidden ? "****" : (
                    <Link
                      href={`/payments/${payment.id}`}
                      className="break-all hover:underline"
                    >
                      {payment.referenceId}
                    </Link>
                    )}
                  </TableCell>
                  <TableCell className="px-3">
                    {hidden ? "****" : <>
                    <p className="break-words font-semibold">
                      {payment.payerProfileName}
                    </p>
                    <p title={customerEmail ?? undefined} className="mt-1 truncate text-[10px] text-muted-foreground">
                      {customerEmail ?? "—"}
                    </p>
                    </>}
                  </TableCell>
                  <TableCell className="break-all px-3 text-muted-foreground">
                    {hidden ? "****" : bookingReference ?? "—"}
                  </TableCell>
                  <TableCell className="px-3 font-semibold">
                    {hidden ? "****" : formatPaymentAmount(payment.grossAmount)}
                  </TableCell>
                  <TableCell className="px-3 text-muted-foreground">
                    {hidden ? "****" : (
                    <span className="inline-flex items-center gap-1.5">
                      {method === "BANK_TRANSFER" ? (
                        <Banknote className="size-3.5 shrink-0" />
                      ) : (
                        <CreditCard className="size-3.5 shrink-0" />
                      )}
                      {PAYMENT_METHOD_LABELS[method]}
                    </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3">
                    {hidden ? "****" : (
                    <span
                      className={`inline-block rounded-full px-2 py-1 text-[10px] font-semibold ${payment.status === "Successful" ? "bg-secondary/10 text-secondary" : payment.status === "Pending" ? "bg-yellow/15 text-warning" : payment.status === "Failed" ? "bg-destructive/10 text-destructive" : "bg-muted text-muted-foreground"}`}
                    >
                      {payment.status}
                    </span>
                    )}
                  </TableCell>
                  <TableCell className="px-3 text-[11px] text-muted-foreground">
                    {hidden ? "****" : new Date(payment.createdAt).toLocaleDateString("en-US", {
                      month: "short",
                      day: "numeric",
                      year: "numeric",
                      timeZone: "UTC",
                    })}
                  </TableCell>
                  <TableCell className="px-2">
                    <div className="flex justify-end gap-1">
                      <Button
                        size="icon"
                        variant="ghost"
                        className="size-6"
                        aria-label={hidden ? "Show transaction row" : `Hide transaction row ${payment.referenceId}`}
                        aria-pressed={hidden}
                        title={hidden ? "Show transaction row" : "Hide transaction row"}
                        onClick={() => toggleRow(payment.id)}
                      >
                        {hidden ? <EyeOff className="size-3" /> : <Eye className="size-3" />}
                      </Button>
                      <span
                        className={hidden ? "invisible" : undefined}
                        title={canRetry ? "Retry payment" : "Retry unavailable"}
                      >
                        <Button
                          size="icon"
                          variant="ghost"
                          className="size-6"
                          aria-label={`Retry ${payment.referenceId}`}
                          disabled={!canRetry || !!retryingId}
                          onClick={() => void onRetry(payment.id)}
                        >
                          {retryingId === payment.id ? (
                            <Loader2 className="size-3 animate-spin" />
                          ) : (
                            <RefreshCw className="size-3" />
                          )}
                        </Button>
                      </span>
                      {canRefund ? (
                        <Button
                          variant="outline"
                          size="sm"
                          className="h-6 px-2 text-[10px] text-primary border-primary/50 hover:bg-primary/5"
                          nativeButton={false}
                          render={
                            <Link href={`/payments/${payment.id}/refund`} />
                          }
                        >
                          Refund
                        </Button>
                      ) : (
                        <span title="This payment is not eligible for a refund">
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-[10px]"
                            disabled
                          >
                            Refund
                          </Button>
                        </span>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
                );
              },
            )
          )}
        </TableBody>
      </Table>
      <footer className="flex items-center justify-between border-t border-border px-4 py-3">
        <p className="text-[11px] text-muted-foreground">
          Showing{" "}
          {total
            ? `${(page - 1) * pageSize + 1}–${Math.min(page * pageSize, total)}`
            : "0"}{" "}
          of {total} transactions
        </p>
        <nav
          aria-label="Transaction pagination"
          className="flex items-center gap-1"
        >
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            aria-label="Previous page"
            disabled={page <= 1 || loading}
            onClick={() => onPageChange(page - 1)}
          >
            <ChevronLeft className="size-3.5" />
          </Button>
          {Array.from({ length: pages }, (_, index) => index + 1)
            .filter(
              (value) =>
                value === 1 || value === pages || Math.abs(value - page) <= 1,
            )
            .map((value, index, visible) => (
              <span key={value} className="flex items-center gap-1">
                {index > 0 && value - visible[index - 1] > 1 && (
                  <span className="px-1 text-muted-foreground">...</span>
                )}
                <Button
                  variant={page === value ? "default" : "ghost"}
                  size="icon"
                  className="size-7 text-xs"
                  aria-label={`Page ${value}`}
                  aria-current={page === value ? "page" : undefined}
                  disabled={loading}
                  onClick={() => onPageChange(value)}
                >
                  {value}
                </Button>
              </span>
            ))}
          <Button
            variant="outline"
            size="icon"
            className="size-7"
            aria-label="Next page"
            disabled={page >= pages || loading}
            onClick={() => onPageChange(page + 1)}
          >
            <ChevronRight className="size-3.5" />
          </Button>
        </nav>
      </footer>
    </div>
  );
}
