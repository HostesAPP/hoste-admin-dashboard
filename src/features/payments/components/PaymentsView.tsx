"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import {
  CreditCard,
  DollarSign,
  TrendingUp,
  CircleCheckBig,
  Clock3,
  CircleAlert,
  Download,
  RefreshCw,
  Send,
  ShieldCheck,
  Lock,
  AlertCircle,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import {
  MOCK_PAYMENTS,
  MOCK_PAYOUTS,
  MOCK_REFUNDS,
} from "@/features/payments/data/payments.data";
import {
  PaymentItem,
  PayoutItem,
  RefundItem,
} from "@/features/payments/types/payments.types";
import { PaymentHeader } from "@/features/payments/components/PaymentHeader";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { PaymentFilter } from "./PaymentFilterBar";
import { PaymentTable } from "./PaymentTable";
import {
  mockTransactionsAdapter,
  type TransactionsAdapter,
} from "../transactions.adapter";
import type { PaymentFilterSchema } from "../schemas/payment.filter";
import {
  PaymentsEmptyState,
  PaymentsErrorState,
  PaymentsLoadingState,
} from "./payments.states";

export default function PaymentsView({
  transactionsAdapter = mockTransactionsAdapter,
}: {
  transactionsAdapter?: TransactionsAdapter;
}) {
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS);
  const [payouts, setPayouts] = useState<PayoutItem[]>(MOCK_PAYOUTS);
  const [refunds, setRefunds] = useState<RefundItem[]>(MOCK_REFUNDS);

  const [activeTab, setActiveTab] = useState<
    "PAYMENTS" | "PAYOUTS" | "REFUNDS"
  >("PAYMENTS");
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState<PaymentFilterSchema>({
    search: "",
    date: "LAST_30_DAYS",
    status: "ALL",
    method: "ALL",
  });
  const [page, setPage] = useState(1);
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const transactions = useQuery({
    queryKey: ["payments", "transactions", filters, page],
    queryFn: () => transactionsAdapter.list(filters, page, 7),
  });
  const hasFilters =
    filters.search.trim() !== "" ||
    filters.status !== "ALL" ||
    filters.method !== "ALL" ||
    filters.date !== "LAST_30_DAYS";
  // A filtered zero-result response does not mean the platform has no payments.
  const unfilteredTransactions = useQuery({
    queryKey: ["payments", "transactions", "empty-check"],
    queryFn: () => transactionsAdapter.list(
      { search: "", date: "LAST_30_DAYS", status: "ALL", method: "ALL" },
      1,
      1,
    ),
    enabled: hasFilters && transactions.data?.total === 0,
  });
  const isEmpty = transactions.data?.total === 0 &&
    (!hasFilters || unfilteredTransactions.data?.total === 0);
  const changeFilters = (changes: Partial<PaymentFilterSchema>) => {
    setFilters((previous) => ({ ...previous, ...changes }));
    if (changes.search !== undefined) setSearch(changes.search);
    setPage(1);
  };
  const retry = async (id: string) => {
    setRetryingId(id);
    try {
      const result = await transactionsAdapter.retry(id);
      toast.info(result.message);
      await transactions.refetch();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Unable to retry payment.");
    } finally {
      setRetryingId(null);
    }
  };

  // Manual Payout Trigger state
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [payoutReason, setPayoutReason] = useState("");

  // Manual Refund Trigger state
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] =
    useState<PaymentItem | null>(null);
  const [refundAmount, setRefundAmount] = useState("");
  const [refundDescription, setRefundDescription] = useState("");
  const path = usePathname();
  const pathname = path.split("/");

  // Service Fee calculation: summed from Payment.serviceFee
  const totalServiceFee = payments
    .filter((p) => p.status === "Successful")
    .reduce((sum, p) => sum + p.serviceFee, 0);

  const totalHeldEscrow = payouts
    .filter((p) => p.status === "Pending")
    .reduce((sum, p) => sum + p.finalAmount, 0);

  const handleTriggerManualPayout = () => {
    if (!selectedPayout || !payoutReason.trim()) {
      toast.error("Please specify a reason for manual payout trigger.");
      return;
    }

    const idempotencyKey = `PYO-IDEM-${Date.now()}`;

    setPayouts((prev) =>
      prev.map((p) =>
        p.id === selectedPayout.id ? { ...p, status: "Successful" } : p,
      ),
    );

    toast.success(
      `Manual Payout ${selectedPayout.referenceId} executed via Paystack Transfer API! Idempotency key [${idempotencyKey}] recorded in AuditLog.`,
    );
    setSelectedPayout(null);
    setPayoutReason("");
  };

  const handleTriggerManualRefund = () => {
    if (
      !selectedPaymentForRefund ||
      !refundAmount ||
      !refundDescription.trim()
    ) {
      toast.error(
        "Please fill in the refund amount and mandatory admin description.",
      );
      return;
    }

    const newRef: RefundItem = {
      id: `ref-${Date.now()}`,
      referenceId: `REF-${Date.now().toString().slice(-6)}`,
      paymentId: selectedPaymentForRefund.id,
      engagementId: selectedPaymentForRefund.engagementId,
      amount: parseFloat(refundAmount),
      destination: "Original Payment Method", // Strictly fixed
      processingFee: 0,
      description: refundDescription,
      initiatedByStaffId: "sprof-finance-current",
      createdAt: new Date().toISOString(),
    };

    setRefunds([newRef, ...refunds]);
    toast.success(
      `Manual refund of ₦${parseFloat(refundAmount).toLocaleString()} dispatched strictly to Original Payment Method (Paystack)!`,
    );
    setSelectedPaymentForRefund(null);
    setRefundAmount("");
    setRefundDescription("");
  };

  const handleCSVExport = async () => {
    let exportRows;
    try {
      exportRows = (await transactionsAdapter.list(filters, 1, Number.MAX_SAFE_INTEGER)).rows;
    } catch {
      toast.error("Unable to export transactions.");
      return;
    }
    if (exportRows.length === 0) {
      toast.error("No payments to export.");
      return;
    }

    const rows = [
      ["Reference", "Type", "Payer", "Gross", "ServiceFee", "GatewayFee", "Status", "CreatedAt"],
      ...exportRows.map(({ payment }) => [
        payment.referenceId,
        payment.paymentType,
        payment.payerProfileName,
        payment.grossAmount,
        payment.serviceFee,
        payment.processingFee,
        payment.status,
        payment.createdAt,
      ]),
    ];
    const csv = rows
      .map((row) => row.map((value) => {
        const text = String(value);
        const cell = typeof value === "string" && /^[=+@\-\t\r\n]/.test(text)
          ? `'${text}`
          : text;
        return `"${cell.replaceAll('"', '""')}"`;
      }).join(","))
      .join("\r\n");
    const blob = new Blob(["\uFEFF", csv], { type: "text/csv;charset=utf-8;" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hoste_payments_export_${Date.now()}.csv`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    toast.success("CSV export generated successfully.");
  };

  return (
    <>
      <Toaster />
      <PaymentHeader
        searchQuery={search}
        onSearchChange={(value) => changeFilters({ search: value })}
      />
      <div className="page-content">
        <div className="container mx-auto px-6">
          {transactions.isPending ? <PaymentsLoadingState /> : transactions.isError ? (
            <PaymentsErrorState
              message={transactions.error.message}
              onRetry={() => void transactions.refetch()}
              retrying={transactions.isFetching}
            />
          ) : (
            <>
          <div className="heading-breadcrumbs pt-3 flex justify-between items-center">
            <div className="breadcrumbs">
              <span className="capitalize text-[12px] font-medium">
                <Link href="/">Dashboard</Link> &gt; {pathname}{" "}
              </span>
              <h4 className="capitalize font-bold text-[28px]">
                payments overview
              </h4>
            </div>
            <div className="gateway border bg-yellow/10 rounded-lg border-yellow/30 flex items-center gap-3 px-3 py-1">
              <div className="pulse size-1.5 rounded-full bg-secondary animate-pulse"></div>
              <p className="text-secondary text-[12px] font-semibold">
                Gateway: Active
              </p>
            </div>
          </div>
          {isEmpty ? <PaymentsEmptyState /> : (
            <>
          <div className="stats-cards grid grid-cols-4 gap-4 mt-4">
            <Card>
              <CardContent className="p-4 flex justify-between">
                <div className="flex gap-2 items-center text-[#606060]">
                  <TrendingUp className="w-4.5 h-4.5 opacity-80" />
                  <p className="text-[13px] font-medium mt-1 text-[#606060] capitalize">
                    Total Payment
                  </p>
                </div>

                <p className="text-2xl font-bold mt-1 text-[#1A1A1A]">
                  ₦{totalServiceFee.toLocaleString()}
                </p>
                <p className="num-of-trnx text-[12px] text-[#909090] font-normal">
                  154 transactions
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between">
                <div className="flex justify-between items-center text-[#606060]">
                  <div className="left flex gap-2 items-center">
                    <CircleCheckBig className="w-4.5 h-4.5 opacity-80" />
                    <p className="text-[13px] font-medium mt-1 text-[#606060] capitalize">
                      Successful
                    </p>
                  </div>
                  <div className="right size-2 rounded-full bg-[#006837]"></div>
                </div>
                <p className="text-2xl font-bold mt-1 text-[#1A1A1A]">
                  ₦{totalHeldEscrow.toLocaleString()}
                </p>
                <p className="num-of-trnx text-[12px] text-[#909090] font-normal">
                  139 transactions <span>{}</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between">
                <div className="flex justify-between items-center text-[#606060]">
                  <div className="left flex gap-2 items-center justify-center">
                    <Clock3 className="w-4.5 h-4.5 opacity-80" />
                    <p className="text-[13px] font-medium mt-1 text-[#606060] capitalize">
                      Pending
                    </p>
                  </div>
                  <div className="right size-2 rounded-full bg-[#D97706]"></div>
                </div>
                <p className="text-2xl font-bold mt-1 text-[#1A1A1A]">
                  ₦{totalHeldEscrow.toLocaleString()}
                </p>
                <p className="num-of-trnx text-[12px] text-[#909090] font-normal">
                  139 transactions <span>{}</span>
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 flex justify-between">
                <div className="flex justify-between items-center text-[#606060]">
                  <div className="left flex gap-2 items-center justify-center">
                    <CircleAlert className="w-4.5 h-4.5 opacity-80" />
                    <p className="text-[13px] font-medium mt-1 text-[#606060] capitalize">
                      failed
                    </p>
                  </div>
                  <div className="right size-2 rounded-full bg-[#D97706]"></div>
                </div>
                <p className="text-2xl font-bold mt-1 text-[#1A1A1A]">
                  ₦{totalHeldEscrow.toLocaleString()}
                </p>
                <p className="num-of-trnx text-[12px] text-[#909090] font-normal">
                  139 transactions <span>{}</span>
                </p>
              </CardContent>
            </Card>
          </div>
          <div className="filter-bar mt-4">
            <PaymentFilter
              onExport={handleCSVExport}
              filters={filters}
              onFiltersChange={changeFilters}
            />
          </div>
          <PaymentTable
            transactions={transactions.data?.rows ?? []}
            total={transactions.data?.total ?? 0}
            page={page}
            onPageChange={setPage}
            onRetry={retry}
            retryingId={retryingId}
          />
            </>
          )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
