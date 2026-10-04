"use client";

import { useState } from "react";
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

export default function PaymentsView() {
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS);
  const [payouts, setPayouts] = useState<PayoutItem[]>(MOCK_PAYOUTS);
  const [refunds, setRefunds] = useState<RefundItem[]>(MOCK_REFUNDS);

  const [activeTab, setActiveTab] = useState<
    "PAYMENTS" | "PAYOUTS" | "REFUNDS"
  >("PAYMENTS");
  const [search, setSearch] = useState("");

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

  const handleCSVExport = () => {
    if (payments.length === 0) {
      toast.error("No payments to export.");
      return;
    }

    const rows = [
      ["Reference", "Type", "Payer", "Gross", "ServiceFee", "GatewayFee", "Status", "CreatedAt"],
      ...payments.map((payment) => [
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
      <PaymentHeader
        searchQuery={search}
        onSearchChange={handleTriggerManualPayout}
      />
      <div className="page-content">
        <div className="container mx-auto px-6">
          <div className="heading-breadcrumbs pt-3 flex justify-between items-center">
            <div className="breadcrumbs">
              <span className="capitalize text-[12px] font-medium">
                <Link href="/">Dashboard</Link> &gt; {pathname}{" "}
              </span>
              <h4 className="capitalize font-bold text-[28px]">
                payments overview
              </h4>
            </div>
            <div className="gateway border bg-[#FFFFDC] rounded-3xl border-[#EBEB9B] flex items-center gap-3 px-3 py-1">
              <div className="pulse size-1.5 rounded-full bg-[#006837] animate-pulse"></div>
              <p className="text-[#006837] text-[12px] font-semibold">
                Gateway: Active
              </p>
            </div>
          </div>
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
            <PaymentFilter onExport={handleCSVExport} />
          </div>
        </div>
      </div>
    </>
  );
}
