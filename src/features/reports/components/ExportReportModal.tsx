"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Download, FileText, CheckCircle2 } from "lucide-react";
import type { ReportTransaction } from "../types/reports.types";

interface ExportReportModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  transactions: ReportTransaction[];
}

export const ExportReportModal: React.FC<ExportReportModalProps> = ({
  open,
  onOpenChange,
  transactions,
}) => {
  const [format, setFormat] = useState<"csv" | "xlsx" | "pdf">("csv");
  const [scope, setScope] = useState<"current" | "all">("all");
  const [isExporting, setIsExporting] = useState(false);

  const handleExport = () => {
    setIsExporting(true);

    const headers = [
      "TXN ID",
      "Customer/Brand",
      "User Type",
      "Booking ID",
      "Booking Type",
      "Amount",
      "Commission",
      "Payment Method",
      "Status",
      "Date",
    ];

    const rows = transactions.map((t) => [
      t.txnId,
      t.customerName,
      t.customerType,
      t.bookingId,
      t.bookingType,
      t.amount,
      t.commission,
      t.paymentMethod,
      t.status,
      t.date,
    ]);

    const csvContent =
      "data:text/csv;charset=utf-8," +
      [headers.join(",")]
        .concat(rows.map((row) => row.map((cell) => `"${cell}"`).join(",")))
        .join("\n");

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute(
      "download",
      `hoste_revenue_payments_report_${new Date().toISOString().slice(0, 10)}.csv`
    );
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      setIsExporting(false);
      onOpenChange(false);
    }, 400);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md rounded-2xl">
        <DialogHeader className="gap-2">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10 text-primary">
              <Download className="h-5 w-5" />
            </div>
            <div>
              <DialogTitle className="text-lg font-bold">
                Export Revenue & Payments Report
              </DialogTitle>
              <DialogDescription className="text-xs text-muted-foreground">
                Download financial and transaction records for analysis
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4 py-2 text-xs">
          {/* Export Format */}
          <div className="space-y-2">
            <label className="font-bold text-foreground">File Format</label>
            <div className="grid grid-cols-3 gap-2">
              {[
                { id: "csv", label: "CSV (.csv)" },
                { id: "xlsx", label: "Excel (.xlsx)" },
                { id: "pdf", label: "PDF (.pdf)" },
              ].map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setFormat(item.id as "csv" | "xlsx" | "pdf")}
                  className={`p-2.5 rounded-xl border flex flex-col items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    format === item.id
                      ? "border-primary bg-primary/10 font-bold text-primary"
                      : "border-border hover:bg-muted text-muted-foreground"
                  }`}
                >
                  <FileText className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Export Scope */}
          <div className="space-y-2">
            <label className="font-bold text-foreground">Data Scope</label>
            <div className="space-y-2">
              <label
                onClick={() => setScope("all")}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === "all"
                    ? "border-primary bg-primary/10 font-semibold"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div>
                  <span className="text-foreground">Full Period Report</span>
                  <p className="text-[11px] text-muted-foreground">
                    All 1,542 transactions in the selected date range
                  </p>
                </div>
                {scope === "all" && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
              </label>

              <label
                onClick={() => setScope("current")}
                className={`flex items-center justify-between p-3 rounded-xl border cursor-pointer transition-all ${
                  scope === "current"
                    ? "border-primary bg-primary/10 font-semibold"
                    : "border-border hover:bg-muted"
                }`}
              >
                <div>
                  <span className="text-foreground">Filtered View</span>
                  <p className="text-[11px] text-muted-foreground">
                    Only currently visible filtered transactions ({transactions.length})
                  </p>
                </div>
                {scope === "current" && (
                  <CheckCircle2 className="w-4 h-4 text-primary" />
                )}
              </label>
            </div>
          </div>
        </div>

        <DialogFooter className="pt-2 border-t border-border">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="rounded-xl"
          >
            Cancel
          </Button>
          <Button
            type="button"
            onClick={handleExport}
            disabled={isExporting}
            className="bg-primary hover:bg-primary/90 text-primary-foreground font-semibold rounded-xl"
          >
            {isExporting ? "Generating..." : "Download Export"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
