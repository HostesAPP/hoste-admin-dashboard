"use client";

import { useState } from "react";
import { PageHeaderLayout } from "@/components/shared/PageHeaderLayout";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { CreditCard, DollarSign, Download, RefreshCw, Send, ShieldCheck, Lock, AlertCircle, Search } from "lucide-react";
import { toast } from "sonner";
import { MOCK_PAYMENTS, MOCK_PAYOUTS, MOCK_REFUNDS } from "@/features/payments/data/payments.data";
import { PaymentItem, PayoutItem, RefundItem } from "@/features/payments/types/payments.types";

export default function PaymentsPage() {
  const [payments, setPayments] = useState<PaymentItem[]>(MOCK_PAYMENTS);
  const [payouts, setPayouts] = useState<PayoutItem[]>(MOCK_PAYOUTS);
  const [refunds, setRefunds] = useState<RefundItem[]>(MOCK_REFUNDS);

  const [activeTab, setActiveTab] = useState<"PAYMENTS" | "PAYOUTS" | "REFUNDS">("PAYMENTS");
  const [search, setSearch] = useState("");

  // Manual Payout Trigger state
  const [selectedPayout, setSelectedPayout] = useState<PayoutItem | null>(null);
  const [payoutReason, setPayoutReason] = useState("");

  // Manual Refund Trigger state
  const [selectedPaymentForRefund, setSelectedPaymentForRefund] = useState<PaymentItem | null>(null);
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
        p.id === selectedPayout.id
          ? { ...p, status: "Successful" }
          : p
      )
    );

    toast.success(
      `Manual Payout ${selectedPayout.referenceId} executed via Paystack Transfer API! Idempotency key [${idempotencyKey}] recorded in AuditLog.`
    );
    setSelectedPayout(null);
    setPayoutReason("");
  };

  const handleTriggerManualRefund = () => {
    if (!selectedPaymentForRefund || !refundAmount || !refundDescription.trim()) {
      toast.error("Please fill in the refund amount and mandatory admin description.");
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
      `Manual refund of ₦${parseFloat(refundAmount).toLocaleString()} dispatched strictly to Original Payment Method (Paystack)!`
    );
    setSelectedPaymentForRefund(null);
    setRefundAmount("");
    setRefundDescription("");
  };

  const handleCSVExport = () => {
    const headers = "Reference,Type,Payer,Gross,ServiceFee,GatewayFee,Status,CreatedAt\n";
    const rows = payments
      .map(
        (p) =>
          `${p.referenceId},${p.paymentType},"${p.payerProfileName}",${p.grossAmount},${p.serviceFee},${p.processingFee},${p.status},${p.createdAt}`
      )
      .join("\n");
    const blob = new Blob([headers + rows], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `hoste_payments_export_${Date.now()}.csv`;
    a.click();
    toast.success("CSV export generated successfully.");
  };

  return (
    <PageHeaderLayout
      title="Payments, Payouts & Escrow Ledger"
      description="Track platform service fee revenue, held escrow funds, idempotency-backed manual payouts, and Paystack direct refunds."
    >
      <div className="space-y-6">
        {/* Metric Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Service Fee Earned</p>
                <p className="text-2xl font-bold mt-1 text-emerald-600">
                  ₦{totalServiceFee.toLocaleString()}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-emerald-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Held Escrow Funds</p>
                <p className="text-2xl font-bold mt-1 text-amber-600">
                  ₦{totalHeldEscrow.toLocaleString()}
                </p>
              </div>
              <Lock className="w-8 h-8 text-amber-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Pending Payout Queue</p>
                <p className="text-2xl font-bold mt-1">
                  {payouts.filter((p) => p.status === "Pending").length}
                </p>
              </div>
              <CreditCard className="w-8 h-8 text-blue-500 opacity-80" />
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 flex items-center justify-between">
              <div>
                <p className="text-xs text-muted-foreground font-medium">Refund Total Executed</p>
                <p className="text-2xl font-bold mt-1 text-rose-600">
                  ₦{refunds.reduce((sum, r) => sum + r.amount, 0).toLocaleString()}
                </p>
              </div>
              <RefreshCw className="w-8 h-8 text-rose-500 opacity-80" />
            </CardContent>
          </Card>
        </div>

        {/* Tab Selection & CSV Export */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-border pb-3">
          <div className="flex items-center gap-2">
            <Button
              variant={activeTab === "PAYMENTS" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setActiveTab("PAYMENTS")}
            >
              Inbound Payments
            </Button>
            <Button
              variant={activeTab === "PAYOUTS" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setActiveTab("PAYOUTS")}
            >
              Held Escrow & Payouts
            </Button>
            <Button
              variant={activeTab === "REFUNDS" ? "default" : "outline"}
              size="sm"
              className="text-xs"
              onClick={() => setActiveTab("REFUNDS")}
            >
              Refunds Ledger
            </Button>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative w-64">
              <Search className="absolute left-3 top-2.5 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                placeholder="Search ledger..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-8 text-xs h-8"
              />
            </div>
            <Button variant="outline" size="sm" onClick={handleCSVExport} className="text-xs h-8 gap-1.5">
              <Download className="w-3.5 h-3.5" />
              Export CSV
            </Button>
          </div>
        </div>

        {/* PAYMENTS TAB */}
        {activeTab === "PAYMENTS" && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">Reference / Payer</TableHead>
                  <TableHead className="text-xs">Type</TableHead>
                  <TableHead className="text-xs">Gross Amount</TableHead>
                  <TableHead className="text-xs">Service Fee (10%)</TableHead>
                  <TableHead className="text-xs">Gateway Processing Fee</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payments.map((pmt) => (
                  <TableRow key={pmt.id}>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold">{pmt.payerProfileName}</span>
                        <span className="text-[10px] text-muted-foreground">{pmt.referenceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="secondary" className="text-[10px]">
                        {pmt.paymentType}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs font-semibold">₦{pmt.grossAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-semibold text-emerald-600">
                      ₦{pmt.serviceFee.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      ₦{pmt.processingFee.toLocaleString()}
                    </TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          pmt.status === "Successful"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                            : "bg-rose-50 text-rose-700 border-rose-200 text-[10px]"
                        }
                      >
                        {pmt.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pmt.status === "Successful" && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="text-xs h-7 text-rose-600 hover:text-rose-700 border-rose-200"
                          onClick={() => {
                            setSelectedPaymentForRefund(pmt);
                            setRefundAmount(pmt.grossAmount.toString());
                          }}
                        >
                          Trigger Refund
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* HELD ESCROW & PAYOUTS TAB */}
        {activeTab === "PAYOUTS" && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">Payout Ref / Recipient</TableHead>
                  <TableHead className="text-xs">Bank Account Details</TableHead>
                  <TableHead className="text-xs">Gross Engagement Value</TableHead>
                  <TableHead className="text-xs">Net Payout Amount (Locked)</TableHead>
                  <TableHead className="text-xs">Escrow Days</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {payouts.map((pyo) => (
                  <TableRow key={pyo.id}>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-semibold">{pyo.recipientProfileName}</span>
                        <span className="text-[10px] text-muted-foreground">{pyo.referenceId}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex flex-col text-xs">
                        <span className="font-medium">{pyo.bankAccountName}</span>
                        <span className="text-[10px] text-muted-foreground">{pyo.bankName} • {pyo.accountNumber}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs">₦{pyo.grossAmount.toLocaleString()}</TableCell>
                    <TableCell className="text-xs font-bold text-emerald-600">
                      ₦{pyo.finalAmount.toLocaleString()}
                    </TableCell>
                    <TableCell className="text-xs text-muted-foreground">{pyo.heldEscrowDays} days</TableCell>
                    <TableCell>
                      <Badge
                        variant="outline"
                        className={
                          pyo.status === "Successful"
                            ? "bg-emerald-50 text-emerald-700 border-emerald-200 text-[10px]"
                            : "bg-amber-50 text-amber-700 border-amber-200 text-[10px]"
                        }
                      >
                        {pyo.status}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      {pyo.status === "Pending" && (
                        <Button
                          size="sm"
                          className="text-xs h-7 bg-emerald-600 hover:bg-emerald-700"
                          onClick={() => setSelectedPayout(pyo)}
                        >
                          Manual Payout
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* REFUNDS TAB */}
        {activeTab === "REFUNDS" && (
          <div className="border border-border rounded-lg bg-card overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead className="text-xs">Refund Ref</TableHead>
                  <TableHead className="text-xs">Refund Amount</TableHead>
                  <TableHead className="text-xs">Destination (PRD Constraint)</TableHead>
                  <TableHead className="text-xs">Admin Reason / Description</TableHead>
                  <TableHead className="text-xs">Initiated By</TableHead>
                  <TableHead className="text-xs">Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {refunds.map((ref) => (
                  <TableRow key={ref.id}>
                    <TableCell className="text-xs font-mono font-semibold">{ref.referenceId}</TableCell>
                    <TableCell className="text-xs font-bold text-rose-600">₦{ref.amount.toLocaleString()}</TableCell>
                    <TableCell>
                      <Badge variant="outline" className="bg-muted text-[10px]">
                        {ref.destination}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-xs max-w-xs">{ref.description}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">{ref.initiatedByStaffId}</TableCell>
                    <TableCell className="text-xs text-muted-foreground">
                      {new Date(ref.createdAt).toLocaleDateString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}

        {/* Manual Payout Modal */}
        {selectedPayout && (
          <Dialog open={!!selectedPayout} onOpenChange={(open) => !open && setSelectedPayout(null)}>
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold flex items-center gap-2">
                  <Send className="w-4 h-4 text-emerald-600" />
                  Manual Payout Trigger (Paystack Transfer API)
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div className="p-3 bg-muted/40 rounded-md">
                  <p><strong>Recipient:</strong> {selectedPayout.recipientProfileName}</p>
                  <p><strong>Bank:</strong> {selectedPayout.bankName} ({selectedPayout.accountNumber})</p>
                  <p><strong>Net Payout Amount:</strong> ₦{selectedPayout.finalAmount.toLocaleString()}</p>
                </div>

                <div>
                  <label className="font-semibold block mb-1">Mandatory Reason for Manual Override</label>
                  <Textarea
                    placeholder="e.g. System webhook failed to trigger automatically following engagement finalization..."
                    value={payoutReason}
                    onChange={(e) => setPayoutReason(e.target.value)}
                    className="text-xs min-h-[70px]"
                  />
                </div>

                <div className="p-2 bg-amber-500/10 border border-amber-500/20 rounded text-[11px] text-amber-800 dark:text-amber-200">
                  <strong>Idempotency Enforced:</strong> Manual payout generates a unique idempotency key to prevent double transfers.
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelectedPayout(null)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleTriggerManualPayout} className="text-xs bg-emerald-600 hover:bg-emerald-700">
                  Execute Manual Transfer
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}

        {/* Manual Refund Modal */}
        {selectedPaymentForRefund && (
          <Dialog
            open={!!selectedPaymentForRefund}
            onOpenChange={(open) => !open && setSelectedPaymentForRefund(null)}
          >
            <DialogContent className="max-w-md">
              <DialogHeader>
                <DialogTitle className="text-sm font-bold text-rose-600 flex items-center gap-2">
                  <RefreshCw className="w-4 h-4" />
                  Manual Refund Trigger (Original Payment Method)
                </DialogTitle>
              </DialogHeader>

              <div className="space-y-3 text-xs">
                <div className="p-2 bg-rose-500/10 border border-rose-500/20 rounded text-[11px] text-rose-800 dark:text-rose-200">
                  <strong>Rule (DB v1.2):</strong> Destination is strictly locked to <code>Original Payment Method (Paystack)</code>. No internal wallet exists.
                </div>

                <div>
                  <label className="font-semibold block mb-1">Refund Amount (₦)</label>
                  <Input
                    type="number"
                    value={refundAmount}
                    onChange={(e) => setRefundAmount(e.target.value)}
                    className="text-xs"
                  />
                </div>

                <div>
                  <label className="font-semibold block mb-1">Mandatory Description (Admin-Only)</label>
                  <Textarea
                    placeholder="Provide admin-only description for triggering this refund..."
                    value={refundDescription}
                    onChange={(e) => setRefundDescription(e.target.value)}
                    className="text-xs min-h-[70px]"
                  />
                  <span className="text-[10px] text-muted-foreground mt-0.5 block">
                    This description is strictly omitted from customer-facing API responses.
                  </span>
                </div>
              </div>

              <DialogFooter>
                <Button variant="outline" size="sm" onClick={() => setSelectedPaymentForRefund(null)} className="text-xs">
                  Cancel
                </Button>
                <Button size="sm" onClick={handleTriggerManualRefund} className="text-xs bg-rose-600 hover:bg-rose-700">
                  Confirm Paystack Refund
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </div>
    </PageHeaderLayout>
  );
}
