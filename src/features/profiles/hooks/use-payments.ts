"use client";

import { useState } from "react";
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

export function usePayments() {
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
    const headers =
      "Reference,Type,Payer,Gross,ServiceFee,GatewayFee,Status,CreatedAt\n";
    const rows = payments
      .map(
        (p) =>
          `${p.referenceId},${p.paymentType},"${p.payerProfileName}",${p.grossAmount},${p.serviceFee},${p.processingFee},${p.status},${p.createdAt}`,
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hoste_payments_export_${Date.now()}.csv`;
    a.click();
    toast.success("CSV export generated successfully.");

    return {
      payments,
      payouts,
      refunds,
      activeTab,
      search,
      totalHeldEscrow,
      totalServiceFee,
      handleCSVExport,
      handleTriggerManualPayout,
      handleTriggerManualRefund,
    };
  };
}
