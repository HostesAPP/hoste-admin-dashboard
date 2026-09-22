// features/revenue/components/details/TransactionActionButtons.tsx

"use client";

import React, { useState } from "react";
import Link from "next/link";
import { Download, FileText, ExternalLink, RotateCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

interface TransactionActionButtonsProps {
  bookingId: string;
  transactionId: string;
}

export function TransactionActionButtons({
  bookingId,
  transactionId,
}: TransactionActionButtonsProps) {
  const [isRefunding, setIsRefunding] = useState(false);

  const handleDownloadReceipt = () => {
    // Generate/download PDF receipt simulation
    window.print();
  };

  const handleExport = () => {
    // CSV / JSON export
    const blob = new Blob(
      [
        JSON.stringify(
          { transactionId, bookingId, exportedAt: new Date().toISOString() },
          null,
          2
        ),
      ],
      { type: "application/json" }
    );
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `${transactionId}-export.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex flex-wrap items-center gap-3 pt-2">
      {/* 1. Download Receipt */}
      <Button
        type="button"
        onClick={handleDownloadReceipt}
        className="h-10 px-6 rounded-xl bg-primary text-primary-foreground hover:bg-primary/90 text-xs font-semibold transition-all shadow-xs cursor-pointer"
      >
        Download Receipt
      </Button>

      {/* 2. Export Transaction */}
      <Button
        type="button"
        variant="outline"
        onClick={handleExport}
        className="h-10 px-5 rounded-xl border-border/80 bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-colors cursor-pointer"
      >
        Export Transaction
      </Button>

      {/* 3. View Booking */}
      <Link
        href={`/bookings/${bookingId}`}
        className="inline-flex items-center justify-center h-10 px-5 rounded-xl border border-border/80 bg-card hover:bg-muted/50 text-foreground text-xs font-semibold transition-colors cursor-pointer"
      >
        View Booking
      </Link>

      {/* 4. Issue Refund */}
      <Button
        type="button"
        variant="outline"
        onClick={() => setIsRefunding(true)}
        className="h-10 px-5 rounded-xl border-destructive/60 text-destructive hover:bg-destructive/5 text-xs font-semibold transition-colors cursor-pointer"
      >
        Issue Refund
      </Button>
    </div>
  );
}
